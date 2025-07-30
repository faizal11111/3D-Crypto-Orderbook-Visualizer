import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { VenueProvider, useVenue, Venue } from '../context/VenueContext';

const TestComponent = () => {
  const { selectedVenues, setSelectedVenues } = useVenue();

  return (
    <div>
      {['Binance', 'OKX', 'Bybit', 'Deribit'].map((venue) => (
        <label key={venue}>
          <input
            type="checkbox"
            checked={selectedVenues.includes(venue as Venue)}
            onChange={() => {
              if (selectedVenues.includes(venue as Venue)) {
                setSelectedVenues(selectedVenues.filter((v) => v !== venue));
              } else {
                setSelectedVenues([...selectedVenues, venue as Venue]);
              }
            }}
          />
          {venue}
        </label>
      ))}
      <div data-testid="selected-count">{selectedVenues.length}</div>
    </div>
  );
};

describe('Venue Filtering', () => {
  it('toggles venues correctly', () => {
    render(
      <VenueProvider>
        <TestComponent />
      </VenueProvider>
    );

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes.length).toBe(4);

    // Initially all selected
    expect(screen.getByTestId('selected-count').textContent).toBe('4');

    // Uncheck first venue
    fireEvent.click(checkboxes[0]);
    expect(screen.getByTestId('selected-count').textContent).toBe('3');

    // Check first venue again
    fireEvent.click(checkboxes[0]);
    expect(screen.getByTestId('selected-count').textContent).toBe('4');
  });
});
