"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Maximize2, Minus, Minimize2, Plus } from "lucide-react";
import type { Map as MlMap } from "maplibre-gl";
import { lodgePhoto } from "@/lib/photos";

import "maplibre-gl/dist/maplibre-gl.css";

const places = [
  { slug: "deodar-house", label: "Old Manali", lng: 77.189, lat: 32.257, anchor: "bottom" as const, nudge: [0, -6] as [number, number] },
  { slug: "ridge-kettle", label: "Shimla", lng: 77.173, lat: 31.104, anchor: "bottom" as const, nudge: [0, -4] as [number, number] },
  { slug: "bellview", label: "McLeod Ganj", lng: 76.321, lat: 32.242, anchor: "left" as const, nudge: [10, -16] as [number, number] },
  { slug: "parvati-glass", label: "Kasol", lng: 77.315, lat: 32.01, anchor: "left" as const, nudge: [12, 18] as [number, number] },
  { slug: "mud-sky", label: "Kaza", lng: 78.072, lat: 32.227, anchor: "right" as const, nudge: [-20, -6] as [number, number] },
  { slug: "pine-perch", label: "Bir", lng: 76.724, lat: 32.046, anchor: "bottom" as const, nudge: [-8, 22] as [number, number] },
];

function mapPadding(compact: boolean) {
  return compact
    ? { top: 64, bottom: 100, left: 52, right: 78 }
    : { top: 96, bottom: 120, left: 88, right: 96 };
}

