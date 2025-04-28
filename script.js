// script.js

// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {
    const bitcoinPriceElement = document.getElementById('bitcoin-price');
    const satoshiPriceElement = document.getElementById('satoshi-price');
    const updatedElement = document.getElementById('last-updated');
    const apiUrl =
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd';

    // Tailwind classes defined here for clarity, though they are applied in HTML
    // We'll manage adding/removing error-specific classes
    const errorClasses = ['text-red-600', 'font-bold'];
    const normalClassesBTC = ['text-orange-500']; // For main BTC price
    const normalClassesSatoshi = ['text-orange-400']; // For Satoshi price

    async function fetchBitcoinPrice() {
        // Ensure elements exist before proceeding (robustness)
        if (!bitcoinPriceElement || !satoshiPriceElement || !updatedElement) {
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
                const satoshiPrice = btcPrice / 100000000; // 1 BTC = 100 million Satoshis
                const formattedSatoshiPrice = satoshiPrice.toLocaleString(
                    'en-US',
                    {
                        style: 'currency',
                        currency: 'USD',
                        minimumFractionDigits: 8, // Show enough decimal places
                        maximumFractionDigits: 10
                    }
                );

                // Update BTC HTML
                bitcoinPriceElement.textContent = formattedBtcPrice;
                bitcoinPriceElement.classList.remove(...errorClasses);
                bitcoinPriceElement.classList.add(...normalClassesBTC); // Ensure normal class

                // Update Satoshi HTML
                satoshiPriceElement.textContent = formattedSatoshiPrice;
                satoshiPriceElement.classList.remove('text-red-600'); // Remove potential error color
                satoshiPriceElement.classList.add(...normalClassesSatoshi); // Ensure normal class

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
            satoshiPriceElement.textContent = '-'; // Placeholder on error
            satoshiPriceElement.classList.remove(...normalClassesSatoshi);
            satoshiPriceElement.classList.add('text-red-600'); // Indicate error

            updatedElement.textContent = `Last attempt: ${new Date().toLocaleTimeString()}`;
        }
    }

    // Initial fetch
    fetchBitcoinPrice();

    // Set interval to fetch price every 60 seconds
    setInterval(fetchBitcoinPrice, 60000);
});

