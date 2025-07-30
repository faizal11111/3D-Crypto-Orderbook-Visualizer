import React from "react";
import { usePressureZones } from "../hooks/usePressureZones";
import * as THREE from "three";
export interface OrderLevelWithVenue {
  price: number;
  quantity: number;
  venue: string;
}
interface PressureZoneOverlayProps {
  bids: OrderLevelWithVenue[];
  asks: OrderLevelWithVenue[];
}
export default function PressureZoneOverlay({ bids, asks }: PressureZoneOverlayProps) {
  const { pressureZones } = usePressureZones(bids, asks);
  if (!pressureZones.length) return null;
  return (
    <>
      {pressureZones.map((zone, idx) => {
        const color = new THREE.Color(`hsl(${Math.max(0, 120 - (zone.intensity / 250) * 120)}, 80%, 45%)`);
        return (
          <mesh
            key={idx}
            position={[zone.price, zone.intensity / 1.8, 0.75]}
            scale={[5.8, Math.max(zone.intensity, 1), 1.7]}
          >
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={color} opacity={0.55} transparent />
          </mesh>
        );
      })}
    </>
  );
}
