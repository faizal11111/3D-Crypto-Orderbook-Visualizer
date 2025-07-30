import React from 'react';
import { render, screen } from '@testing-library/react';
import { VenueProvider } from '../context/VenueContext';
import { FilterProvider } from '../context/FilterContext';
import Orderbook3D from '../components/Orderbook3D';

jest.mock('../hooks/useOrderbookData', () => ({
  useOrderbookData: () => [
    { price: 100, quantity: 5, side: 'bid' },
    { price: 99, quantity: 10, side: 'bid' },
    { price: 101, quantity: 7, side: 'ask' },
    { price: 102, quantity: 3, side: 'ask' },
  ],
}));

describe('Real-time Data Handling', () => {
  it('renders error message when no data', () => {
    render(
      <VenueProvider>
        <FilterProvider>
          <Orderbook3D orderbookData={[]} />
        </FilterProvider>
      </VenueProvider>
    );

    const errorMessage = screen.getByRole('alert');
    expect(errorMessage).toHaveTextContent(/no orderbook data available/i);
  });

  it('renders canvas when data is provided', () => {
    const mockData = [
      { price: 100, quantity: 5, side: 'bid' as const },
      { price: 99, quantity: 10, side: 'bid' as const },
      { price: 101, quantity: 7, side: 'ask' as const },
      { price: 102, quantity: 3, side: 'ask' as const },
    ];

    render(
      <VenueProvider>
        <FilterProvider>
          <Orderbook3D orderbookData={mockData} />
        </FilterProvider>
      </VenueProvider>
    );

    const canvasElement = screen.getByRole('presentation');
    expect(canvasElement).toBeInTheDocument();
  });
});
