# 3D Crypto Orderbook Visualizer

Real-time, interactive 3D visualization of crypto orderbooks across multiple venues.

---

## Features

- **3D Orderbook:** Price (X), quantity (Y), time (Z) axes.
- **Real-time Data:** Binance supported (others structured, see `useOrderbookData.ts`).
- **Interactive:** Rotate, zoom, pan with mouse/touch.
- **Venue Filtering:** Show/hide Binance, OKX, Bybit, Deribit.
- **Pressure Zones:** Highlight clusters with high order volume.
- **Filters:** Price range, quantity threshold, timeframe selection.
- **Responsive:** Fast and mobile-friendly.

---

## How to Run Locally

1. **Clone the repo:**
git clone https://github.com/your-username/3d-orderbook.git
cd 3d-orderbook

2. **Install dependencies:**
npm install


3. **Start the dev server:**
npm run dev


4. **Open in browser:**
Go to http://localhost:3000

---

## Technical Notes

- **APIs used:** Binance orderbook REST + WebSocket API.
- **Libraries:** React, Next.js, @react-three/fiber (Three.js), @react-three/drei, TypeScript.
- **Assumptions:**
- Only Binance is fully implemented for real-time data.
- Each price/time bin is a bar; pressure detection uses a simple volume threshold.
- Responsive layout covers desktop/mobile.
- **Planned/Future:**
- Full venue support (OKX, Bybit, Deribit).
- Advanced analytics (order flow, matching animation).
- Export/share chart images.

---

## Why These Choices?

- **Three.js/React Three Fiber:** Smooth, performant 3D rendering in React.
- **Next.js:** Easy routing, SSR/SSG, deployment simplicity.
- **Hooks/Context:** Clean state management for venues, filters, and real-time updates.
