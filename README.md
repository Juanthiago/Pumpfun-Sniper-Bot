# Pumpfun Sniper Bot

A high-performance Solana trading bot that automatically monitors and trades new liquidity pools on Pumpfun.

## Features

- 🔍 **Real-time Monitoring**: Streams new liquidity pools from Pumpfun as they are created
- 🛡️ **Blocklist Protection**: Automatically skips tokens from blocked creator wallets
- ⚡ **Instant Buying**: Executes buy orders immediately when new pools are detected
- 📊 **Smart Selling**: Implements stop loss and take profit strategies
- 🔄 **Position Tracking**: Monitors all active positions and executes sell orders based on price movements

## Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- A Solana wallet with SOL for trading
- A reliable Solana RPC endpoint (recommended: Helius, QuickNode, or Alchemy)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Pumpfun-Sniper-Bot
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file from the example:
```bash
cp .env.example .env
```

4. Configure your `.env` file:
   - Set your `RPC_URL` (use a reliable RPC provider for best performance)
   - Set your `PRIVATE_KEY` (your wallet's private key in Base58 or JSON array format)
   - Adjust trading parameters (stop loss, take profit, buy amount, slippage)

5. Create a `blocklist.txt` file (optional):
   - Add wallet addresses to block, one per line
   - Lines starting with `#` are treated as comments

## Usage

### Development Mode (with auto-reload):
```bash
npm run dev
```

### Production Mode:
```bash
npm run build
npm start
```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `RPC_URL` | Solana RPC endpoint URL | `https://api.mainnet-beta.solana.com` |
| `PRIVATE_KEY` | Your wallet's private key | Required |
| `BLOCKLIST_PATH` | Path to blocklist file | `./blocklist.txt` |
| `STOP_LOSS_PERCENT` | Stop loss percentage | `10` |
| `TAKE_PROFIT_PERCENT` | Take profit percentage | `50` |
| `BUY_AMOUNT` | SOL amount per trade | `0.1` |
| `SLIPPAGE` | Slippage tolerance percentage | `5` |

### Blocklist Format

Create a `blocklist.txt` file with wallet addresses (one per line):
```
# Blocked wallets
7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU
9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM
# Add more addresses below
```

## How It Works

1. **Monitoring**: The bot continuously monitors Pumpfun for new liquidity pools
2. **Filtering**: When a new pool is detected, it checks if the creator wallet is in the blocklist
3. **Buying**: If not blocked, it immediately executes a buy order
4. **Tracking**: The bot tracks the position and monitors price changes
5. **Selling**: Automatically sells when:
   - Stop loss is triggered (price drops by configured percentage)
   - Take profit is triggered (price increases by configured percentage)

## Important Notes

⚠️ **Security Warning**: 
- Never share your private key
- Never commit your `.env` file to version control
- Use a dedicated trading wallet, not your main wallet
- Start with small amounts to test the bot

⚠️ **Trading Risks**:
- This bot executes trades automatically without human intervention
- Cryptocurrency trading involves significant risk
- Only use funds you can afford to lose
- The bot may not always execute trades successfully due to network conditions or liquidity issues

⚠️ **Implementation Notes**:
- The current implementation includes placeholders for Pumpfun swap interactions
- You may need to integrate with Pumpfun's official SDK or API for actual swap execution
- Monitor the bot closely, especially during initial runs

## Project Structure

```
Pumpfun-Sniper-Bot/
├── src/
│   ├── index.ts           # Main entry point
│   ├── config.ts          # Configuration management
│   ├── types.ts           # TypeScript type definitions
│   ├── pumpfun-monitor.ts # Pumpfun pool monitoring
│   ├── blocklist.ts       # Blocklist management
│   └── trading.ts         # Buy/sell logic
├── .env.example           # Environment variables template
├── .gitignore            # Git ignore rules
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── README.md            # This file
```

## Development

### Building
```bash
npm run build
```

### Linting
```bash
npm run lint
```

## Troubleshooting

### Bot not detecting new pools
- Check your RPC endpoint is working and responsive
- Verify you're connected to mainnet (not devnet)
- Check network connectivity

### Buy orders failing
- Ensure you have sufficient SOL balance
- Check your private key is correct
- Verify the RPC endpoint is reliable
- Check if Pumpfun swap integration is properly implemented

### Price monitoring not working
- Verify the token price API is accessible
- Check network connectivity
- Review error logs for specific issues

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details

## Disclaimer

This software is provided "as is" without warranty of any kind. Use at your own risk. The authors are not responsible for any financial losses incurred from using this bot. Always do your own research and trade responsibly.
