"use client";

import React, { useState } from "react";
import { VenueProvider } from "../context/VenueContext";
import { FilterProvider } from "../context/FilterContext";
import { useVenue } from "../context/VenueContext";
import ControlPanel from "../components/ControlPanel";
import Orderbook3D from "../components/Orderbook3D";
import PressureZoneOverlay from "../components/PressureZoneOverlay";
import { useOrderbookData } from "../hooks/useOrderbookData";

function MainDashboard() {
  const [symbol, setSymbol] = useState("BTCUSDT");

  // Now that MainDashboard is inside VenueProvider, we can safely use useVenue hook
  const { selectedVenues } = useVenue();

  // Fetch orderbook data based on current symbol and selected venues
  const orderbook = useOrderbookData(symbol, selectedVenues);

  const bidsWithVenue = orderbook.filter((l) => l.side === "bid");
  const asksWithVenue = orderbook.filter((l) => l.side === "ask");

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gradient-to-br from-slate-950 to-slate-900">
      {/* Sidebar controls */}
      <aside className="w-full md:w-80 bg-slate-900 md:border-r border-b md:border-b-0 border-slate-800 p-4 flex-shrink-0 shadow-lg">
        <ControlPanel symbol={symbol} setSymbol={setSymbol} />
      </aside>
      {/* Main view */}
      <main className="flex-1 flex flex-col items-stretch relative min-h-[400px]">
        <div className="flex-1 relative">
          <Orderbook3D orderbookData={orderbook} />
          <PressureZoneOverlay bids={bidsWithVenue} asks={asksWithVenue} />
        </div>
      </main>
    </div>
  );
}

export default function Home() {
  // Wrap entire app with providers so contexts are available downstream
  return (
    <VenueProvider>
      <FilterProvider>
        <MainDashboard />
      </FilterProvider>
    </VenueProvider>
  );
}

