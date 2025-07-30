"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
export type Venue = "Binance" | "OKX" | "Bybit" | "Deribit";
interface VenueContextType {
  selectedVenues: Venue[];
  setSelectedVenues: React.Dispatch<React.SetStateAction<Venue[]>>;
  toggleVenue: (venue: Venue) => void;
}
export const VenueContext = createContext<VenueContextType | null>(null);
export const VenueProvider = ({ children }: { children: ReactNode }) => {
  const [selectedVenues, setSelectedVenues] = useState<Venue[]>(["Binance"]);
  const toggleVenue = (venue: Venue) => {
    setSelectedVenues(prev =>
      prev.includes(venue) ? prev.filter(v => v !== venue) : [...prev, venue]
    );
  };
  return (
    <VenueContext.Provider value={{ selectedVenues, setSelectedVenues, toggleVenue }}>
      {children}
    </VenueContext.Provider>
  );
};
export const useVenue = () => {
  const context = useContext(VenueContext);
  if (!context) throw new Error("useVenue must be used within VenueProvider");
  return context;
};
