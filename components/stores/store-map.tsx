"use client";

import { useEffect, useRef, useState } from "react";
import { STORES, sortStoresByDistance, type Store } from "@/lib/stores";

function useDistanceSort() {
  const [sorted, setSorted] = useState<Store[]>(STORES);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setSorted(
          sortStoresByDistance(STORES, pos.coords.latitude, pos.coords.longitude),
        );
      },
      () => setSorted(STORES),
      { enableHighAccuracy: false, timeout: 5000 },
    );
  }, []);

  return sorted;
}

function StoreCard({
  store,
  isNearest,
}: {
  store: Store;
  isNearest?: boolean;
}) {
  return (
    <div className="p-4 rounded-xl border border-border bg-card hover:bg-card-hover transition-colors duration-200 relative">
      {isNearest && (
        <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-brand-600/20 text-brand-500 text-[10px] font-mono uppercase tracking-wider border border-brand-600/30">
          Più vicino
        </span>
      )}
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-card-hover border border-border text-muted-foreground">
          {store.brand}
        </span>
      </div>
      <h3 className="font-serif text-lg italic text-foreground">{store.name}</h3>
      <p className="text-sm text-muted-foreground">{store.address}</p>
      <p className="text-sm text-muted-foreground">
        {store.cap} {store.city} ({store.province})
      </p>
      <p className="text-sm text-muted-foreground font-mono mt-2">{store.phone}</p>
      {store.mobile && (
        <p className="text-sm text-muted-foreground font-mono">
          {store.mobile} <span className="text-[10px]">(cell. / WhatsApp)</span>
        </p>
      )}
      <p className="text-sm text-muted-foreground font-mono">
        <a href={`mailto:${store.email}`} className="hover:text-brand-500">{store.email}</a>
      </p>
      <p className="text-xs text-muted-foreground/80 mt-2">{store.hours}</p>
      <div className="mt-3 pt-3 border-t border-border/60">
        <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/70">
          {store.legalName}
        </p>
        {store.vatNumber && (
          <p className="text-[10px] font-mono text-muted-foreground/70">
            P.IVA {store.vatNumber}
          </p>
        )}
        {store.pec && (
          <p className="text-[10px] font-mono text-muted-foreground/70">
            PEC {store.pec}
          </p>
        )}
      </div>
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

      // Centro mappa su San Benedetto del Tronto (le 2 sedi sono entrambe lì)
      const map = L.map(mapRef.current, {
        zoomControl: true,
        attributionControl: false,
      }).setView([42.9434, 13.8800], 14);

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
              ${escapeHtml(store.cap)} ${escapeHtml(store.city)} (${escapeHtml(store.province)})<br/>
              <a href="tel:${escapeHtml(store.phone.replace(/\s/g, ""))}" style="color:#dc2626;">${escapeHtml(store.phone)}</a><br/>
              <a href="mailto:${escapeHtml(store.email)}" style="color:#dc2626;">${escapeHtml(store.email)}</a>
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
