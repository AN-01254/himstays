"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { BookingPanel } from "@/components/booking-panel";
import { RoomStage } from "@/components/room-stage";
import { bedLabel, getProperty, wallLabel } from "@/lib/catalog";
import { addDays, eachNight, elevationLabel, inr } from "@/lib/dates";
import { moodFor, nightStatus, statusLabel } from "@/lib/availability";
import { useLedger } from "@/lib/use-ledger";
import { cn } from "@/lib/utils";

function subscribeHash(onStoreChange: () => void) {
  window.addEventListener("hashchange", onStoreChange);
  return () => window.removeEventListener("hashchange", onStoreChange);
}

function currentHash() {
  return window.location.hash.replace(/^#/, "");
}

export function StayExperience({ slug }: { slug: string }) {
  const property = getProperty(slug);
  const { today, bookings, blocks, ready } = useLedger();
  const hash = useSyncExternalStore(subscribeHash, currentHash, () => "");
  const roomSlug = property?.rooms.some((item) => item.slug === hash)
    ? hash
    : (property?.rooms[0]?.slug ?? "");
  const [checkIn, setCheckIn] = useState<string | null>(null);
  const [checkOut, setCheckOut] = useState<string | null>(null);
  const [anchor, setAnchor] = useState<string | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  if (!property) return null;
  const room = property.rooms.find((item) => item.slug === roomSlug) ?? property.rooms[0];
  if (!room) return null;

  function statusFor(iso: string) {
    if (!ready || !today) return "open" as const;
    return nightStatus(property!.slug, room.slug, iso, today, bookings, blocks);
  }

  const focusIso = hover ?? checkIn ?? (today || null);
  const focusStatus = focusIso ? statusFor(focusIso) : "open";
  const mood = moodFor(focusStatus);
  const moodLabel = !ready
    ? "Reading the board…"
    : focusIso
      ? `${statusLabel(focusStatus)} · ${focusIso === today ? "tonight" : "the night you are on"}`
      : "Open";

  function chooseRoom(next: string) {
    setNotice(null);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.history.replaceState(null, "", `#${next}`);
    window.dispatchEvent(new HashChangeEvent("hashchange"));
    if (window.matchMedia("(max-width: 1023px)").matches) {
      document.getElementById("booking")?.scrollIntoView({
        behavior: reduce ? "auto" : "smooth",
        block: "start",
      });
    }
  }

  function onPick(iso: string) {
    const status = statusFor(iso);
    if (status !== "open") {
      setNotice(
        status === "yours"
          ? "You already have this night. It is listed under Your stays."
          : status === "blocked"
            ? "The house is holding this night."
            : "A guest already has this night.",
      );
      return;
    }
    setNotice(null);
    if (!anchor) {
      setAnchor(iso);
      setCheckIn(iso);
      setCheckOut(addDays(iso, 1));
      return;
    }
    const start = iso < anchor ? iso : anchor;
    const end = iso < anchor ? anchor : iso;
    const checkout = addDays(end, 1);
    const taken = eachNight(start, checkout).filter((night) => statusFor(night) !== "open");
    setCheckIn(start);
    setCheckOut(checkout);
    setAnchor(null);
    if (taken.length > 0) {
      setNotice(
        taken.length === 1
          ? "That stretch crosses a night that is already spoken for."
          : "That stretch crosses nights that are already spoken for.",
      );
    }
  }

  return (
    <div className="mx-auto w-full min-w-0 max-w-[1280px] px-5 py-16 sm:px-8 sm:py-24">
      <p className="text-[14px] tracking-[-0.56px] text-graphite">
        <Link href="/stays" className="text-sky-blue">
          Stays
        </Link>
        <span aria-hidden> · </span>
        {property.valley}
      </p>
      <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-heading text-[clamp(40px,5vw,60px)] leading-[0.96] tracking-[-0.04em] text-ink">{property.name}</h1>
          <p className="mt-4 max-w-2xl text-[18px] leading-[1.33] tracking-[-0.18px]">{property.summary}</p>
        </div>
        <p className="text-[14px] leading-[1.5] tracking-[-0.56px] text-graphite">
          {property.town}
          <br />
          {elevationLabel(property.elevationM)} · Host {property.host}
        </p>
      </div>

      <div className="mt-8 grid min-w-0 items-start gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.8fr)]">
        <RoomStage
          key={room.slug}
          name={room.name}
          wall={room.wall}
          bed={room.bed}
          view={room.view}
          fireplace={room.fireplace}
          mood={mood}
          moodLabel={moodLabel}
          notes={room.notes}
        />
        <BookingPanel
          property={property}
          room={room}
          today={today}
          ready={ready}
          checkIn={checkIn}
          checkOut={checkOut}
          notice={notice}
          onPick={onPick}
          onHover={setHover}
          onBooked={() => {
            setCheckIn(null);
            setCheckOut(null);
            setAnchor(null);
          }}
        />
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {property.rooms.map((item) => {
          const tonight = ready && today ? nightStatus(property.slug, item.slug, today, today, bookings, blocks) : null;
          const selected = item.slug === room.slug;
          return (
            <button
              key={item.slug}
              type="button"
              onClick={() => chooseRoom(item.slug)}
              aria-pressed={selected}
              className={cn(
                "rounded-xl px-5 py-5 text-left shadow-subtle",
                selected ? "bg-warm-sand ring-2 ring-sky-blue" : "bg-[#f7f7f0]",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-heading text-[30px] leading-[1.14] tracking-[-0.9px]">{item.name}</h2>
                  <p className="mt-1 text-[14px] text-graphite">
                    {bedLabel(item.bed)} · {wallLabel(item.wall)} · sleeps {item.capacity}
                  </p>
                </div>
                <p className="text-sm font-medium">{inr(item.price)}</p>
              </div>
              <p className="mt-3 text-[16px] leading-[1.49] tracking-[-0.22px]">{item.summary}</p>
              <p className="mt-3 text-[12px] tracking-[-0.48px] text-sky-blue">
                {tonight ? `Tonight · ${statusLabel(tonight)}` : "Tonight · checking"}
              </p>
            </button>
          );
        })}
      </div>

      <div className="mt-10 grid gap-8 md:grid-cols-[1.3fr_0.7fr]">
        <div>
          <h2 className="font-heading text-[36px] leading-[1.1] tracking-[-0.5px]">The house</h2>
          <p className="mt-4 max-w-2xl text-[18px] leading-[1.33] tracking-[-0.18px]">{property.story}</p>
          <p className="mt-4 text-[14px] text-graphite">{property.hostLine}</p>
        </div>
        <div>
          <h2 className="font-heading text-[36px] leading-[1.1] tracking-[-0.5px]">House rules</h2>
          <ul className="mt-4 grid gap-3 text-[16px] leading-[1.49] tracking-[-0.22px]">
            {property.rules.map((rule) => (
              <li key={rule} className="border-t border-black/10 pt-3">
                {rule}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
