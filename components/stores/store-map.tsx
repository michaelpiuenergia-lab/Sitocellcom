"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils/cn";

interface StoreLocation {
  name: string;
  address: string;
  city: string;
  lat: number;
  lng: number;
  phone: string;
}

const stores: StoreLocation[] = [
  { name: "Cellcom Parma", address: "Via Roma 1", city: "Parma", lat: 44.8015, lng: 10.328, phone: "+39 000 000 0001" },
  { name: "Fast-Fix Milano", address: "Corso Buenos Aires 42", city: "Milano", lat: 45.4773, lng: 9.1955, phone: "+39 000 000 0002" },
  { name: "ItalianParts Roma", address: "Via Nazionale 89", city: "Roma", lat: 41.9028, lng: 12.4964, phone: "+39 000 000 0003" },
  { name: "SmartphoneFix Bologna", address: "Via dell'Indipendenza 25", city: "Bologna", lat: 44.4949, lng: 11.3426, phone: "+39 000 000 0004" },
  { name: "Cellcom Torino", address: "Via Roma 100", city: "Torino", lat: 45.0703, lng: 7.6869, phone: "+39 000 000 0005" },
];

function useDistanceSort() {
  const [sorted, setSorted] = useState<StoreLocation[]>(stores);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userLat = pos.coords.latitude;
        const userLng = pos.coords.longitude;
        const withDist = stores.map((s) => ({
          ...s,
          dist: Math.sqrt((s.lat - userLat) ** 2 + (s.lng - userLng) ** 2),
        }));
        withDist.sort((a, b) => (a.dist ?? 0) - (b.dist ?? 0));
        setSorted(withDist);
      },
      () => setSorted(stores),
      { enableHighAccuracy: false, timeout: 5000 }
    );
  }, []);

  return sorted;
}

function StoreCard({ store, isNearest }: { store: StoreLocation; isNearest?: boolean }) {
  return (
    <div className="p-4 rounded-xl border border-border bg-card hover:bg-card-hover transition-colors duration-200 relative">
      {isNearest && (
        <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-brand-600/20 text-brand-500 text-[10px] font-mono uppercase tracking-wider border border-brand-600/30">
          Più vicino
        </span>
      )}
      <h3 className="font-serif text-lg italic text-foreground">{store.name}</h3>
      <p className="text-sm text-muted-foreground">{store.address}</p>
      <p className="text-sm text-muted-foreground">{store.city}</p>
      <p className="text-sm text-muted-foreground font-mono mt-1">{store.phone}</p>
    </div>
  );
}

export function StoreMap() {
  const sortedStores = useDistanceSort();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function initMap() {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");

      if (cancelled || !mapRef.current) return;

      // Create custom icon
      const customIcon = L.divIcon({
        className: "custom-marker",
        html: `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="14" cy="14" r="12" fill="#dc2626" stroke="#050505" stroke-width="2"/><text x="14" y="19" text-anchor="middle" fill="white" font-size="14" font-family="Geist, sans-serif" font-weight="600">C</text></svg>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const map = L.map(mapRef.current, {
        zoomControl: false,
        attributionControl: false,
      }).setView([42.5, 12.5], 6);

      L.tileLayer(
        "https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png",
        {
          attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
          subdomains: "abcd",
        }
      ).addTo(map);

      function escapeHtml(str: string): string {
        return str
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#039;");
      }

      sortedStores.forEach((store) => {
        L.marker([store.lat, store.lng], { icon: customIcon })
          .addTo(map)
          .bindPopup(
            `<div style="font-family: Geist, sans-serif; color: #050505;">
              <strong>${escapeHtml(store.name)}</strong><br/>
              ${escapeHtml(store.address)}<br/>
              ${escapeHtml(store.city)}
            </div>`
          );
      });

      mapInstance.current = map;
      setReady(true);
    }

    initMap();

    return () => {
      cancelled = true;
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Map */}
      <div className="flex-1 min-h-[500px] rounded-2xl border border-border overflow-hidden relative">
        <div ref={mapRef} className="absolute inset-0" />
        {!ready && (
          <div className="absolute inset-0 bg-card flex items-center justify-center z-10">
            <span className="text-muted-foreground text-sm">Caricamento mappa...</span>
          </div>
        )}
      </div>

      {/* Store list */}
      <div className="w-full lg:w-80 flex flex-col gap-3">
        <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
          I nostri punti vendita
        </h3>
        {sortedStores.map((store, i) => (
          <StoreCard key={store.name} store={store} isNearest={i === 0} />
        ))}
      </div>
    </div>
  );
}
