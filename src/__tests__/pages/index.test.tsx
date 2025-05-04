import { render, screen } from '@testing-library/react';
import Home from '@/pages/index';

// Mock the BitcoinPriceCard component
jest.mock('@/components/BitcoinPriceCard', () => {
  return function MockBitcoinPriceCard() {
    return <div data-testid="bitcoin-price-card">Bitcoin Price Card Mock</div>;
  };
});

// Mock the Next.js Head component
jest.mock('next/head', () => {
  return function MockHead({ children }: { children: React.ReactNode }) {
    // This is needed to make the document.title test work
    return <div data-testid="mock-head">{children}</div>;
  };
});

describe('Home page', () => {
  it('contains correct meta title', () => {
    render(<Home />);
    // Instead of checking document.title, check for the title element in the Head component
    const titleElement = screen.getByText('Crypto Coaster - BTC & Satoshi Price');
    expect(titleElement).toBeInTheDocument();
  });

  it('renders the BitcoinPriceCard component', () => {
    render(<Home />);
    
    // Check that the BitcoinPriceCard component is rendered
    const bitcoinPriceCard = screen.getByTestId('bitcoin-price-card');
    expect(bitcoinPriceCard).toBeInTheDocument();
  });

  it('renders with main layout elements', () => {
    render(<Home />);
    
    // Check for main container with correct classes
    const mainElement = screen.getByRole('main');
    expect(mainElement).toBeInTheDocument();
    expect(mainElement).toHaveClass('flex');
    expect(mainElement).toHaveClass('min-h-screen');
    expect(mainElement).toHaveClass('bg-gray-900');
  });
});