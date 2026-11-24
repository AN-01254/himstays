"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { NightLegend, NightTrail } from "@/components/night-trail";
import { Button } from "@/components/ui/button";
import {
  HOST_HORIZON,
  countNights,
  nightStatus,
  sampleStaysForRoom,
  statusLabel,
} from "@/lib/availability";
import { allRooms, getRoom, properties } from "@/lib/catalog";
import { addDays, formatLong } from "@/lib/dates";
import { useLedger } from "@/lib/use-ledger";
import type { NightStatus } from "@/lib/types";

const reasons = ["Host stay", "Maintenance", "Family", "Quiet night"] as const;

export function HostDesk() {
  const { today, bookings, blocks, ready, holdNight, releaseNight, cancel } = useLedger();
  const [reason, setReason] = useState<(typeof reasons)[number]>("Host stay");
  const [message, setMessage] = useState<string | null>(null);
  const rooms = allRooms();

  const stats = useMemo(() => {
    if (!ready || !today) return null;
    let tonightTaken = 0;
    let weekTaken = 0;
    let weekTotal = 0;
    for (const { property, room } of rooms) {
      if (nightStatus(property.slug, room.slug, today, today, bookings, blocks) !== "open") tonightTaken += 1;
      const count = countNights(property.slug, room.slug, today, bookings, blocks, 7);
      weekTaken += count.taken;
      weekTotal += count.open + count.taken;
    }
    return {
      tonightTaken,
      tonightOpen: rooms.length - tonightTaken,
      weekTaken,
      weekTotal,
      weekPercent: weekTotal === 0 ? 0 : Math.round((weekTaken / weekTotal) * 100),
    };
  }, [ready, today, rooms, bookings, blocks]);

  const movement = useMemo(() => {
    if (!ready || !today) return { arrivals: [], departures: [] };
    const arrivals: { id: string; when: string; who: string; where: string; kind: string }[] = [];
    const departures: { id: string; when: string; who: string; where: string; kind: string }[] = [];
    const horizonEnd = addDays(today, 5);
    for (const { property, room } of rooms) {
      const where = `${property.name} · ${room.name}`;
      for (const stay of sampleStaysForRoom(property.slug, room.slug, today, room.capacity)) {
        if (stay.checkIn >= today && stay.checkIn < horizonEnd) {
          arrivals.push({ id: stay.id, when: stay.checkIn, who: stay.guestName, where, kind: "Sample stay" });
        }
        if (stay.checkOut >= today && stay.checkOut < horizonEnd) {
          departures.push({
            id: `${stay.id}-out`,
            when: stay.checkOut,
            who: stay.guestName,
            where,
            kind: "Sample stay",
          });
        }
      }
    }
    for (const booking of bookings) {
      const found = getRoom(booking.propertySlug, booking.roomSlug);
      const where = found ? `${found.property.name} · ${found.room.name}` : booking.roomSlug;
      if (booking.checkIn >= today && booking.checkIn < horizonEnd) {
        arrivals.push({ id: booking.id, when: booking.checkIn, who: booking.guestName, where, kind: "Your browser" });
      }
      if (booking.checkOut >= today && booking.checkOut < horizonEnd) {
        departures.push({
          id: `${booking.id}-out`,
          when: booking.checkOut,
          who: booking.guestName,
          where,
          kind: "Your browser",
        });
      }
    }
    const byWhen = (a: { when: string; where: string }, b: { when: string; where: string }) =>
      a.when.localeCompare(b.when) || a.where.localeCompare(b.where);
    arrivals.sort(byWhen);
    departures.sort(byWhen);
    return { arrivals, departures };
  }, [ready, today, rooms, bookings]);

  function onNight(propertySlug: string, roomSlug: string, iso: string, status: NightStatus) {
    if (status === "open") {
      const result = holdNight(propertySlug, roomSlug, iso, reason);
      setMessage(result.ok ? `${formatLong(iso)} is held for the house · ${reason}.` : result.error);
      return;
    }
    if (status === "blocked") {
      releaseNight(propertySlug, roomSlug, iso);
      setMessage(`${formatLong(iso)} is back on the hook.`);
      return;
    }
    if (status === "yours") {
      const booking = bookings.find(
        (item) =>
          item.propertySlug === propertySlug &&
          item.roomSlug === roomSlug &&
          iso >= item.checkIn &&
          iso < item.checkOut,
      );
      if (!booking) return;
      cancel(booking.id);
      setMessage(`${booking.guestName}'s stay ${booking.id} is cancelled. Those nights are open.`);
      return;
    }
    setMessage("Sample guest stays are already on the board. They are not yours to move.");
  }

  return (
    <div className="mx-auto w-full min-w-0 max-w-6xl px-4 py-10 sm:px-6">
      <p className="text-[11px] tracking-[0.18em] text-[#8c4a2f] uppercase">Lodge desk</p>
      <div className="mt-2 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-heading text-4xl text-[#1c1914] sm:text-5xl">Occupancy</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-[#3f382f]">
            Every room HimStays holds a key for, night by night. A filled mark is spoken for. Tap an open
            night to hold it for the house. Tap that hold to put the key back.
          </p>
        </div>
        <label className="grid gap-1.5 text-sm">
          <span className="text-[#5c5348]">Hold new nights as</span>
          <select
            value={reason}
            onChange={(event) => setReason(event.target.value as (typeof reasons)[number])}
            className="h-10 rounded-lg border border-[#e0d4c2] bg-[#faf7f2] px-3"
          >
            {reasons.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Spoken for tonight"
          value={stats ? `${stats.tonightTaken}/${rooms.length}` : "–"}
          detail={stats ? `${stats.tonightOpen} keys still on the hook` : "Reading the board"}
        />
        <Stat
          label="This week"
          value={stats ? `${stats.weekPercent}%` : "–"}
          detail={stats ? `${stats.weekTaken} of ${stats.weekTotal} room-nights` : "Seven nights, twelve rooms"}
        />
        <Stat
          label="Arrivals, five days"
          value={ready ? String(movement.arrivals.length) : "–"}
          detail="Sample guests and stays from this browser"
        />
        <Stat
          label="Departures, five days"
          value={ready ? String(movement.departures.length) : "–"}
          detail="Mornings the room turns over"
        />
      </div>

      {message ? (
        <p className="mt-4 text-sm text-[#1e3a32]" role="status">
          {message}
        </p>
      ) : null}

      <div className="mt-8">
        <h2 className="font-heading text-2xl">Keys tonight</h2>
        <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {rooms.map(({ property, room }) => {
            const status = ready && today ? nightStatus(property.slug, room.slug, today, today, bookings, blocks) : null;
            const out = status !== null && status !== "open";
            const stay =
              status === "sample" && today
                ? sampleStaysForRoom(property.slug, room.slug, today, room.capacity).find(
                    (item) => today >= item.checkIn && today < item.checkOut,
                  )
                : undefined;
            const yours =
              status === "yours"
                ? bookings.find(
                    (item) =>
                      item.propertySlug === property.slug &&
                      item.roomSlug === room.slug &&
                      today >= item.checkIn &&
                      today < item.checkOut,
                  )
                : undefined;
            const block = blocks.find(
              (item) => item.propertySlug === property.slug && item.roomSlug === room.slug && item.date === today,
            );
            const line = !status
              ? "Checking the hook"
              : status === "open"
                ? "Key is on the hook"
                : status === "blocked"
                  ? `Held · ${block?.reason ?? "House hold"}`
                  : status === "yours"
                    ? `With ${yours?.guestName ?? "you"}`
                    : `With ${stay?.guestName ?? "a guest"}`;
            return (
              <li key={`${property.slug}-${room.slug}`} className="rounded-2xl border border-[#e0d4c2] bg-[#faf7f2] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs text-[#5c5348]">{property.town}</p>
                    <h3 className="font-medium">{room.name}</h3>
                    <p className="text-sm text-[#5c5348]">{property.name}</p>
                  </div>
                  <span className={out ? "mt-1 size-3 rounded-full bg-[#1c1914]" : "mt-1 size-3 rounded-full bg-[#3e5c4c]"} />
                </div>
                <p className="mt-3 text-sm">{line}</p>
                <Link
                  href={`/stays/${property.slug}#${room.slug}`}
                  className="mt-2 inline-block text-sm text-[#1e3a32] underline underline-offset-4"
                >
                  Open the model
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-10">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="font-heading text-2xl">The next {HOST_HORIZON} nights</h2>
          <NightLegend />
        </div>
        <div className="grid gap-5">
          {properties.map((property) => {
            const week = ready
              ? property.rooms.reduce(
                  (sum, room) => {
                    const count = countNights(property.slug, room.slug, today, bookings, blocks, 7);
                    return { taken: sum.taken + count.taken, total: sum.total + count.open + count.taken };
                  },
                  { taken: 0, total: 0 },
                )
              : null;
            return (
              <section key={property.slug} className="rounded-3xl border border-[#e0d4c2] bg-[#faf7f2] p-4 sm:p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div>
                    <h3 className="font-heading text-2xl">{property.name}</h3>
                    <p className="text-sm text-[#5c5348]">
                      {property.host} · {property.town}
                    </p>
                  </div>
                  <p className="text-sm text-[#3f382f]">
                    {week && week.total > 0
                      ? `${Math.round((week.taken / week.total) * 100)}% spoken for this week`
                      : "Counting the week"}
                  </p>
                </div>
                <div className="mt-4 grid gap-4">
                  {property.rooms.map((room) => {
                    const days =
                      ready && today
                        ? Array.from({ length: HOST_HORIZON }, (_, index) => {
                            const iso = addDays(today, index);
                            return {
                              iso,
                              status: nightStatus(property.slug, room.slug, iso, today, bookings, blocks),
                            };
                          })
                        : [];
                    return (
                      <div key={room.slug}>
                        <div className="mb-1 flex items-baseline justify-between gap-3">
                          <p className="text-sm font-medium">{room.name}</p>
                          <p className="text-xs text-[#5c5348]">
                            {days[0] ? `Tonight · ${statusLabel(days[0].status)}` : "Tonight"}
                          </p>
                        </div>
                        {days.length > 0 ? (
                          <NightTrail
                            dense
                            days={days}
                            onPick={(iso) => {
                              const status = days.find((day) => day.iso === iso)?.status ?? "open";
                              onNight(property.slug, room.slug, iso, status);
                            }}
                          />
                        ) : (
                          <div className="h-14 animate-pulse rounded-2xl bg-[#e7dccb]" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <Movement title="Arrivals" rows={movement.arrivals} empty="No one is due in the next five days." />
        <Movement title="Departures" rows={movement.departures} empty="No morning turnover in the next five days." />
      </div>

      {bookings.length > 0 ? (
        <section className="mt-10">
          <h2 className="font-heading text-2xl">Stays from this browser</h2>
          <ul className="mt-3 grid gap-3">
            {bookings.map((booking) => {
              const found = getRoom(booking.propertySlug, booking.roomSlug);
              return (
                <li key={booking.id} className="flex flex-col gap-2 rounded-2xl border border-[#e0d4c2] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-heading tracking-[0.12em]">{booking.id}</p>
                    <p className="text-sm">
                      {booking.guestName}
                      {booking.phone ? ` · ${booking.phone}` : ""} · {found ? `${found.property.name}, ${found.room.name}` : booking.roomSlug}
                    </p>
                    <p className="text-sm text-[#5c5348]">
                      {formatLong(booking.checkIn)} – {formatLong(booking.checkOut)}
                      {booking.note ? ` · ${booking.note}` : ""}
                    </p>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={() => cancel(booking.id)}>
                    Release stay
                  </Button>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

function Stat({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-2xl border border-[#e0d4c2] bg-[#1e3a32] px-4 py-4 text-[#f6f1e7]">
      <p className="text-xs tracking-[0.14em] uppercase text-[#e7c49a]">{label}</p>
      <p className="font-heading mt-2 text-4xl">{value}</p>
      <p className="mt-1 text-sm text-[#f6f1e7]/80">{detail}</p>
    </div>
  );
}

function Movement({
  title,
  rows,
  empty,
}: {
  title: string;
  rows: { id: string; when: string; who: string; where: string; kind: string }[];
  empty: string;
}) {
  return (
    <section>
      <h2 className="font-heading text-2xl">{title}</h2>
      {rows.length === 0 ? <p className="mt-3 text-sm text-[#5c5348]">{empty}</p> : null}
      <ul className="mt-3 grid gap-2">
        {rows.map((row) => (
          <li key={row.id} className="rounded-2xl border border-[#e0d4c2] bg-[#faf7f2] px-3 py-3 text-sm">
            <p className="text-xs tracking-wide text-[#8c4a2f] uppercase">{formatLong(row.when)} · {row.kind}</p>
            <p className="mt-1 font-medium">{row.who}</p>
            <p className="text-[#5c5348]">{row.where}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
