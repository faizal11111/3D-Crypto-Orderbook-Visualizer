"use client";

import React, { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";

interface OrderLevel {
  price: number;
  quantity: number;
  side: "bid" | "ask";
  timestamp: number; // made optional here
}

interface Orderbook3DProps {
  orderbookData: OrderLevel[];
}

// Layout & style constants
const PRICE_BINS = 36;
const TIME_BINS = 32;
const X_WIDTH = 26.5;
const Z_DEPTH = 15;
const BAR_WIDTH = 0.7;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const BAR_DEPTH = 0.62;
const MOUNTAIN_HEIGHT = 12;
const AXIS_FONT = 0.75;
const TICK_FONT = 0.53;
const COLOR_BID = "#10ffa6";
const COLOR_ASK = "#fc5971";
const COLOR_GRID = "#dadee2";
const BACKGROUND_GRADIENT = "bg-gradient-to-bl from-[#0d2136] to-[#182038]";

function binOrderbookGrid(
  data: OrderLevel[],
  priceBins: number,
  timeBins: number
) {
  if (!data.length) {
    return {
      grid: [] as { bidQty: number; askQty: number }[][],
      priceRange: [0, 1] as [number, number],
      times: [] as number[],
    };
  }

  // Unique sorted timestamps (ascending)
  const uniqueTimes = Array.from(new Set(data.map((l) => l.timestamp))).sort(
    (a, b) => a - b
  );
  const times = uniqueTimes.slice(-timeBins);

  // Price range
  const prices = data.map((l) => l.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  // Price bin centers

  // Initialize empty grid
  const grid = times.map(() =>
    Array(priceBins)
      .fill(0)
      .map(() => ({ bidQty: 0, askQty: 0 }))
  );

  // Populate grid with quantities
  data.forEach((level) => {
    const tIdx = times.indexOf(level.timestamp);
    if (tIdx === -1) return;

    let pIdx = Math.floor(
      ((level.price - minPrice) / (maxPrice - minPrice + 1e-12)) * (priceBins - 1)
    );
    pIdx = Math.min(Math.max(pIdx, 0), priceBins - 1);

    if (level.side === "bid") grid[tIdx][pIdx].bidQty += level.quantity;
    else grid[tIdx][pIdx].askQty += level.quantity;
  });

  return { grid, priceRange: [minPrice, maxPrice], times };
}

const RotatingGroup: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const groupRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = 0.15 * Math.sin(clock.getElapsedTime() * 0.5);
    }
  });
  return <group ref={groupRef}>{children}</group>;
};

