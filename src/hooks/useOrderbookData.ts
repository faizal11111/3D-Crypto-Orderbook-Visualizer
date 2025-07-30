"use client";
import { useState, useEffect, useRef } from "react";
import type { Venue } from "../context/VenueContext";

// Ensure this includes timestamp
export interface OrderLevel {
  price: number;
  quantity: number;
  side: "bid" | "ask";
  venue: Venue;
  timestamp: number; // <-- Timestamp for time axis
}

const ENDPOINTS: Record<Venue, { ws: (symbol: string) => string; rest: (symbol: string) => string }> = {
  Binance: {
    ws: (symbol: string) => `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@depth`,
    rest: (symbol: string) => `https://api.binance.com/api/v3/depth?symbol=${symbol.toUpperCase()}&limit=1000`,
  },
  OKX: { ws: () => "", rest: () => "" },
  Bybit: { ws: () => "", rest: () => "" },
  Deribit: { ws: () => "", rest: () => "" },
};

export const useOrderbookData = (symbol: string, venues: Venue[]): OrderLevel[] => {
  const [orderbook, setOrderbook] = useState<OrderLevel[]>([]);
  const booksRef = useRef<Partial<Record<Venue, { bids: Map<number, number>; asks: Map<number, number> }>>>({});

  useEffect(() => {
    const wsList: WebSocket[] = [];
    booksRef.current = {};

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const parseBook = (data: { bids: [string, string][]; asks: [string, string][] }, venue: Venue): { bids: Map<number, number>; asks: Map<number, number> } => {
      const bids = new Map<number, number>();
      const asks = new Map<number, number>();
      data.bids.forEach(([p, q]) => {
        const price = parseFloat(p), quantity = parseFloat(q);
        if (quantity > 0) bids.set(price, quantity);
      });
      data.asks.forEach(([p, q]) => {
        const price = parseFloat(p), quantity = parseFloat(q);
        if (quantity > 0) asks.set(price, quantity);
      });
      return { bids, asks };
    };

    function updateOrderbookState() {
      const all: OrderLevel[] = [];
      const now = Date.now(); // Use current client timestamp, or pass exchange-provided timestamp if available
      (Object.keys(booksRef.current) as Venue[]).forEach((venue) => {
        const book = booksRef.current[venue];
        if (!book) return;
        book.bids.forEach((quantity: number, price: number) =>
          all.push({ price, quantity, side: "bid", venue, timestamp: now })
        );
        book.asks.forEach((quantity: number, price: number) =>
          all.push({ price, quantity, side: "ask", venue, timestamp: now })
        );
      });
      setOrderbook(all);
    }

    const fetchVenueBook = async (venue: Venue) => {
      if (!ENDPOINTS[venue].ws(symbol) || !ENDPOINTS[venue].rest(symbol)) return;
      try {
        const res = await fetch(ENDPOINTS[venue].rest(symbol));
        const data = await res.json();
        booksRef.current[venue] = parseBook(data, venue);
        updateOrderbookState();
      } catch (err) {
        console.error(`Failed to fetch ${venue} snapshot:`, err);
      }
      const wsUrl = ENDPOINTS[venue].ws(symbol);
      if (!wsUrl) return;
      const ws = new WebSocket(wsUrl);
      ws.onmessage = (evt) => {
        const data = JSON.parse(evt.data);
        const book = booksRef.current[venue];
        if (!book) return;
        data.b?.forEach?.(([p, q]: [string, string]) => {
          const price = parseFloat(p), quantity = parseFloat(q);
          if (quantity === 0) book.bids.delete(price);
          else book.bids.set(price, quantity);
        });
        data.a?.forEach?.(([p, q]: [string, string]) => {
          const price = parseFloat(p), quantity = parseFloat(q);
          if (quantity === 0) book.asks.delete(price);
          else book.asks.set(price, quantity);
        });
        updateOrderbookState();
      };
      ws.onerror = () => ws.close();
      ws.onclose = () => {};
      wsList.push(ws);
    };

    venues.forEach(fetchVenueBook);

    return () => { wsList.forEach((ws) => ws.close()); };
  }, [symbol, venues]);

  return orderbook;
};

