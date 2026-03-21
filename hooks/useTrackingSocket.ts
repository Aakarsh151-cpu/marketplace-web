"use client";
import { useEffect, useRef } from 'react';
import { useAppStore } from '../store/useAppStore';

export function useTrackingSocket(bookingId: string | null) {
  const ws = useRef<WebSocket | null>(null);
  const setTechLocation = useAppStore((state) => state.setTechLocation);

  useEffect(() => {
    if (!bookingId) return;

    // Connect to FastAPI WebSocket
    const WS_URL = `wss://marketplace-5baf.onrender.com/ws/tracking/${bookingId}`;
    ws.current = new WebSocket(WS_URL);

    ws.current.onopen = () => {
      console.log(`📡 Connected to live tracking for ${bookingId}`);
    };

    ws.current.onmessage = (event) => {
      // Backend payload format expected: "UPDATE: 17.3900,78.4900"
      const data = event.data;
      if (data.startsWith('UPDATE:')) {
        const coords = data.split(':')[1].trim().split(',');
        const newLat = parseFloat(coords[0]);
        const newLng = parseFloat(coords[1]);

        // Instantly updates Zustand, which forces the Google Map marker to move!
        setTechLocation({ lat: newLat, lng: newLng });
      }
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    return () => {
      if (ws.current) {
        ws.current.close();
        console.log("📡 Tracking disconnected.");
      }
    };
  }, [bookingId, setTechLocation]);

  return ws.current;
}