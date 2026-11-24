"use client";

import { useState } from "react";
import Link from "next/link";
import { PropertyCard } from "@/components/property-card";
import { RoomStage } from "@/components/room-stage";
import { Button } from "@/components/ui/button";
import { allRooms, properties } from "@/lib/catalog";
import { nightStatus } from "@/lib/availability";
import { useLedger } from "@/lib/use-ledger";

const featured = properties[0]?.rooms[0];
const featuredHouse = properties[0];

export function HomeDesk() {
  const { today, bookings, blocks, ready } = useLedger();
  const [takenPreview, setTakenPreview] = useState(false);
  const rooms = allRooms();
  const tonight = ready
    ? rooms.filter(
        ({ property, room }) =>
          nightStatus(property.slug, room.slug, today, today, bookings, blocks) !== "open",
      ).length
    : null;

  return (
    <div>
      <section className="mx-auto grid w-full max-w-6xl items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:py-14">
        <div>
          <p className="text-[11px] tracking-[0.2em] text-[#8c4a2f] uppercase">
            Kullu · Shimla · Kangra · Spiti
          </p>
          <h1 className="font-heading mt-3 text-5xl leading-[1.05] text-[#1c1914] sm:text-6xl">
            See the room, then take the night.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-[#3f382f]">
            HimStays is the booking desk for a handful of independent lodges in Himachal. Turn a model of
            the room — the bed, the bukhari, the window — and hold only the nights that are still open.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button className="h-11 px-4" nativeButton={false} render={<Link href="/stays" />}>
              Browse the lodges
            </Button>
            <Button variant="outline" className="h-11 px-4" nativeButton={false} render={<Link href="/host" />}>
              Open occupancy
            </Button>
            <Button type="button" variant="ghost" className="h-11 px-4" onClick={() => setTakenPreview((value) => !value)}>
              {takenPreview ? "Show the room open" : "Preview a taken night"}
            </Button>
          </div>
          <p className="mt-6 max-w-md text-sm leading-6 text-[#5c5348]">
            {tonight === null
              ? "Counting tonight across the six houses…"
              : `Tonight, ${tonight} of ${rooms.length} rooms are spoken for.`}
          </p>
        </div>
        {featured && featuredHouse ? (
          <RoomStage
            name={featured.name}
            wall={featured.wall}
            bed={featured.bed}
            view={featured.view}
            fireplace={featured.fireplace}
            mood={takenPreview ? "held" : "open"}
            moodLabel={
              takenPreview
                ? "Taken night. A bag on the bed, linen already lived in."
                : "Cedar suite at Deodar House, turned down."
            }
          />
        ) : null}
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-4 sm:px-6">
        <div className="grid gap-4 rounded-3xl border border-[#e0d4c2] bg-[#faf7f2] p-5 sm:grid-cols-3">
          <div>
            <p className="font-heading text-xl">Turn it</p>
            <p className="mt-2 text-sm leading-6 text-[#3f382f]">
              Drag the model. Dawn, afternoon, dusk, and night change the light on the same walls. A taken
              night puts a bag on the bed.
            </p>
          </div>
          <div>
            <p className="font-heading text-xl">Read the trail</p>
            <p className="mt-2 text-sm leading-6 text-[#3f382f]">
              Each mark is a night. Hollow marks are open. Filled marks already belong to a guest or to the
              house.
            </p>
          </div>
          <div>
            <p className="font-heading text-xl">Leave your name</p>
            <p className="mt-2 text-sm leading-6 text-[#3f382f]">
              The stay is confirmed on this browser. Occupancy on the lodge desk moves with it. Nothing is
              sent to a server.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] tracking-[0.18em] text-[#8c4a2f] uppercase">The houses</p>
            <h2 className="font-heading text-4xl text-[#1c1914]">Six lodges, twelve rooms</h2>
          </div>
          <Link href="/stays" className="text-sm text-[#1e3a32] underline underline-offset-4">
            Filter by valley
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <PropertyCard
              key={property.slug}
              property={property}
              today={today}
              bookings={bookings}
              blocks={blocks}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