export function ValleyMap() {
  const frame = useRef<HTMLDivElement>(null);
  const surface = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MlMap | null>(null);
  const libRef = useRef<typeof import("maplibre-gl") | null>(null);
  const [ready, setReady] = useState(false);
  const [full, setFull] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const node = surface.current;
    if (!node) return;
    let map: MlMap | null = null;
    let observer: ResizeObserver | null = null;
    let cancelled = false;

    void (async () => {
      const maplibregl = await import("maplibre-gl");
      maplibregl.setWorkerUrl("/maplibre-gl-worker.mjs");
      libRef.current = maplibregl;
      if (cancelled) return;
      const created = new maplibregl.Map({
        container: node,
        style: "https://tiles.openfreemap.org/styles/positron",
        center: [77.2, 32.05],
        zoom: 6.4,
        attributionControl: false,
        dragRotate: false,
        pitchWithRotate: false,
      });
      map = created;
      const markers: { remove: () => void }[] = [];
      let compact = node.clientWidth < 720;
      const fit = (duration: number) => {
        created.resize();
        const bounds = new maplibregl.LngLatBounds();
        for (const place of places) bounds.extend([place.lng, place.lat]);
        created.fitBounds(bounds, { padding: mapPadding(compact), duration });
      };
      const paintMarkers = () => {
        for (const marker of markers) marker.remove();
        markers.length = 0;
        for (const place of places) {
          const photo = lodgePhoto[place.slug];
          const link = document.createElement("a");
          link.href = `/stays/${place.slug}`;
          link.setAttribute("aria-label", `${place.label}, 2 rooms`);
          link.style.color = "#000";
          const img = document.createElement("img");
          img.src = photo?.src ?? "";
          img.alt = "";
          const name = document.createElement("span");
          name.textContent = place.label;
          if (compact) {
            link.className =
              "flex w-[72px] flex-col items-center gap-1 rounded-2xl bg-white px-1.5 py-1.5 text-center no-underline shadow-[0_6px_18px_rgba(0,0,0,0.14)]";
            img.width = 32;
            img.height = 32;
            img.className = "size-8 rounded-full object-cover";
            name.className = "block text-[11px] leading-[1.15] tracking-[-0.2px]";
            link.append(img, name);
          } else {
            link.className =
              "flex items-center gap-2 rounded-full bg-white py-1 pr-3 pl-1 no-underline shadow-[0_6px_18px_rgba(0,0,0,0.14)]";
            img.width = 36;
            img.height = 36;
            img.className = "size-9 rounded-full object-cover";
            name.className = "block text-[13px] leading-[1.15] tracking-[-0.2px]";
            const detail = document.createElement("span");
            detail.textContent = "2 rooms";
            detail.className = "block text-[12px] leading-[1.2] text-[#666666]";
            const text = document.createElement("span");
            text.append(name, detail);
            link.append(img, text);
          }
          markers.push(
            new maplibregl.Marker({
              element: link,
              anchor: compact ? "center" : place.anchor,
              offset: compact ? place.nudge : [0, 0],
            })
              .setLngLat([place.lng, place.lat])
              .addTo(created),
          );
        }
      };
      created.on("load", () => {
        compact = node.clientWidth < 720;
        paintMarkers();
        fit(0);
        setReady(true);
      });
      observer = new ResizeObserver(() => {
        const next = node.clientWidth < 720;
        created.resize();
        if (next !== compact) {
          compact = next;
          paintMarkers();
          fit(0);
        }
      });
      observer.observe(node);
      created.on("error", () => setFailed(true));
      mapRef.current = map;
    })();

    function onFull() {
      setFull(document.fullscreenElement === frame.current);
      mapRef.current?.resize();
    }
    document.addEventListener("fullscreenchange", onFull);
    return () => {
      cancelled = true;
      document.removeEventListener("fullscreenchange", onFull);
      observer?.disconnect();
      map?.remove();
      mapRef.current = null;
    };
  }, []);

  function zoom(by: number) {
    const map = mapRef.current;
    if (!map) return;
    map.zoomTo(map.getZoom() + by, { duration: 280 });
  }

  function explore() {
    const map = mapRef.current;
    const maplibregl = libRef.current;
    if (!map || !maplibregl) return;
    const bounds = new maplibregl.LngLatBounds();
    for (const place of places) bounds.extend([place.lng, place.lat]);
    const compact = (surface.current?.clientWidth ?? 800) < 720;
    map.fitBounds(bounds, { padding: mapPadding(compact), duration: 700 });
  }

  async function toggleFull() {
    const node = frame.current;
    if (!node) return;
    if (document.fullscreenElement === node) await document.exitFullscreen();
    else await node.requestFullscreen();
    mapRef.current?.resize();
  }

  return (
    <div ref={frame} className="relative h-[520px] overflow-hidden rounded-[28px] bg-[#e6e1d4] sm:h-[640px]">
      <div ref={surface} className="h-full w-full" />
      {failed ? (
        <p className="absolute inset-x-0 bottom-16 z-10 px-6 text-center text-[14px] text-graphite">
          The map tiles did not load. The lodges are still on the stays page.
        </p>
      ) : null}
      <div className="pointer-events-none absolute inset-0 z-10">
        <div className="pointer-events-auto absolute top-4 right-4 flex flex-col gap-2">
          <MapButton label={full ? "Leave the map" : "Fill the screen"} onClick={() => void toggleFull()}>
            {full ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
          </MapButton>
          <MapButton label="Zoom in" onClick={() => zoom(1)}>
            <Plus className="size-4" />
          </MapButton>
          <MapButton label="Zoom out" onClick={() => zoom(-1)}>
            <Minus className="size-4" />
          </MapButton>
        </div>
        <button
          type="button"
          onClick={explore}
          disabled={!ready}
          className="pointer-events-auto absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-[#6d6860] px-5 py-2.5 text-[15px] tracking-[-0.2px] text-white disabled:opacity-60"
        >
          Explore map
        </button>
        <p className="absolute top-4 left-4 text-[11px] text-[#666] sm:top-auto sm:right-3 sm:bottom-3 sm:left-auto">
          <a className="pointer-events-auto underline" href="https://openfreemap.org/" target="_blank" rel="noreferrer">
            OpenFreeMap
          </a>
          {" · "}
          <a className="pointer-events-auto underline" href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">
            OpenStreetMap
          </a>
        </p>
      </div>
    </div>
  );
}

function MapButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="grid size-10 place-items-center rounded-full bg-[#e4e0d6] text-[#5c574e] shadow-subtle"
    >
      {children}
    </button>
  );
}
