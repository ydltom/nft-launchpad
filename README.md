# NFT Whitelist Raffle - Immutable zkEVM Hackathon Project

A Next.js-based NFT launchpad that allows users to enter raffles for a chance to mint exclusive NFT collections on the Immutable zkEVM Testnet.

## Features

- Connect wallet via MetaMask or other web3 wallets
- View available NFT collections directly from Immutable Primary Sales API
- Purchase NFTs directly through Immutable's checkout widget
- Support for both free and paid mints
- Automatic network switching to Immutable zkEVM Testnet

## Setup

### Prerequisites

- Node.js 18+ 
- pnpm
- An Immutable Developer account with Primary Sales configuration

### Environment Variables

Create a `.env.local` file with the following variables:

```
NEXT_PUBLIC_IMMUTABLE_ENVIRONMENT=sandbox
NEXT_PUBLIC_IMMUTABLE_CLIENT_ID=your_client_id
NEXT_PUBLIC_IMMUTABLE_ENVIRONMENT_ID=your_environment_id
NEXT_PUBLIC_PASSPORT_CLIENT_ID=your_passport_client_id
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

Replace the placeholder values with your actual Immutable project credentials from the [Immutable Developer Hub](https://hub.immutable.com/).

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

## Setting Up Your NFT Collections

1. Create an account on the [Immutable Developer Hub](https://hub.immutable.com/)
2. Create a new project and set up the Primary Sales configuration
3. Choose the simplified mode
4. Create products with the following information:
   - Name
   - Description
   - Image URL
   - Pricing information
   - Quantity
5. Set your environment ID in the `.env.local` file

## Technical Details

This project uses:

- Next.js 15
- React 19
- Tailwind CSS for styling
- Immutable SDK for blockchain integration
- Ethers.js for wallet connection

## Immutable zkEVM Testnet Information

- Chain ID: 13473 (0x3491 in hex)
- RPC URL: https://rpc.testnet.immutable.com
- Block Explorer: https://explorer.testnet.immutable.com
- Currency: IMX