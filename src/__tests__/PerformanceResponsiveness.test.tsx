import React from 'react';
import { render, screen } from '@testing-library/react';
import { VenueProvider } from '../context/VenueContext';
import { FilterProvider } from '../context/FilterContext';
import Orderbook3D from '../components/Orderbook3D';

describe('Performance and Responsiveness', () => {
  it('renders correctly on different screen sizes', () => {
    // This is a placeholder test; actual responsiveness tests may require e2e or visual regression testing
    render(
      <VenueProvider>
        <FilterProvider>
          <Orderbook3D />
        </FilterProvider>
      </VenueProvider>
    );

    const canvasElement = screen.getByRole('presentation');
    expect(canvasElement).toBeInTheDocument();
  });
});
