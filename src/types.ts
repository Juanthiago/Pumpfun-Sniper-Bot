export interface TokenInfo {
  mint: string;
  creator: string;
  timestamp: number;
  name?: string;
  symbol?: string;
}

export interface TradePosition {
  mint: string;
  buyPrice: number;
  buyTimestamp: number;
  amount: number;
  stopLoss: number; // percentage
  takeProfit: number; // percentage
}

export interface BotConfig {
  rpcUrl: string;
  privateKey: string;
  blocklistPath: string;
  stopLossPercent: number;
  takeProfitPercent: number;
  buyAmount: number; // SOL amount
  slippage: number; // percentage
}
