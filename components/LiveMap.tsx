"use client";
import React, { useMemo } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Circle } from '@react-google-maps/api';
import { Loader2 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

// Premium Dark Mode Map Styling
const mapTheme = [
  { elementType: "geometry", stylers: [{ color: "#1f2937" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#1f2937" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#9ca3af" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#374151" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#111827" }] },
];

export default function LiveMap() {
  // Pull live tech location from Zustand
  const techLocation = useAppStore((state) => state.techLocation);

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    // Replace with your actual Google Cloud API Key
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "", 
  });

  // Centered on Hyderabad
  const center = useMemo(() => ({ lat: 17.3850, lng: 78.4867 }), []);

  if (loadError) return <div className="p-4 text-red-500 font-bold bg-slate-900 h-full flex items-center justify-center">Map API Key Required.</div>;
  if (!isLoaded) return (
    <div className="flex h-full w-full items-center justify-center bg-slate-900">
      <div className="text-center">
        <Loader2 className="w-10 h-10 text-cyan-500 animate-spin mx-auto mb-4" />
        <p className="text-cyan-500 font-bold tracking-widest uppercase text-sm">Initializing Satellites</p>
      </div>
    </div>
  );

  return (
    <div className="h-full w-full absolute inset-0">
      <GoogleMap
        mapContainerClassName="w-full h-full"
        center={center}
        zoom={13}
        options={{
          styles: mapTheme,
          disableDefaultUI: true,
          zoomControl: true,
        }}
      >
        {/* Customer Location */}
        <Marker position={center} />
        
        {/* Radar / Service Area Indicator */}
        <Circle
          center={center}
          radius={4000} // 4km operational radius
          options={{
            fillColor: "#00F0FF",
            fillOpacity: 0.05,
            strokeColor: "#00F0FF",
            strokeOpacity: 0.3,
            strokeWeight: 1,
          }}
        />

        {/* Live Partner Location (Updates via WebSockets) */}
        {techLocation && (
          <Marker 
            position={techLocation} 
            icon={{
              url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png" 
            }} 
          />
        )}
      </GoogleMap>
    </div>
  );
}