"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PropertyCard } from "@/components/property-card";
import { RoomStage } from "@/components/room-stage";
import { Button } from "@/components/ui/button";
import { allRooms, properties } from "@/lib/catalog";
import { nightStatus } from "@/lib/availability";
import { heroPhoto, lodgePhoto } from "@/lib/photos";
import { useLedger } from "@/lib/use-ledger";

const featured = properties[0]?.rooms[0];
const featuredHouse = properties[0];
const dock = properties.slice(0, 4);

export function HomeDesk() {
  const { today, bookings, blocks, ready } = useLedger();
  const [takenPreview, setTakenPreview] = useState(false);
  const [dockIndex, setDockIndex] = useState(1);
  const rooms = allRooms();
  const tonight = ready
    ? rooms.filter(
        ({ property, room }) =>
          nightStatus(property.slug, room.slug, today, today, bookings, blocks) !== "open",
      ).length
    : null;

  return (
    <div>
      <section className="bg-white px-3 pt-3 sm:px-4 sm:pt-4">
        <h1 className="sr-only">HimStays. Rooms in Himachal you can turn before you book.</h1>
        <div className="relative h-[78vh] min-h-[640px] overflow-hidden rounded-[28px] bg-[#d7e2ea]">
          <Image
            src={heroPhoto.src}
            alt={heroPhoto.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-[62%_center]"
          />
          {dock.length > 0 ? (
            <div className="absolute inset-x-0 bottom-5 flex justify-center px-3 sm:bottom-7">
              <div className="flex max-w-full items-center">
                {dock.map((property, index) => {
                  const photo = lodgePhoto[property.slug] ?? heroPhoto;
                  if (index === dockIndex) {
                    return (
                      <Link
                        key={property.slug}
                        href={`/stays/${property.slug}`}
                        className="mx-1.5 flex min-w-0 items-center gap-3 rounded-full bg-white py-1.5 pr-4 pl-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.16)] sm:mx-2 sm:pr-5"
                      >
                        <Image src={photo.src} alt="" width={56} height={56} className="size-12 rounded-full object-cover sm:size-14" />
                        <span className="min-w-0">
                          <span className="block truncate text-[14px] tracking-[-0.2px] text-ink sm:text-[15px]">
                            {property.name}
                            <span className="text-graphite"> {property.town}</span>
                          </span>
                          <span className="block text-[14px] text-sky-blue">See the room</span>
                        </span>
                      </Link>
                    );
                  }
                  return (
                    <button
                      key={property.slug}
                      type="button"
                      aria-label={property.name}
                      aria-pressed={false}
                      onClick={() => setDockIndex(index)}
                      className="mx-1 size-12 shrink-0 overflow-hidden rounded-full ring-2 ring-white sm:mx-1.5 sm:size-14"
                    >
                      <Image src={photo.src} alt="" width={56} height={56} className="h-full w-full object-cover" />
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
        <p className="px-2 pt-3 text-[12px] tracking-[-0.2px] text-[#9a9a9a]">
          Homestay near Shimla, public domain, Shivya. Other houses: CC BY-SA, Wikimedia Commons.
        </p>
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
