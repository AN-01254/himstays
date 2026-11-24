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
    <div className="mx-auto w-full min-w-0 max-w-[1280px] px-5 py-16 sm:px-8 sm:py-24">
      <p className="text-[14px] tracking-[-0.56px] text-graphite">Lodge desk</p>
      <div className="mt-4 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-heading text-[clamp(40px,5vw,60px)] leading-[0.96] tracking-[-0.04em] text-ink">Occupancy</h1>
          <p className="mt-5 max-w-2xl text-[18px] leading-[1.33] tracking-[-0.18px]">
            Every room HimStays holds a key for, night by night. A filled mark is spoken for. Tap an open
            night to hold it for the house. Tap that hold to put the key back.
          </p>
        </div>
        <label className="grid gap-1.5 text-sm">
          <span className="text-[14px] tracking-[-0.56px] text-graphite">Hold new nights as</span>
          <select
            value={reason}
            onChange={(event) => setReason(event.target.value as (typeof reasons)[number])}
            className="h-[52px] rounded-xl border border-black/10 bg-black/[0.03] px-[15px] text-[15px]"
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
        <p className="mt-6 text-[15px] text-evergreen" role="status">
          {message}
        </p>
      ) : null}

      <div className="mt-8">
        <h2 className="font-heading text-[36px] leading-[1.1] tracking-[-0.5px]">Keys tonight</h2>
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
              <li key={`${property.slug}-${room.slug}`} className="rounded-xl bg-[#f7f7f0] p-5 shadow-card">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[12px] tracking-[-0.48px] text-graphite">{property.town}</p>
                    <h3 className="mt-1 font-heading text-[23px] tracking-[-0.46px]">{room.name}</h3>
                    <p className="text-[14px] text-graphite">{property.name}</p>
                  </div>
                  <span className={out ? "mt-1 size-3 rounded-full bg-ink" : "mt-1 size-3 rounded-full bg-sky-blue"} />
                </div>
                <p className="mt-4 text-[15px]">{line}</p>
                <Link
                  href={`/stays/${property.slug}#${room.slug}`}
                  className="mt-3 inline-block text-[15px] text-sky-blue"
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
          <h2 className="font-heading text-[36px] leading-[1.1] tracking-[-0.5px]">The next {HOST_HORIZON} nights</h2>
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
              <section key={property.slug} className="rounded-[18px] bg-warm-sand p-6 shadow-subtle sm:p-9">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div>
                    <h3 className="font-heading text-[30px] leading-[1.14] tracking-[-0.9px]">{property.name}</h3>
                    <p className="text-[14px] text-graphite">
                      {property.host} · {property.town}
                    </p>
                  </div>
                  <p className="text-[15px]">
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
                          <p className="text-[15px]">{room.name}</p>
                          <p className="text-[12px] tracking-[-0.48px] text-graphite">
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
                          <div className="h-14 animate-pulse rounded-xl bg-driftwood" />
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
          <h2 className="font-heading text-[36px] leading-[1.1] tracking-[-0.5px]">Stays from this browser</h2>
          <ul className="mt-3 grid gap-3">
            {bookings.map((booking) => {
              const found = getRoom(booking.propertySlug, booking.roomSlug);
              return (
                <li key={booking.id} className="flex flex-col gap-3 rounded-xl bg-[#f7f7f0] px-5 py-4 shadow-card sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-heading text-[23px] tracking-[-0.46px] text-sky-blue">{booking.id}</p>
                    <p className="text-sm">
                      {booking.guestName}
                      {booking.phone ? ` · ${booking.phone}` : ""} · {found ? `${found.property.name}, ${found.room.name}` : booking.roomSlug}
                    </p>
                    <p className="text-[14px] text-graphite">
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
    <div className="rounded-[18px] bg-warm-sand px-6 py-8 text-ink shadow-subtle">
      <p className="text-[12px] tracking-[-0.48px] text-graphite">{label}</p>
      <p className="font-heading mt-3 text-[48px] leading-none tracking-[-1.3px]">{value}</p>
      <p className="mt-3 text-[14px] leading-[1.5] tracking-[-0.56px] text-graphite">{detail}</p>
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
      <h2 className="font-heading text-[36px] leading-[1.1] tracking-[-0.5px]">{title}</h2>
      {rows.length === 0 ? <p className="mt-4 text-[15px] text-graphite">{empty}</p> : null}
      <ul className="mt-4 grid gap-3">
        {rows.map((row) => (
          <li key={row.id} className="rounded-xl bg-[#f7f7f0] px-4 py-4 text-[15px] shadow-card">
            <p className="text-[12px] tracking-[-0.48px] text-graphite">{formatLong(row.when)} · {row.kind}</p>
            <p className="mt-1">{row.who}</p>
            <p className="text-graphite">{row.where}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
