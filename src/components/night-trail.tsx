"use client";

import { cn } from "@/lib/utils";
import { formatDayNumber, formatLong, formatWeekday } from "@/lib/dates";
import type { NightStatus } from "@/lib/types";

export function NightLegend() {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-[#5c5348]">
      <li className="flex items-center gap-2">
        <span className="size-3 rounded-full border border-[#8c4a2f]" /> Open
      </li>
      <li className="flex items-center gap-2">
        <span className="size-3 rounded-full bg-[#1c1914]" /> Guest stay
      </li>
      <li className="flex items-center gap-2">
        <span className="size-3 rounded-full bg-[#c9843a]" /> Your stay
      </li>
      <li className="flex items-center gap-2">
        <span className="night-blocked size-3 rounded-full" /> House hold
      </li>
    </ul>
  );
}

function markClass(status: NightStatus, inRange: boolean): string {
  if (inRange && status === "open") return "border-[#1e3a32] bg-[#1e3a32]";
  if (status === "sample") return "border-[#1c1914] bg-[#1c1914]";
  if (status === "yours") return "border-[#c9843a] bg-[#c9843a]";
  if (status === "blocked") return "night-blocked border-[#8c4a2f]";
  return "border-[#8c4a2f] bg-transparent";
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
              "flex shrink-0 flex-col items-center gap-1 rounded-xl px-1 py-1.5 text-[#1c1914] transition-colors",
              dense ? "w-9" : "w-12",
              inRange ? "bg-[#1e3a32]/10" : "hover:bg-[#efe6d6]",
              !onPick && "cursor-default",
            )}
          >
            <span className="text-[10px] tracking-wide text-[#5c5348] uppercase">{formatWeekday(day.iso)}</span>
            <span className={cn("font-medium", dense ? "text-[11px]" : "text-xs")}>{formatDayNumber(day.iso)}</span>
            <span className={cn("w-2.5 rounded-full border", dense ? "h-6" : "h-8", markClass(day.status, inRange))} />
          </button>
        );
      })}
      </div>
    </div>
  );
}
