import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ControlPanel from '../components/ControlPanel';
import { VenueProvider } from '../context/VenueContext';
import { FilterProvider } from '../context/FilterContext';

describe('ControlPanel Component', () => {
  it('renders venue filters and toggles', () => {
    render(
      <VenueProvider>
        <FilterProvider>
          <ControlPanel />
        </FilterProvider>
      </VenueProvider>
    );

    // Check for venue filter checkboxes
    expect(screen.getByLabelText(/Binance/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/OKX/i)).toBeInTheDocument();

    // Check for toggle switches
    expect(screen.getByLabelText(/Real-time/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Pressure Zones/i)).toBeInTheDocument();
  });

  it('allows toggling venue filters', () => {
    render(
      <VenueProvider>
        <FilterProvider>
          <ControlPanel />
        </FilterProvider>
      </VenueProvider>
    );

    const binanceCheckbox = screen.getByLabelText(/Binance/i);
    expect(binanceCheckbox).toBeChecked();

    fireEvent.click(binanceCheckbox);
    expect(binanceCheckbox).not.toBeChecked();
  });
});
