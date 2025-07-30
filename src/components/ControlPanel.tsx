'use client';
import React from 'react';
import { useVenue, Venue } from '../context/VenueContext';
import { useFilter } from '../context/FilterContext';

interface ControlPanelProps {
  symbol: string;
  setSymbol: React.Dispatch<React.SetStateAction<string>>;
}

const venues: Venue[] = ['Binance', 'OKX', 'Bybit', 'Deribit'];
const venueColors: Record<Venue, string> = {
  Binance: '#F3BA2F', OKX: '#00A0E9', Bybit: '#FF6A00', Deribit: '#4CAF50'
};
const tradingPairs = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'XRPUSDT'];
const timeframes = ['1m', '5m', '15m', '1h'];

const ControlPanel: React.FC<ControlPanelProps> = ({ symbol, setSymbol }) => {
  const { selectedVenues, toggleVenue } = useVenue();
  const {
    priceRange, setPriceRange,
    quantityThreshold, setQuantityThreshold,
    visualizationMode, setVisualizationMode,
  } = useFilter();
  const [selectedTimeframe, setSelectedTimeframe] = React.useState<string>('1m');

  return (
    <form className="flex flex-col gap-6">
      <h2 className="text-xl font-bold tracking-tight mb-3">Orderbook Options</h2>
      {/* Trading Pair Selector */}
      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1">Trading Pair</label>
        <select
          value={symbol}
          onChange={e => setSymbol(e.target.value)}
          className="w-full rounded-md p-2 bg-slate-800 text-slate-100 focus:outline focus:ring-2 focus:ring-emerald-400"
        >
          {tradingPairs.map(pair => <option key={pair} value={pair}>{pair}</option>)}
        </select>
      </div>
      {/* Time Range */}
      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1">Time Interval</label>
        <select
          value={selectedTimeframe}
          onChange={e => setSelectedTimeframe(e.target.value)}
          className="w-full rounded-md p-2 bg-slate-800 text-slate-100 focus:outline focus:ring-2 focus:ring-emerald-400"
        >
          {timeframes.map(tf => <option key={tf} value={tf}>{tf}</option>)}
        </select>
      </div>
      {/* Venue Selection */}
      <div>
        <span className="block text-xs font-medium text-slate-400 mb-1">Exchanges</span>
        <div className="flex gap-2 flex-wrap">
          {venues.map(venue => {
            const isActive = selectedVenues.includes(venue);
            return (
              <button
                key={venue}
                type="button"
                className={`rounded-full px-4 py-2 border text-sm font-bold transition
                  focus:ring-2 focus:ring-emerald-400
                  ${isActive
                    ? 'bg-white text-black shadow'
                    : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                  }
                `}
                style={isActive ? { background: venueColors[venue] } : {}}
                onClick={() => toggleVenue(venue)}
                aria-pressed={isActive}
              >
                {venue}
              </button>
            );
          })}
        </div>
      </div>
      {/* Filters */}
      <div>
        <label className="text-xs font-medium text-slate-400">Price Range</label>
        <input
          type="range"
          min={0}
          max={100000}
          step={100}
          value={priceRange[1]}
          onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
          className="w-full accent-emerald-500"
        />
        <input
          type="number"
          min={0}
          max={100000}
          value={priceRange[1]}
          onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
          className="w-full rounded-md bg-slate-800 px-2 py-1 mt-1 text-slate-100"
        />
        <label className="block text-xs font-medium text-slate-400 mt-2 mb-1">Min Quantity</label>
        <input
          type="number"
          min={0}
          value={quantityThreshold}
          onChange={e => setQuantityThreshold(Number(e.target.value))}
          className="w-full rounded-md bg-slate-800 px-2 py-1 mt-1 text-slate-100"
        />
      </div>
      {/* Visualization Mode */}
      <div>
        <span className="block text-xs font-medium text-slate-400 mb-1">Visualization</span>
        <div className="flex gap-2 flex-wrap">
          {['real-time', 'historical', 'pressure-zones'].map(mode => (
            <button
              type="button"
              key={mode}
              onClick={() => setVisualizationMode(mode as typeof visualizationMode)}
              className={`rounded px-3 py-1 capitalize text-sm font-semibold transition
                focus:ring-2 focus:ring-emerald-400
                ${visualizationMode === mode
                  ? 'bg-emerald-500 text-black shadow'
                  : 'bg-slate-800 text-slate-100 border border-slate-700 hover:bg-slate-700'}
              `}
              aria-pressed={visualizationMode === mode}
            >
              {mode.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>
    </form>
  );
};
export default ControlPanel;
