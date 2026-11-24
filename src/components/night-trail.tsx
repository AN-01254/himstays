"use client";

import { cn } from "@/lib/utils";
import { formatDayNumber, formatLong, formatWeekday } from "@/lib/dates";
import type { NightStatus } from "@/lib/types";

export function NightLegend() {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-2 text-[12px] tracking-[-0.48px] text-graphite">
      <li className="flex items-center gap-2">
        <span className="size-3 rounded-full border border-[#999]" /> Open
      </li>
      <li className="flex items-center gap-2">
        <span className="size-3 rounded-full bg-ink" /> Guest stay
      </li>
      <li className="flex items-center gap-2">
        <span className="size-3 rounded-full bg-sky-blue" /> Your stay
      </li>
      <li className="flex items-center gap-2">
        <span className="night-blocked size-3 rounded-full" /> House hold
      </li>
    </ul>
  );
}

function markClass(status: NightStatus, inRange: boolean): string {
  if (inRange && status === "open") return "border-sky-blue bg-sky-blue";
  if (status === "sample") return "border-ink bg-ink";
  if (status === "yours") return "border-sky-blue bg-sky-blue";
  if (status === "blocked") return "night-blocked border-[#999]";
  return "border-[#999] bg-transparent";
}

export function NightTrail({
  days,
  checkIn,
  checkOut,
  onPick,
  onHover,
  dense = false,
}: {
  days: { iso: string; status: NightStatus }[];
  checkIn?: string | null;
  checkOut?: string | null;
  onPick?: (iso: string) => void;
  onHover?: (iso: string | null) => void;
  dense?: boolean;
}) {
  return (
    <div className="grid w-full min-w-0 grid-cols-1 overflow-x-auto" onMouseLeave={() => onHover?.(null)}>
    <div className="flex w-max gap-1 pb-1">
      {days.map((day) => {
        const inRange = Boolean(checkIn && checkOut && day.iso >= checkIn && day.iso < checkOut);
        const label = `${formatLong(day.iso)}, ${day.status === "open" ? "open" : day.status === "sample" ? "guest stay" : day.status === "yours" ? "your stay" : "house hold"}`;
        return (
          <button
            key={day.iso}
            type="button"
            disabled={!onPick}
            aria-label={label}
            aria-pressed={inRange}
            onMouseEnter={() => onHover?.(day.iso)}
            onFocus={() => onHover?.(day.iso)}
            onBlur={() => onHover?.(null)}
            onClick={() => onPick?.(day.iso)}
            className={cn(
              "flex shrink-0 flex-col items-center gap-1 rounded-xl px-1 py-1.5 text-ink transition-colors",
              dense ? "w-9" : "w-12",
              inRange ? "bg-sky-blue/10" : "hover:bg-black/4",
              !onPick && "cursor-default",
            )}
          >
            <span className="text-[10px] tracking-[-0.3px] text-graphite uppercase">{formatWeekday(day.iso)}</span>
            <span className={cn("font-medium", dense ? "text-[11px]" : "text-xs")}>{formatDayNumber(day.iso)}</span>
            <span className={cn("w-2.5 rounded-full border", dense ? "h-6" : "h-8", markClass(day.status, inRange))} />
          </button>
        );
      })}
      </div>
    </div>
  );
}
