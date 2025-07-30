import React from 'react';
import { render, screen } from '@testing-library/react';
import Orderbook3D from '../components/Orderbook3D';

const mockOrderbookData = [
  { price: 100, quantity: 10, side: 'bid' },
  { price: 101, quantity: 15, side: 'ask' },
];

describe('Orderbook3D Component', () => {
  test('renders without crashing with valid data', () => {
    render(<Orderbook3D orderbookData={mockOrderbookData} />);
    // Since it's a 3D canvas, we can check for canvas element presence
    const canvasElement = screen.getByRole('presentation');
    expect(canvasElement).toBeInTheDocument();
  });

  test('displays error message when no data is provided', () => {
    render(<Orderbook3D orderbookData={[]} />);
    expect(screen.getByRole('alert')).toHaveTextContent('Error: No orderbook data available.');
  });
});