const Orderbook3D: React.FC<Orderbook3DProps> = ({ orderbookData }) => {
  const { grid, priceRange, times } = useMemo(
    () => binOrderbookGrid(orderbookData, PRICE_BINS, TIME_BINS),
    [orderbookData]
  );

  const maxQty = useMemo(() => {
    let maxVal = 0;
    grid.forEach((row) =>
      row.forEach((cell) => {
        maxVal = Math.max(maxVal, cell.bidQty, cell.askQty);
      })
    );
    return maxVal || 1;
  }, [grid]);

  const [minPrice, maxPrice] = priceRange;
  const priceSpan = maxPrice - minPrice || 1;

  // Mapping functions
  const priceToX = (idx: number) => ((idx / (PRICE_BINS - 1)) - 0.5) * X_WIDTH;
  const snapToZ = (idx: number) => ((idx / (TIME_BINS - 1)) - 0.5) * Z_DEPTH;
  const priceFromX = (x: number) => minPrice + ((x + X_WIDTH / 2) / X_WIDTH) * priceSpan;

  if (!grid.length)
    return (
      <div className="w-full h-full flex items-center justify-center text-slate-400">
        No orderbook data.
      </div>
    );

  const priceTicksIdxs = Array.from({ length: 9 }, (_, i) => Math.floor(i * (PRICE_BINS - 1) / 8));
  const quantityTicksValues = Array.from({ length: 7 }, (_, i) => (maxQty * i) / 6);
  const timeTicksIdxs = times.length ? times.filter((_t, idx) => idx % Math.max(1, Math.floor(TIME_BINS / 6)) === 0) : [];

  return (
    <div className={`absolute inset-0 w-full h-full min-h-[420px] ${BACKGROUND_GRADIENT}`}>
      <Canvas camera={{ position: [0, MOUNTAIN_HEIGHT * 1.03, Z_DEPTH * 1.1], fov: 33 }}>
        <ambientLight intensity={0.85} />
        <directionalLight position={[2, 18, 13]} intensity={1.21} />

        <RotatingGroup>
          {/* Price axis grid and ticks */}
          {priceTicksIdxs.map((idx, i) => {
            const px = priceToX(idx);
            return (
              <group key={`price-tick-${i}`}>
                <mesh position={[px, -0.78, 0]}>
                  <boxGeometry args={[0.04, 0.75, BAR_WIDTH * 5]} />
                  <meshStandardMaterial color={COLOR_GRID} />
                </mesh>
                <Text position={[px, -1.8, 0]} fontSize={TICK_FONT} color="#f4f7fa" anchorX="center" anchorY="top">
                  {priceFromX(px).toFixed(2)}
                </Text>
              </group>
            );
          })}

          {/* Quantity axis grid and ticks */}
          {quantityTicksValues.map((val, i) => (
            <group key={`qty-tick-${i}`}>
              <mesh position={[-X_WIDTH / 2 - 1.1, (val / maxQty) * MOUNTAIN_HEIGHT, 0]}>
                <boxGeometry args={[0.75, 0.02, BAR_WIDTH * 7]} />
                <meshStandardMaterial color={COLOR_GRID} />
              </mesh>
              <Text position={[-X_WIDTH / 2 - 1.55, (val / maxQty) * MOUNTAIN_HEIGHT, 0]} fontSize={TICK_FONT} color="#ebfbfc" anchorX="right" anchorY="middle">
                {Math.round(val)}
              </Text>
            </group>
          ))}

          {/* Time axis grid and ticks */}
          {timeTicksIdxs.map((timestamp, i) => (
            <group key={`time-tick-${i}`}>
              <mesh position={[0, -1, snapToZ(i)]}>
                <boxGeometry args={[X_WIDTH + 2, 0.04, BAR_WIDTH * 4]} />
                <meshStandardMaterial color={COLOR_GRID} />
              </mesh>
              <Text position={[-X_WIDTH / 2 - 1.2, -2.15, snapToZ(i)]} fontSize={TICK_FONT * 0.9} color="#d8e2ff" anchorX="right" anchorY="middle" rotation={[0, 0, Math.PI / 2]}>
                {new Date(timestamp).toLocaleTimeString()}
              </Text>
            </group>
          ))}

          {/* Orderbook bars */}
          {grid.map((row, tIdx) =>
            row.map((cell, pIdx) => (
              <React.Fragment key={`bar-${tIdx}-${pIdx}`}>
                {cell.bidQty > 0 && (
                  <mesh
                    position={[priceToX(pIdx), (cell.bidQty / maxQty) * MOUNTAIN_HEIGHT / 2, snapToZ(tIdx)]}
                    scale={[BAR_WIDTH, Math.max((cell.bidQty / maxQty) * MOUNTAIN_HEIGHT, 0.1), BAR_WIDTH]}
                  >
                    <boxGeometry args={[1, 1, 1]} />
                    <meshStandardMaterial color={COLOR_BID} opacity={0.93} transparent />
                  </mesh>
                )}
                {cell.askQty > 0 && (
                  <mesh
                    position={[priceToX(pIdx), (cell.askQty / maxQty) * MOUNTAIN_HEIGHT / 2, snapToZ(tIdx)]}
                    scale={[BAR_WIDTH, Math.max((cell.askQty / maxQty) * MOUNTAIN_HEIGHT, 0.1), BAR_WIDTH]}
                  >
                    <boxGeometry args={[1, 1, 1]} />
                    <meshStandardMaterial color={COLOR_ASK} opacity={0.81} transparent />
                  </mesh>
                )}
              </React.Fragment>
            ))
          )}

          {/* Axis labels */}
          <Text position={[0, -2.5, 0]} fontSize={AXIS_FONT} color="#fafcfb" anchorX="center">Price (X)</Text>
          <Text
            position={[-X_WIDTH / 2, MOUNTAIN_HEIGHT / 2, 0]}
            fontSize={AXIS_FONT}
            color="#061f12ff"
            anchorX="center"
            anchorY="middle"
            rotation={[0, 0, Math.PI / 2]}
          >
            Quantity (Y)
          </Text>
          <Text
            position={[0, -2.5, Z_DEPTH / 2]}
            fontSize={AXIS_FONT}
            color=""
            anchorX="center"
            rotation={[Math.PI / 2, 0, 0]}
          >
            Time (Z)
          </Text>
        </RotatingGroup>

        <OrbitControls enableRotate enableZoom enablePan zoomSpeed={0.9} panSpeed={0.8} rotateSpeed={0.4} makeDefault />
      </Canvas>
    </div>
  );
};

export default Orderbook3D;
