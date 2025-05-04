# Hodl Helper

A simple web application that displays real-time Bitcoin price data including BTC price, Satoshi price, and Satoshis per cent.

## Features

- **Real-time Bitcoin Price**: Displays the current price of Bitcoin in USD
- **Satoshi Price**: Shows the price of one Satoshi (the smallest unit of Bitcoin) in USD
- **Satoshis per Cent**: Shows how many Satoshis you can buy with 1¢ (USD)
- **Auto-refresh**: Automatically updates price data every 60 seconds
- **Responsive Design**: Optimized for both desktop and mobile devices
- **Error Handling**: Gracefully handles API rate limits and connection issues

## Tech Stack

- **Next.js**: React framework for server-rendered applications
- **TypeScript**: For type-safe code
- **Tailwind CSS**: For utility-first styling
- **Vercel**: For deployment
- **GitHub Actions**: For CI/CD

## Getting Started

### Prerequisites

- Node.js (v18 or newer)
- npm or yarn

### Local Development

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/hodl-helper.git
   cd hodl-helper
   ```

2. Install dependencies:
   ```
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application

### Building for Production

Build the application for production:
```
npm run build
# or
yarn build
```

You can then start the production server:
```
npm run start
# or
yarn start
```

## Deployment

This project is configured to deploy automatically to Vercel using GitHub Actions.

### Setting up Vercel Deployment

1. Create a Vercel account if you don't already have one
2. Install Vercel CLI: `npm i -g vercel`
3. Link your project to Vercel: `vercel link`
4. Set up GitHub repository secrets:
   - VERCEL_TOKEN: Your Vercel API token
   - VERCEL_ORG_ID: Your Vercel organization ID
   - VERCEL_PROJECT_ID: Your Vercel project ID

You can get these values by running:
```
vercel env pull .env.local
```

Then check the `.vercel` directory or project settings.

5. Push to the main branch to trigger deployment:
   ```
   git push origin main
   ```

The GitHub Actions workflow will build and deploy your application to Vercel.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Data Source

This application uses the [CoinGecko API](https://www.coingecko.com/en/api) to fetch Bitcoin price data.

## Note

This application is for educational purposes only and should not be used for financial decisions. Cryptocurrency prices are highly volatile.