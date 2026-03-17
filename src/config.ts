import dotenv from 'dotenv';
import { BotConfig } from './types.js';

dotenv.config();

export const config: BotConfig = {
  rpcUrl: process.env.RPC_URL || 'https://api.mainnet-beta.solana.com',
  privateKey: process.env.PRIVATE_KEY || '',
  blocklistPath: process.env.BLOCKLIST_PATH || './blocklist.txt',
  stopLossPercent: parseFloat(process.env.STOP_LOSS_PERCENT || '10'),
  takeProfitPercent: parseFloat(process.env.TAKE_PROFIT_PERCENT || '50'),
  buyAmount: parseFloat(process.env.BUY_AMOUNT || '0.1'),
  slippage: parseFloat(process.env.SLIPPAGE || '5'),
};

if (!config.privateKey) {
  throw new Error('PRIVATE_KEY is required in .env file');
}
