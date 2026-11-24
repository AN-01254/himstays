import type { WindowView } from "@/lib/types";

const sky: Record<WindowView, string> = {
  valley: "#d5e3ea",
  ridge: "#c9d5df",
  monastery: "#ead9c0",
  river: "#d5e7e4",
  desert: "#f0d7b4",
  meadow: "#d7e6d4",
};

const far: Record<WindowView, string> = {
  valley: "#8ea4ae",
  ridge: "#9aabba",
  monastery: "#b9a48a",
  river: "#8fafa8",
  desert: "#c49a6a",
  meadow: "#8eaa86",
};

const near: Record<WindowView, string> = {
  valley: "#1e3a32",
  ridge: "#24343f",
  monastery: "#6b4a32",
  river: "#1d4a52",
  desert: "#8c4a2f",
  meadow: "#2f4a34",
};

export function ValleyPoster({ view, className }: { view: WindowView; className?: string }) {
  return (
    <svg viewBox="0 0 640 400" className={className} role="img" aria-label="A drawn ridge for this lodge">
      <rect width="640" height="400" fill={sky[view]} />
      <circle cx="520" cy="78" r="28" fill="#f6efe2" opacity="0.9" />
      <path d="M0 250 L90 150 L170 220 L260 110 L360 210 L470 130 L560 200 L640 150 L640 400 L0 400 Z" fill={far[view]} />
      <path d="M0 300 L120 210 L210 270 L320 180 L430 280 L520 220 L640 270 L640 400 L0 400 Z" fill={near[view]} />
      <path d="M250 250 L290 190 L330 250 Z" fill="#f3eee4" />
      <rect x="286" y="228" width="28" height="34" fill="#1c1914" />
      {view === "river" || view === "valley" ? (
        <path d="M40 330 C140 300 200 350 300 320 C400 290 480 350 620 318" fill="none" stroke="#d5e7e8" strokeWidth="8" />
      ) : null}
      {view === "desert" ? <rect x="70" y="250" width="70" height="28" fill="#e6c89a" /> : null}
    </svg>
  );
}
