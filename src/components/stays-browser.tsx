"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PropertyCard } from "@/components/property-card";
import { Button } from "@/components/ui/button";
import { properties, valleys } from "@/lib/catalog";
import { countNights } from "@/lib/availability";
import { useLedger } from "@/lib/use-ledger";
import type { Valley } from "@/lib/types";

type SortKey = "open" | "price" | "elevation";

export function StaysBrowser() {
  const { today, bookings, blocks, ready } = useLedger();
  const requested = useSearchParams().get("valley");
  const fromUrl = valleys.includes(requested as Valley) ? (requested as Valley) : "All";
  const [picked, setPicked] = useState<Valley | "All" | null>(null);
  const valley = picked ?? fromUrl;
  const [sort, setSort] = useState<SortKey>("open");

  const visible = useMemo(() => {
    const filtered = properties.filter((property) => valley === "All" || property.valley === valley);
    const scored = filtered.map((property) => {
      const open = ready
        ? property.rooms.reduce(
            (sum, room) => sum + countNights(property.slug, room.slug, today, bookings, blocks, 7).open,
            0,
          )
        : 0;
      const price = Math.min(...property.rooms.map((room) => room.price));
      return { property, open, price };
    });
    scored.sort((a, b) => {
      if (sort === "price") return a.price - b.price;
      if (sort === "elevation") return b.property.elevationM - a.property.elevationM;
      return b.open - a.open;
    });
    return scored.map((item) => item.property);
  }, [valley, sort, today, bookings, blocks, ready]);

  return (
    <div className="mx-auto w-full max-w-[1280px] px-5 py-16 sm:px-8 sm:py-24">
      <p className="text-[14px] tracking-[-0.56px] text-graphite">Himachal</p>
      <h1 className="font-heading mt-4 text-[clamp(40px,5vw,60px)] leading-[0.96] tracking-[-0.04em] text-ink">Stays with a key on the desk</h1>
      <p className="mt-5 max-w-2xl text-[18px] leading-[1.33] tracking-[-0.18px]">
        Twelve rooms across six valleys. Open a house to turn the model, then take the nights the board still
        shows as hollow.
      </p>

      <div className="mt-6 flex flex-col gap-4">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Valley">
          <Button
            type="button"
            size="sm"
            variant={valley === "All" ? "default" : "outline"}
            aria-pressed={valley === "All"}
            onClick={() => setPicked("All")}
          >
            All valleys
          </Button>
          {valleys.map((item) => (
            <Button
              key={item}
              type="button"
              size="sm"
              variant={valley === item ? "default" : "outline"}
              aria-pressed={valley === item}
              onClick={() => setPicked(item)}
            >
              {item}
            </Button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Sort">
          {(
            [
              ["open", "Most open this week"],
              ["price", "Nightly price"],
              ["elevation", "Elevation"],
            ] as const
          ).map(([key, label]) => (
            <Button
              key={key}
              type="button"
              size="sm"
              variant={sort === key ? "secondary" : "ghost"}
              aria-pressed={sort === key}
              onClick={() => setSort(key)}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="mt-16 text-[16px] text-graphite">No lodge in that valley is on the desk.</p>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((property) => (
            <PropertyCard
              key={property.slug}
              property={property}
              today={today}
              bookings={bookings}
              blocks={blocks}
            />
          ))}
        </div>
      )}
    </div>
  );
}
