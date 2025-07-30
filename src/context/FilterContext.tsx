"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
interface FilterContextType {
  priceRange: [number, number];
  quantityThreshold: number;
  timeRange: number;
  visualizationMode: "real-time" | "historical" | "pressure-zones";
  setPriceRange: (range: [number, number]) => void;
  setQuantityThreshold: (threshold: number) => void;
  setTimeRange: (range: number) => void;
  setVisualizationMode: (mode: "real-time" | "historical" | "pressure-zones") => void;
}
const FilterContext = createContext<FilterContextType | undefined>(undefined);
export const FilterProvider = ({ children }: { children: ReactNode }) => {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [quantityThreshold, setQuantityThreshold] = useState(0);
  const [timeRange, setTimeRange] = useState(1);
  const [visualizationMode, setVisualizationMode] = useState<
    "real-time" | "historical" | "pressure-zones"
  >("real-time");
  return (
    <FilterContext.Provider
      value={{ priceRange, quantityThreshold, timeRange, visualizationMode, setPriceRange, setQuantityThreshold, setTimeRange, setVisualizationMode }}
    >
      {children}
    </FilterContext.Provider>
  );
};
export const useFilter = () => {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error("useFilter must be used within FilterProvider");
  return ctx;
};
