import { Connection } from '@solana/web3.js';
import { config } from './config.js';
import { PumpfunMonitor } from './pumpfun-monitor.js';
import { BlocklistManager } from './blocklist.js';
import { TradingBot } from './trading.js';
import { TokenInfo } from './types.js';

class SniperBot {
  private connection: Connection;
  private monitor: PumpfunMonitor;
  private blocklist: BlocklistManager;
  private tradingBot: TradingBot;

  constructor() {
    console.log('🤖 Initializing Pumpfun Sniper Bot...\n');
    
    // Initialize connection
    this.connection = new Connection(config.rpcUrl, 'confirmed');
    console.log(`Connected to RPC: ${config.rpcUrl}`);

    // Initialize components
    this.blocklist = new BlocklistManager();
    this.monitor = new PumpfunMonitor(this.connection);
    this.tradingBot = new TradingBot(this.connection, config.privateKey);

    // Setup signal handlers
    this.setupSignalHandlers();
  }

  public async start(): Promise<void> {
    console.log('\n🚀 Starting bot...\n');
    console.log('Configuration:');
    console.log(`  Stop Loss: ${config.stopLossPercent}%`);
    console.log(`  Take Profit: ${config.takeProfitPercent}%`);
    console.log(`  Buy Amount: ${config.buyAmount} SOL`);
    console.log(`  Slippage: ${config.slippage}%`);
    console.log(`  Blocklist: ${config.blocklistPath}\n`);

    // Start price monitoring for sell logic
    this.tradingBot.startPriceMonitoring();

    // Start monitoring new pools
    this.monitor.start(async (tokenInfo: TokenInfo) => {
      await this.handleNewPool(tokenInfo);
    });

    console.log('✅ Bot is running. Monitoring for new liquidity pools...\n');
  }

  private async handleNewPool(tokenInfo: TokenInfo): Promise<void> {
    try {
      console.log(`\n🔍 New pool detected!`);
      console.log(`   Mint: ${tokenInfo.mint}`);
      console.log(`   Creator: ${tokenInfo.creator}`);
      console.log(`   Name: ${tokenInfo.name || 'N/A'}`);
      console.log(`   Symbol: ${tokenInfo.symbol || 'N/A'}`);

      // Check blocklist
      if (this.blocklist.isBlocked(tokenInfo.creator)) {
        console.log(`   ⛔ Creator is in blocklist. Skipping...\n`);
        return;
      }

      console.log(`   ✅ Creator not in blocklist. Executing buy...`);

      // Execute buy
      const success = await this.tradingBot.buy(tokenInfo);
      
      if (success) {
        console.log(`   ✅ Buy order executed successfully!\n`);
      } else {
        console.log(`   ❌ Buy order failed.\n`);
      }
    } catch (error) {
      console.error('Error handling new pool:', error);
    }
  }

  private setupSignalHandlers(): void {
    const gracefulShutdown = () => {
      console.log('\n\n🛑 Shutting down bot...');
      this.monitor.stop();
      this.tradingBot.stopPriceMonitoring();
      
      const positions = this.tradingBot.getPositions();
      if (positions.length > 0) {
        console.log(`\n⚠️  Active positions: ${positions.length}`);
        positions.forEach(pos => {
          console.log(`   - ${pos.mint}: Buy @ ${pos.buyPrice}`);
        });
      }
      
      console.log('✅ Bot stopped gracefully');
      process.exit(0);
    };

    process.on('SIGINT', gracefulShutdown);
    process.on('SIGTERM', gracefulShutdown);
  }
}

// Start the bot
const bot = new SniperBot();
bot.start().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
