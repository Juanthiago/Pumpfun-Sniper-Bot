import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';
import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  getAccount,
  createTransferInstruction,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import bs58 from 'bs58';
import { TradePosition, TokenInfo } from './types.js';
import { config } from './config.js';

export class TradingBot {
  private connection: Connection;
  private wallet: Keypair;
  private positions: Map<string, TradePosition> = new Map();
  private priceCheckInterval: NodeJS.Timeout | null = null;

  constructor(connection: Connection, privateKey: string) {
    this.connection = connection;
    
    // Parse private key (can be array or base58 string)
    let secretKey: Uint8Array;
    try {
      if (privateKey.startsWith('[')) {
        secretKey = new Uint8Array(JSON.parse(privateKey));
      } else {
        secretKey = new Uint8Array(JSON.parse(`[${privateKey}]`));
      }
    } catch {
      // Try as base58
      secretKey = bs58.decode(privateKey);
    }
    
    this.wallet = Keypair.fromSecretKey(secretKey);
    console.log(`Wallet address: ${this.wallet.publicKey.toString()}`);
  }

  public async buy(tokenInfo: TokenInfo): Promise<boolean> {
    try {
      console.log(`\n🚀 Attempting to buy token: ${tokenInfo.mint}`);
      console.log(`Creator: ${tokenInfo.creator}`);
      
      const mintPublicKey = new PublicKey(tokenInfo.mint);
      const buyerPublicKey = this.wallet.publicKey;

      // Get associated token account
      const associatedTokenAccount = await getAssociatedTokenAddress(
        mintPublicKey,
        buyerPublicKey
      );

      // Check if token account exists, create if not
      let tokenAccountExists = false;
      try {
        await getAccount(this.connection, associatedTokenAccount);
        tokenAccountExists = true;
      } catch {
        tokenAccountExists = false;
      }

      // Get current SOL balance
      const balance = await this.connection.getBalance(buyerPublicKey);
      const solBalance = balance / LAMPORTS_PER_SOL;
      
      if (solBalance < config.buyAmount) {
        console.error(`❌ Insufficient SOL balance. Required: ${config.buyAmount}, Available: ${solBalance}`);
        return false;
      }

      // Create transaction
      const transaction = new Transaction();

      // Create associated token account if it doesn't exist
      if (!tokenAccountExists) {
        transaction.add(
          createAssociatedTokenAccountInstruction(
            buyerPublicKey,
            associatedTokenAccount,
            buyerPublicKey,
            mintPublicKey
          )
        );
      }

      // For Pumpfun, we need to interact with their program
      // This is a simplified version - actual implementation depends on Pumpfun's swap interface
      // You may need to use their SDK or interact with their program directly
      
      // Placeholder: In reality, you'd call Pumpfun's swap function
      // For now, we'll simulate the buy process
      console.log(`⚠️  Note: Actual Pumpfun swap implementation required`);
      console.log(`   This would swap ${config.buyAmount} SOL for tokens`);

      // After successful buy, record the position
      const buyPrice = await this.getTokenPrice(tokenInfo.mint);
      if (buyPrice > 0) {
        const position: TradePosition = {
          mint: tokenInfo.mint,
          buyPrice: buyPrice,
          buyTimestamp: Date.now(),
          amount: config.buyAmount,
          stopLoss: config.stopLossPercent,
          takeProfit: config.takeProfitPercent,
        };

        this.positions.set(tokenInfo.mint, position);
        console.log(`✅ Buy order recorded. Price: ${buyPrice}`);
        console.log(`   Stop Loss: ${config.stopLossPercent}%, Take Profit: ${config.takeProfitPercent}%`);
        
        return true;
      }

      return false;
    } catch (error) {
      console.error(`❌ Error buying token ${tokenInfo.mint}:`, error);
      return false;
    }
  }

