import { useEffect, useState } from 'react';

interface BitcoinPriceData {
  btcPrice: number;
  satoshiPrice: number;
  satsPerCent: number;
  lastUpdated: string;
  error?: string;
}

export default function BitcoinPriceCard() {
  const [priceData, setPriceData] = useState<BitcoinPriceData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBitcoinPrice = async () => {
    try {
      const apiUrl = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd';
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Rate limited! Try again later.');
        }
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.bitcoin && data.bitcoin.usd !== undefined) {
        const btcPrice = data.bitcoin.usd;
        const satoshiPrice = btcPrice / 100000000;
        const satsPerCent = 1000000 / btcPrice;
        
        setPriceData({
          btcPrice,
          satoshiPrice,
          satsPerCent,
          lastUpdated: new Date().toLocaleTimeString()
        });
        setError(null);
      } else {
        throw new Error('Unexpected API response format.');
      }
    } catch (err) {
      setError((err as Error).message || 'Failed to load price data');
      console.error("Error fetching Bitcoin price:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBitcoinPrice();
    
    // Set interval to fetch price every 60 seconds
    const intervalId = setInterval(fetchBitcoinPrice, 60000);
    
    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Format BTC Price
  const formattedBtcPrice = priceData?.btcPrice
    ? priceData.btcPrice.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD'
      })
    : null;

  // Format Satoshi Price
  const formattedSatoshiPrice = priceData?.satoshiPrice
    ? priceData.satoshiPrice.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 8,
        maximumFractionDigits: 10
      })
    : null;

  // Format Sats per Cent
  const formattedSatsPerCent = priceData?.satsPerCent
    ? priceData.satsPerCent.toLocaleString('en-US', {
        maximumFractionDigits: 0
      })
    : null;

  return (
    <div className="rounded-lg bg-gray-800 p-6 shadow-lg sm:p-8">
      <img
        src="https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/btc.png"
        alt="Bitcoin Logo"
        className="mx-auto mb-5 h-16 w-16 sm:h-20 sm:w-20"
        width="96"
        height="96"
      />

      <h1 className="mb-4 text-xl font-bold text-gray-100 sm:text-2xl">
        Current Bitcoin Price (USD)
      </h1>
      <div
        className={`mb-2 min-h-[1.2em] text-3xl font-bold sm:text-4xl ${
          error ? 'text-red-600 font-bold' : 'text-orange-500'
        }`}
      >
        {loading ? 'Loading...' : error ? `Error: ${error}` : formattedBtcPrice}
      </div>

      {/* Satoshi Price Section */}
      <div className="mt-4 pt-4 border-t border-gray-700">
        <h2 className="mb-1 text-sm font-semibold text-gray-300 sm:text-base">
          Price per Satoshi (USD)
        </h2>
        <div
          className={`min-h-[1.2em] text-lg font-medium ${
            error ? 'text-red-600' : 'text-orange-400'
          }`}
        >
          {loading ? 'Loading...' : error ? '-' : formattedSatoshiPrice}
        </div>
      </div>

      {/* Satoshis per Cent Section */}
      <div className="mt-4 pt-4 border-t border-gray-700">
        <h2 className="mb-1 text-sm font-semibold text-gray-300 sm:text-base">
          Satoshis per 1¢ (USD)
        </h2>
        <div
          className={`min-h-[1.2em] text-lg font-medium ${
            error ? 'text-red-600' : 'text-orange-400'
          }`}
        >
          {loading ? 'Loading...' : error ? '-' : formattedSatsPerCent}
        </div>
      </div>

      <div className="mt-5 text-xs text-gray-400 sm:text-sm">
        {priceData?.lastUpdated ? `Last updated: ${priceData.lastUpdated}` : 
         error ? `Last attempt: ${new Date().toLocaleTimeString()}` : ''}
      </div>
    </div>
  );
}