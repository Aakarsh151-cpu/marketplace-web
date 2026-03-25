"use client";

import { useEffect, useRef, useState } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "420px",
  borderRadius: "12px"
};

// Smooth interpolation
const lerp = (start: number, end: number, t: number) => start + (end - start) * t;

export function LiveTracker({ orderId }: { orderId: string }) {
  const [techLocation, setTechLocation] = useState({ lat: 17.4482, lng: 78.3914 });
  const [targetLocation, setTargetLocation] = useState({ lat: 17.4482, lng: 78.3914 });

  const [status, setStatus] = useState("Connecting to satellite...");
  const [connection, setConnection] = useState("CONNECTING");
  const [progress, setProgress] = useState(0);

  const socketRef = useRef<WebSocket | null>(null);
  const animationRef = useRef<number | undefined>(undefined);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!
  });

  // 🔥 Smooth movement animation
  useEffect(() => {
    const animate = () => {
      setTechLocation((prev) => ({
        lat: lerp(prev.lat, targetLocation.lat, 0.1),
        lng: lerp(prev.lng, targetLocation.lng, 0.1)
      }));

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationRef.current!);
  }, [targetLocation]);

  // 🔌 WebSocket connection with auto-reconnect
  useEffect(() => {
    let retryTimeout: any;

    const connect = () => {
      setConnection("CONNECTING");

      const socket = new WebSocket(`ws://localhost:8000/ws/tracking/${orderId}`);
      socketRef.current = socket;

      socket.onopen = () => {
        setConnection("CONNECTED");
        setStatus("🛰️ Connected to live tracking...");
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.lat && data.lng) {
          setTargetLocation({ lat: data.lat, lng: data.lng });
          setProgress(data.progress || 0);
          setStatus("🚗 Technician en route...");
        }

        if (data.technician_status === "ARRIVED") {
          setStatus("✅ Technician has arrived!");
          setProgress(100);
        }
      };

      socket.onclose = () => {
        setConnection("RECONNECTING");
        setStatus("⚠️ Reconnecting...");
        retryTimeout = setTimeout(connect, 3000);
      };

      socket.onerror = () => {
        socket.close();
      };
    };

    connect();

    return () => {
      socketRef.current?.close();
      clearTimeout(retryTimeout);
    };
  }, [orderId]);

  if (!isLoaded) {
    return (
      <div className="p-4 bg-zinc-100 rounded-xl animate-pulse h-[420px]">
        Loading Map Data...
      </div>
    );
  }

  return (
    <div className="w-full bg-white border border-zinc-200 shadow-2xl rounded-xl overflow-hidden">
      
      {/* HEADER */}
      <div className="bg-zinc-900 text-white px-4 py-3 flex justify-between items-center">
        <span className="font-semibold text-sm">📡 Live Tracking Radar</span>
        <span className="text-xs text-emerald-400">{status}</span>
      </div>

      {/* MAP */}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={techLocation}
        zoom={15}
        options={{
          disableDefaultUI: true,
          zoomControl: true
        }}
      >
        {/* Technician Marker */}
        <Marker
          position={techLocation}
          icon={{
            url: "https://cdn-icons-png.flaticon.com/512/732/732230.png",
            scaledSize: new window.google.maps.Size(42, 42)
          }}
        />

        {/* Customer Marker (fixed destination) */}
        <Marker
          position={{ lat: 17.4500, lng: 78.3890 }}
          icon={{
            url: "https://cdn-icons-png.flaticon.com/512/25/25694.png",
            scaledSize: new window.google.maps.Size(35, 35)
          }}
        />
      </GoogleMap>

      {/* FOOTER PANEL */}
      <div className="p-4 space-y-2">
        
        {/* Progress Bar */}
        <div className="w-full bg-zinc-200 rounded-full h-2">
          <div
            className="bg-emerald-500 h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Status Info */}
        <div className="flex justify-between text-xs text-zinc-600">
          <span>Status: {connection}</span>
          <span>{progress}% completed</span>
        </div>
      </div>
    </div>
  );
}