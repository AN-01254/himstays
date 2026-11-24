import type { WindowView } from "@/lib/types";

const hill: Record<WindowView, string> = {
  valley: "#375033",
  ridge: "#2c3a44",
  monastery: "#375033",
  river: "#2a4a52",
  desert: "#c4a574",
  meadow: "#375033",
};

export function ValleyPoster({ view, className }: { view: WindowView; className?: string }) {
  return (
    <svg viewBox="0 0 640 360" className={className} role="img" aria-label="A drawn elevation of this lodge">
      <rect width="640" height="360" fill="#f7f7f0" />
      <rect x="0" y="0" width="640" height="210" fill="#f3f7fb" />
      <circle cx="500" cy="72" r="22" fill="#fff" />
      <path d="M0 210 L120 132 L210 188 L310 96 L420 176 L520 118 L640 168 L640 210 Z" fill="#d9e3ea" />
      <path d="M0 250 L150 176 L250 230 L360 150 L470 228 L560 186 L640 230 L640 360 L0 360 Z" fill={hill[view]} />
      <g fill="none" stroke="#000" strokeWidth="1.4">
        <path d="M248 248 L320 176 L392 248" />
        <path d="M248 248 H392 V312 H248 Z" />
        <path d="M300 312 V268 H332 V312" />
      </g>
      <rect x="268" y="208" width="22" height="18" fill="#0096f7" />
      <rect x="350" y="208" width="22" height="18" fill="#0096f7" />
      {view === "river" || view === "valley" ? (
        <path d="M24 300 C160 274 220 324 340 296 C450 270 520 328 620 300" fill="none" stroke="#0096f7" strokeWidth="3" />
      ) : null}
      {view === "monastery" ? <path d="M470 168 L486 140 L502 168 Z" fill="none" stroke="#000" strokeWidth="1.4" /> : null}
    </svg>
  );
}
