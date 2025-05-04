import { render, screen, waitFor } from '@testing-library/react';
import BitcoinPriceCard from '@/components/BitcoinPriceCard';
import { act } from 'react';

// Mock the fetch function
global.fetch = jest.fn();

describe('BitcoinPriceCard', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    (global.fetch as jest.Mock).mockClear();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('initially sets loading state', async () => {
    // Mock implementation to prevent immediate state changes
    (global.fetch as jest.Mock).mockImplementationOnce(() => new Promise(() => {}));
    
    let renderResult;
    await act(async () => {
      renderResult = render(<BitcoinPriceCard />);
    });
    
    // Check that loading state is true in the component
    expect(renderResult.container.textContent).toContain('Loading');
  });

  it('renders bitcoin price data correctly when API call succeeds', async () => {
    const mockResponse = {
      bitcoin: {
        usd: 50000,
      },
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    // Mock the Date toLocaleTimeString
    const mockTime = '10:00:00 AM';
    jest.spyOn(Date.prototype, 'toLocaleTimeString').mockReturnValue(mockTime);

    await act(async () => {
      render(<BitcoinPriceCard />);
    });

    // Wait for the fetch to resolve and component to update
    await waitFor(() => {
      expect(screen.getByText('$50,000.00')).toBeInTheDocument();
    });

    // Check that price data is rendered correctly
    expect(screen.getByText('$0.00050000')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument(); // 1000000 / 50000 = 20
    expect(screen.getByText(`Last updated: ${mockTime}`)).toBeInTheDocument();
  });

  it('renders error state when API call fails', async () => {
    const errorMessage = 'Rate limited! Try again later.';
    
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 429,
    });

    await act(async () => {
      render(<BitcoinPriceCard />);
    });

    // Wait for the fetch to resolve and component to update
    await waitFor(() => {
      expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
    });
  });

  it('sets up interval to update price data', async () => {
    // Mock setInterval to track calls
    const originalSetInterval = global.setInterval;
    global.setInterval = jest.fn(() => 123) as any;
    
    try {
      await act(async () => {
        render(<BitcoinPriceCard />);
      });
      
      // Check that setInterval was called with the correct interval (60 seconds)
      expect(global.setInterval).toHaveBeenCalledWith(expect.any(Function), 60000);
    } finally {
      global.setInterval = originalSetInterval;
    }
  });
});