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

const cta = "h-auto rounded-xl px-[18px] py-[14px] text-[15px]";

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
      <section className="bg-black text-white">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-8 px-5 py-24 sm:px-8 lg:py-32">
          <p className="text-[14px] tracking-[-0.56px] text-white/70">Kullu · Shimla · Kangra · Spiti</p>
          <h1 className="max-w-5xl font-heading text-[clamp(48px,8vw,96px)] leading-[0.9] tracking-[-0.047em]">
            See the room, then take the night.
          </h1>
          <p className="max-w-xl text-[18px] leading-[1.33] tracking-[-0.18px] text-white/80">
            HimStays is the booking desk for a handful of independent lodges in Himachal. Turn a model of
            the room — the bed, the bukhari, the window — and hold only the nights that are still open.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="urgent" className={cta} nativeButton={false} render={<Link href="/stays" />}>
              Browse the lodges
            </Button>
            <Button
              variant="ghost"
              className={`${cta} text-white hover:bg-white/10`}
              nativeButton={false}
              render={<Link href="/host" />}
            >
              Open occupancy
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-[1280px] items-start gap-12 px-5 py-24 sm:px-8 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:gap-16 lg:py-28">
        <div>
          <p className="text-[14px] tracking-[-0.56px] text-graphite">The model</p>
          <h2 className="mt-4 font-heading text-[clamp(36px,4vw,60px)] leading-[0.96] tracking-[-0.04em]">
            A room you can turn.
          </h2>
          <p className="mt-6 max-w-md text-[18px] leading-[1.33] tracking-[-0.18px]">
            Cedar suite at Deodar House. Drag the walls. Change the hour. A taken night puts a bag on the bed.
          </p>
          <Button
            type="button"
            variant="ghost"
            className="mt-8 h-auto rounded-3xl bg-black/4 px-5 py-3 text-[15px] hover:bg-black/8"
            onClick={() => setTakenPreview((value) => !value)}
          >
            {takenPreview ? "Show the room open" : "Preview a taken night"}
          </Button>
          <p className="mt-6 max-w-md text-[14px] leading-[1.5] tracking-[-0.56px] text-graphite">
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

      <section className="mx-auto grid w-full max-w-[1280px] gap-4 px-5 pb-24 sm:px-8 lg:grid-cols-3 lg:pb-28">
        {[
          [
            "Turn it",
            "Drag the model. Dawn, afternoon, dusk, and night change the light on the same walls. A taken night puts a bag on the bed.",
          ],
          [
            "Read the trail",
            "Each mark is a night. Hollow marks are open. Filled marks already belong to a guest or to the house.",
          ],
          [
            "Leave your name",
            "The stay is confirmed on this browser. Occupancy on the lodge desk moves with it. Nothing is sent to a server.",
          ],
        ].map(([title, copy]) => (
          <div key={title} className="rounded-[18px] bg-warm-sand p-9 shadow-subtle">
            <p className="font-heading text-[30px] leading-[1.14] tracking-[-0.9px]">{title}</p>
            <p className="mt-4 text-[16px] leading-[1.49] tracking-[-0.22px] text-ink">{copy}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto w-full max-w-[1280px] px-5 pb-28 sm:px-8">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-[14px] tracking-[-0.56px] text-graphite">The houses</p>
            <h2 className="mt-3 font-heading text-[clamp(36px,4vw,48px)] leading-none tracking-[-0.027em]">
              Six lodges, twelve rooms
            </h2>
          </div>
          <Link href="/stays" className="text-[15px] text-sky-blue">
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
