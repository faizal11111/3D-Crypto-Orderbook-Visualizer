import { useMemo } from 'react';
import { OrderLevelWithVenue } from '../components/PressureZoneOverlay';

interface PressureZone {
  price: number;
  intensity: number;
}

interface UsePressureZonesResult {
  pressureZones: PressureZone[];
}

export const usePressureZones = (bids: OrderLevelWithVenue[], asks: OrderLevelWithVenue[]): UsePressureZonesResult => {
  // Simple pressure zone detection based on volume spikes and clustering
  // For demo, we cluster price levels with quantity above a threshold

  const pressureZones = useMemo(() => {
    const threshold = 10; // example threshold for high quantity
    const zonesMap = new Map<number, number>();

    const processLevels = (levels: OrderLevelWithVenue[]) => {
      levels.forEach(level => {
        if (level.quantity >= threshold) {
          zonesMap.set(level.price, (zonesMap.get(level.price) || 0) + level.quantity);
        }
      });
    };

    processLevels(bids);
    processLevels(asks);

    // Convert map to array sorted by intensity descending
    const zonesArray: PressureZone[] = Array.from(zonesMap.entries())
      .map(([price, intensity]) => ({ price, intensity }))
      .sort((a, b) => b.intensity - a.intensity);

    return zonesArray;
  }, [bids, asks]);

  return { pressureZones };
};