  public async sell(mint: string): Promise<boolean> {
    try {
      console.log(`\n💰 Attempting to sell token: ${mint}`);
      
      const position = this.positions.get(mint);
      if (!position) {
        console.error(`❌ No position found for ${mint}`);
        return false;
      }

      const mintPublicKey = new PublicKey(mint);
      const sellerPublicKey = this.wallet.publicKey;

      // Get associated token account
      const associatedTokenAccount = await getAssociatedTokenAddress(
        mintPublicKey,
        sellerPublicKey
      );

      // Check token balance
      let tokenBalance = 0;
      try {
        const account = await getAccount(this.connection, associatedTokenAccount);
        tokenBalance = Number(account.amount);
      } catch (error) {
        console.error(`❌ Error getting token balance:`, error);
        return false;
      }

      if (tokenBalance === 0) {
        console.error(`❌ No tokens to sell`);
        this.positions.delete(mint);
        return false;
      }

      // Execute sell through Pumpfun
      // Placeholder: In reality, you'd call Pumpfun's swap function to sell
      console.log(`⚠️  Note: Actual Pumpfun swap implementation required`);
      console.log(`   This would swap ${tokenBalance} tokens back to SOL`);

      // Remove position after sell
      this.positions.delete(mint);
      console.log(`✅ Sell order executed for ${mint}`);
      
      return true;
    } catch (error) {
      console.error(`❌ Error selling token ${mint}:`, error);
      return false;
    }
  }

  public startPriceMonitoring(): void {
    if (this.priceCheckInterval) {
      return;
    }

    console.log('Starting price monitoring for active positions...');
    
    this.priceCheckInterval = setInterval(async () => {
      for (const [mint, position] of this.positions.entries()) {
        try {
          const currentPrice = await this.getTokenPrice(mint);
          if (currentPrice <= 0) continue;

          const priceChange = ((currentPrice - position.buyPrice) / position.buyPrice) * 100;
          
          // Check stop loss
          if (priceChange <= -position.stopLoss) {
            console.log(`\n🛑 Stop loss triggered for ${mint}`);
            console.log(`   Buy Price: ${position.buyPrice}, Current: ${currentPrice}`);
            console.log(`   Loss: ${priceChange.toFixed(2)}%`);
            await this.sell(mint);
            continue;
          }

          // Check take profit
          if (priceChange >= position.takeProfit) {
            console.log(`\n🎯 Take profit triggered for ${mint}`);
            console.log(`   Buy Price: ${position.buyPrice}, Current: ${currentPrice}`);
            console.log(`   Profit: ${priceChange.toFixed(2)}%`);
            await this.sell(mint);
            continue;
          }

          // Log current status
          if (priceChange > 0) {
            console.log(`📈 ${mint}: +${priceChange.toFixed(2)}% (TP: ${position.takeProfit}%, SL: -${position.stopLoss}%)`);
          } else {
            console.log(`📉 ${mint}: ${priceChange.toFixed(2)}% (TP: ${position.takeProfit}%, SL: -${position.stopLoss}%)`);
          }
        } catch (error) {
          console.error(`Error monitoring price for ${mint}:`, error);
        }
      }
    }, 5000); // Check every 5 seconds
  }

  public stopPriceMonitoring(): void {
    if (this.priceCheckInterval) {
      clearInterval(this.priceCheckInterval);
      this.priceCheckInterval = null;
    }
  }

  private async getTokenPrice(mint: string): Promise<number> {
    try {
      // Get token price from Pumpfun API or on-chain data
      // This is a placeholder - actual implementation would fetch real price
      const axios = await import('axios');
      const response = await axios.default.get(`https://frontend-api.pump.fun/coins/${mint}`);
      
      if (response.data && response.data.usd_market_cap) {
        // Calculate price per token (simplified)
        return response.data.usd_market_cap / (response.data.market_cap || 1);
      }
      
      return 0;
    } catch (error) {
      // Fallback: try to get price from on-chain data
      return 0;
    }
  }

  public getPositions(): TradePosition[] {
    return Array.from(this.positions.values());
  }
}
