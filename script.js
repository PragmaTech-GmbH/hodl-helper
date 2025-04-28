// script.js

document.addEventListener('DOMContentLoaded', () => {
    const bitcoinPriceElement = document.getElementById('bitcoin-price');
    const satoshiPriceElement = document.getElementById('satoshi-price');
    // *** Get the new element ***
    const satsPerCentElement = document.getElementById('sats-per-cent-price');
    const updatedElement = document.getElementById('last-updated');
    const apiUrl =
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd';

    const errorClasses = ['text-red-600', 'font-bold'];
    const normalClassesBTC = ['text-orange-500'];
    // Using the same style for both derived prices
    const normalClassesDerived = ['text-orange-400'];

    async function fetchBitcoinPrice() {
        // *** Add new element to the check ***
        if (
            !bitcoinPriceElement ||
            !satoshiPriceElement ||
            !satsPerCentElement || // Check if the new element exists
            !updatedElement
        ) {
            console.error('One or more required HTML elements not found.');
            return;
        }

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                if (response.status === 429) {
                    throw new Error(`Rate limited! Try again later.`);
                }
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();

            if (data.bitcoin && data.bitcoin.usd !== undefined) {
                const btcPrice = data.bitcoin.usd;

                // Format BTC Price
                const formattedBtcPrice = btcPrice.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD'
                });

                // Calculate and Format Satoshi Price
                const satoshiPrice = btcPrice / 100000000;
                const formattedSatoshiPrice = satoshiPrice.toLocaleString(
                    'en-US',
                    {
                        style: 'currency',
                        currency: 'USD',
                        minimumFractionDigits: 8,
                        maximumFractionDigits: 10
                    }
                );

                // *** Calculate and Format Satoshis per Cent ***
                // Sats per Cent = 0.01 USD / (Price per Satoshi in USD)
                // Sats per Cent = 0.01 / (btcPrice / 100,000,000)
                // Sats per Cent = (0.01 * 100,000,000) / btcPrice
                // Sats per Cent = 1,000,000 / btcPrice
                const satsPerCent = 1000000 / btcPrice;
                const formattedSatsPerCent = satsPerCent.toLocaleString(
                    'en-US',
                    {
                        // Usually displayed as a whole number or with few decimals
                        maximumFractionDigits: 0 // Show whole Satoshis
                    }
                );

                // Update BTC HTML
                bitcoinPriceElement.textContent = formattedBtcPrice;
                bitcoinPriceElement.classList.remove(...errorClasses);
                bitcoinPriceElement.classList.add(...normalClassesBTC);

                // Update Satoshi HTML
                satoshiPriceElement.textContent = formattedSatoshiPrice;
                satoshiPriceElement.classList.remove('text-red-600');
                satoshiPriceElement.classList.add(...normalClassesDerived);

                // *** Update Sats per Cent HTML ***
                satsPerCentElement.textContent = formattedSatsPerCent;
                satsPerCentElement.classList.remove('text-red-600');
                satsPerCentElement.classList.add(...normalClassesDerived);

                updatedElement.textContent = `Last updated: ${new Date().toLocaleTimeString()}`;
            } else {
                throw new Error('Unexpected API response format.');
            }

        } catch (error) {
            console.error("Error fetching Bitcoin price:", error);
            const errorMessage = `Error: ${error.message || 'Failed to load'}`;

            // Update BTC HTML for error
            bitcoinPriceElement.textContent = errorMessage;
            bitcoinPriceElement.classList.remove(...normalClassesBTC);
            bitcoinPriceElement.classList.add(...errorClasses);

            // Update Satoshi HTML for error
            satoshiPriceElement.textContent = '-';
            satoshiPriceElement.classList.remove(...normalClassesDerived);
            satoshiPriceElement.classList.add('text-red-600');

            // *** Update Sats per Cent HTML for error ***
            satsPerCentElement.textContent = '-';
            satsPerCentElement.classList.remove(...normalClassesDerived);
            satsPerCentElement.classList.add('text-red-600');

            updatedElement.textContent = `Last attempt: ${new Date().toLocaleTimeString()}`;
        }
    }

    // Initial fetch
    fetchBitcoinPrice();

    // Set interval to fetch price every 60 seconds
    setInterval(fetchBitcoinPrice, 60000);
});
