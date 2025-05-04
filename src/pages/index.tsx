import Head from 'next/head';
import BitcoinPriceCard from '@/components/BitcoinPriceCard';

export default function Home() {
  return (
    <>
      <Head>
        <title>Crypto Coaster - BTC & Satoshi Price</title>
        <meta name="description" content="Track the current Bitcoin price, Satoshi price, and Satoshis per cent in real-time" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 p-4 text-center font-sans">
        <BitcoinPriceCard />
      </main>
    </>
  );
}