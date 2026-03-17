import { Connection, PublicKey } from '@solana/web3.js';
import axios from 'axios';
import { TokenInfo } from './types.js';
import { config } from './config.js';

export class PumpfunMonitor {
  private connection: Connection;
  private isMonitoring: boolean = false;
  private checkInterval: NodeJS.Timeout | null = null;
  private lastCheckedTimestamp: number = Date.now();
  
  // Pumpfun program ID and relevant addresses
  private readonly PUMPFUN_PROGRAM_ID = '6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6Px';
  private readonly PUMPFUN_API = 'https://frontend-api.pump.fun';

  constructor(connection: Connection) {
    this.connection = connection;
  }

  public start(onNewPool: (tokenInfo: TokenInfo) => void): void {
    if (this.isMonitoring) {
      console.log('Monitor is already running');
      return;
    }

    this.isMonitoring = true;
    console.log('Starting Pumpfun monitor...');

    // Check for new pools every 1 second
    this.checkInterval = setInterval(async () => {
      try {
        await this.checkForNewPools(onNewPool);
      } catch (error) {
        console.error('Error checking for new pools:', error);
      }
    }, 1000);

    // Also listen to program account changes
    this.listenToProgramChanges(onNewPool);
  }

  public stop(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
    this.isMonitoring = false;
    console.log('Stopped Pumpfun monitor');
  }

  private async checkForNewPools(onNewPool: (tokenInfo: TokenInfo) => void): Promise<void> {
    try {
      // Get recent transactions from Pumpfun program
      const signatures = await this.connection.getSignaturesForAddress(
        new PublicKey(this.PUMPFUN_PROGRAM_ID),
        { limit: 10 },
        'confirmed'
      );

      for (const sig of signatures) {
        if (sig.blockTime && sig.blockTime * 1000 > this.lastCheckedTimestamp) {
          // This is a new transaction, try to extract token info
          const tokenInfo = await this.extractTokenInfoFromTransaction(sig.signature);
          if (tokenInfo) {
            this.lastCheckedTimestamp = sig.blockTime * 1000;
            onNewPool(tokenInfo);
          }
        }
      }
    } catch (error) {
      console.error('Error in checkForNewPools:', error);
    }
  }

  private async extractTokenInfoFromTransaction(signature: string): Promise<TokenInfo | null> {
    try {
      const tx = await this.connection.getTransaction(signature, {
        maxSupportedTransactionVersion: 0,
        commitment: 'confirmed',
      });

      if (!tx || !tx.meta) {
        return null;
      }

      // Look for token creation patterns in the transaction
      // Pumpfun creates tokens with specific account structure
      const accountKeys = tx.transaction.message.accountKeys.map(key => 
        typeof key === 'string' ? key : key.pubkey.toString()
      );

      // Try to get token info from Pumpfun API
      const tokenInfo = await this.getTokenInfoFromAPI(signature);
      if (tokenInfo) {
        return tokenInfo;
      }

      return null;
    } catch (error) {
      console.error('Error extracting token info:', error);
      return null;
    }
  }

  private async getTokenInfoFromAPI(signature: string): Promise<TokenInfo | null> {
    try {
      // Alternative: Monitor Pumpfun API for new tokens
      const response = await axios.get(`${this.PUMPFUN_API}/coins`, {
        params: {
          limit: 10,
          offset: 0,
        },
        timeout: 5000,
      });

      if (response.data && Array.isArray(response.data)) {
        for (const coin of response.data) {
          if (coin.mint && coin.created_timestamp) {
            const timestamp = new Date(coin.created_timestamp).getTime();
            if (timestamp > this.lastCheckedTimestamp) {
              return {
                mint: coin.mint,
                creator: coin.creator || '',
                timestamp: timestamp,
                name: coin.name,
                symbol: coin.symbol,
              };
            }
          }
        }
      }
    } catch (error) {
      // API might not be available, fall back to on-chain monitoring
      console.debug('Pumpfun API not available, using on-chain monitoring');
    }
    return null;
  }

  private listenToProgramChanges(onNewPool: (tokenInfo: TokenInfo) => void): void {
    // Subscribe to program account changes
    this.connection.onProgramAccountChange(
      new PublicKey(this.PUMPFUN_PROGRAM_ID),
      async (accountInfo, context) => {
        try {
          // When a new account is created, it might be a new token
          // Extract token info from account data
          const tokenInfo = await this.parseAccountData(accountInfo.account.data);
          if (tokenInfo) {
            onNewPool(tokenInfo);
          }
        } catch (error) {
          console.error('Error in program account change:', error);
        }
      },
      'confirmed'
    );
  }

  private async parseAccountData(data: Buffer): Promise<TokenInfo | null> {
    // Parse Pumpfun account structure to extract token info
    // This is a simplified version - actual implementation depends on Pumpfun's account structure
    try {
      // Pumpfun stores token info in specific account format
      // You may need to adjust this based on actual Pumpfun account structure
      return null;
    } catch (error) {
      return null;
    }
  }

  // Alternative method: Monitor via WebSocket for real-time updates
  public async monitorViaWebSocket(onNewPool: (tokenInfo: TokenInfo) => void): Promise<void> {
    try {
      // Connect to Solana WebSocket for real-time transaction monitoring
      const wsUrl = config.rpcUrl.replace('https://', 'wss://').replace('http://', 'ws://');
      
      // This is a placeholder - actual implementation would use WebSocket
      // to monitor Pumpfun program transactions in real-time
      console.log('WebSocket monitoring not fully implemented, using polling instead');
    } catch (error) {
      console.error('Error setting up WebSocket monitoring:', error);
    }
  }
}
