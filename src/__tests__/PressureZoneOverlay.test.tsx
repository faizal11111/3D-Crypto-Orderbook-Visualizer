import React from 'react';
import { render, screen } from '@testing-library/react';
import { VenueProvider } from '../context/VenueContext';
import { FilterProvider } from '../context/FilterContext';
import PressureZoneOverlay from '../components/PressureZoneOverlay';

const mockBids = [
  { price: 100, quantity: 5, venue: 'Binance' },
  { price: 99, quantity: 10, venue: 'OKX' },
];

const mockAsks = [
  { price: 101, quantity: 7, venue: 'Bybit' },
  { price: 102, quantity: 3, venue: 'Deribit' },
];

describe('PressureZoneOverlay Component', () => {
  it('renders without crashing', () => {
    render(
      <VenueProvider>
        <FilterProvider>
          <PressureZoneOverlay bids={mockBids} asks={mockAsks} />
        </FilterProvider>
      </VenueProvider>
    );
    // Check if canvas or overlay element is present
    const overlayElement = screen.getByTestId('pressure-zone-overlay');
    expect(overlayElement).toBeInTheDocument();
  });

  // Additional tests for pressure zone data visualization can be added here
});
