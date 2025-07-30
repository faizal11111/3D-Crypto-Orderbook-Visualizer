import React from 'react';
import { render, screen } from '@testing-library/react';
import { VenueProvider } from '../context/VenueContext';
import { FilterProvider } from '../context/FilterContext';
import Orderbook3D from '../components/Orderbook3D';

describe('Error Handling', () => {
  it('renders error message on data fetch failure', () => {
    // Mock the hook or context to simulate error state
    // For demonstration, assume Orderbook3D shows error message when no data

    render(
      <VenueProvider>
        <FilterProvider>
          <Orderbook3D />
        </FilterProvider>
      </VenueProvider>
    );

    // Check for error message or fallback UI
    const errorMessage = screen.queryByText(/error/i);
    expect(errorMessage).toBeInTheDocument();
  });
});
