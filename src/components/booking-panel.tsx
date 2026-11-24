"use client";

import { useState } from "react";
import Link from "next/link";
import { NightLegend, NightTrail } from "@/components/night-trail";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GUEST_HORIZON, nightStatus, quote } from "@/lib/availability";
import { bedLabel } from "@/lib/catalog";
import { addDays, eachNight, formatLong, inr } from "@/lib/dates";
import { useLedger } from "@/lib/use-ledger";
import type { GuestBooking, Property, Room } from "@/lib/types";

export function BookingPanel({
  property,
  room,
  today,
  ready,
  checkIn,
  checkOut,
  notice,
  onPick,
  onHover,
  onBooked,
}: {
  property: Property;
  room: Room;
  today: string;
  ready: boolean;
  checkIn: string | null;
  checkOut: string | null;
  notice: string | null;
  onPick: (iso: string) => void;
  onHover: (iso: string | null) => void;
  onBooked: (booking: GuestBooking) => void;
}) {
  const { bookings, blocks, book } = useLedger();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [guestCount, setGuestCount] = useState(1);
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<GuestBooking | null>(null);
  const guests = Math.min(Math.max(guestCount, 1), room.capacity);

  const days = ready
    ? Array.from({ length: GUEST_HORIZON }, (_, index) => {
        const iso = addDays(today, index);
        return {
          iso,
          status: nightStatus(property.slug, room.slug, iso, today, bookings, blocks),
        };
      })
    : [];

  const selectedNights = checkIn && checkOut ? eachNight(checkIn, checkOut) : [];
  const conflictCount =
    ready && today
      ? selectedNights.filter(
          (iso) => nightStatus(property.slug, room.slug, iso, today, bookings, blocks) !== "open",
        ).length
      : 0;
  const priced = checkIn && checkOut ? quote(room.price, checkIn, checkOut) : null;
  const nights = priced?.nights.length ?? 0;
  const groups = new Map<number, number>();
  for (const night of priced?.nights ?? []) {
    groups.set(night.amount, (groups.get(night.amount) ?? 0) + 1);
  }

  function submit() {
    if (!checkIn || !checkOut) {
      setError("Choose the nights you want to sleep here.");
      return;
    }
    const result = book({
      propertySlug: property.slug,
      roomSlug: room.slug,
      guestName: name,
      phone,
      guests,
      checkIn,
      checkOut,
      note,
    });
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setError(null);
    setPending(result.booking);
    onBooked(result.booking);
  }

  return (
    <section id="booking" className="min-w-0 rounded-[18px] bg-warm-sand p-6 shadow-subtle sm:p-9">
      <p className="text-[12px] tracking-[-0.48px] text-graphite">Take the night</p>
      <h2 className="font-heading mt-2 text-[36px] leading-[1.1] tracking-[-0.5px] text-ink">{room.name}</h2>
      <p className="mt-2 text-[14px] leading-[1.5] tracking-[-0.56px] text-graphite">
        {bedLabel(room.bed)}. Sleeps {room.capacity}. {room.sizeSqm} m². {inr(room.price)} on weeknights
      </p>
      <p className="mt-4 text-[16px] leading-[1.49] tracking-[-0.22px]">{room.summary}</p>

      <div className="mt-5">
        <div className="mb-2 flex items-baseline justify-between gap-3">
          <h3 className="text-[15px]">The next {GUEST_HORIZON} nights</h3>
          <p className="text-[12px] tracking-[-0.48px] text-graphite">Friday and Saturday are 12% more</p>
        </div>
        {ready ? (
          <NightTrail
            days={days}
            checkIn={checkIn}
            checkOut={checkOut}
            onPick={onPick}
            onHover={onHover}
          />
        ) : (
          <div className="h-16 animate-pulse rounded-xl bg-driftwood" />
        )}
        <div className="mt-3">
          <NightLegend />
        </div>
        <p className="mt-3 text-[15px] leading-[1.45] tracking-[-0.2px]">
          {checkIn && checkOut
            ? `Arrive ${formatLong(checkIn)}. Leave the morning of ${formatLong(checkOut)}. ${nights} ${nights === 1 ? "night" : "nights"}.`
            : "Tap an open night, then tap the last night you want to sleep. The hollow marks are free."}
        </p>
        {notice ? (
          <p className="mt-2 text-[15px] text-evergreen" role="status">
            {notice}
          </p>
        ) : null}
      </div>

      <form
        className="mt-5 flex flex-col gap-3"
        onSubmit={(event) => event.preventDefault()}
        onKeyDown={(event) => {
          if (event.key === "Enter" && event.target instanceof HTMLInputElement) {
            event.preventDefault();
            submit();
          }
        }}
      >
        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <div className="grid gap-1.5">
            <Label htmlFor="guest-name">Name on the stay</Label>
            <Input
              id="guest-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="name"
              maxLength={80}
              placeholder="The name for the key"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="guests">Guests</Label>
            <div className="flex h-[52px] items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Fewer guests"
                onClick={() => setGuestCount((current) => Math.max(1, current - 1))}
              >
                –
              </Button>
              <span className="w-6 text-center text-sm" aria-live="polite">
                {guests}
              </span>
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="More guests"
                onClick={() => setGuestCount((current) => Math.min(room.capacity, current + 1))}
              >
                +
              </Button>
            </div>
          </div>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="phone">Phone, if you want the host to have it</Label>
          <Input
            id="phone"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            autoComplete="tel"
            inputMode="tel"
            maxLength={18}
            placeholder="Optional"
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="note">Note for the house</Label>
          <Textarea
            id="note"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            maxLength={280}
            placeholder="A late jeep, a child, a quiet room."
          />
        </div>

        {priced && nights > 0 ? (
          <div className="rounded-xl bg-parchment px-4 py-4 text-[15px] shadow-subtle">
            {[...groups.entries()].map(([amount, count]) => (
              <p key={amount} className="flex justify-between gap-3">
                <span>
                  {inr(amount)} × {count} {count === 1 ? "night" : "nights"}
                  {amount !== room.price ? " · weekend" : ""}
                </span>
                <span>{inr(amount * count)}</span>
              </p>
            ))}
            <p className="mt-2 flex justify-between gap-3 border-t border-black/10 pt-2">
              <span>To the house</span>
              <span>{inr(priced.total)}</span>
            </p>
            <p className="mt-1 text-[12px] tracking-[-0.48px] text-graphite">Linen included. Anything else is settled on arrival.</p>
          </div>
        ) : null}

        {conflictCount > 0 ? (
          <p className="text-[15px] text-signal-orange" role="alert">
            {conflictCount === 1
              ? "One night in this stay is already spoken for. Shorten it, or try the other room."
              : `${conflictCount} nights in this stay are already spoken for. Shorten it, or try the other room.`}
          </p>
        ) : null}
        {error ? (
          <p className="text-[15px] text-signal-orange" role="alert">
            {error}
          </p>
        ) : null}

        <Button type="button" className="h-auto rounded-xl px-[14px] py-[14px]" disabled={!ready} onClick={submit}>
          {nights > 0 ? `Hold ${nights} ${nights === 1 ? "night" : "nights"}` : "Hold these nights"}
        </Button>
        <p className="text-[12px] leading-[1.5] tracking-[-0.48px] text-graphite">
          The confirmation stays on this browser, and the occupancy desk on this device moves with it. Sample
          guests already on the board are part of the lodge, not people you can message.
        </p>
      </form>

      <Dialog open={pending !== null} onOpenChange={(open) => !open && setPending(null)}>
        <DialogContent className="bg-parchment shadow-card sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading text-[30px] tracking-[-0.9px]">The room is in your name</DialogTitle>
            <DialogDescription>
              {pending
                ? `${pending.guestName} · ${room.name} at ${property.name}`
                : "Your stay is on the ledger."}
            </DialogDescription>
          </DialogHeader>
          {pending ? (
            <div className="grid gap-2 text-sm">
              <p className="font-heading text-[36px] leading-none tracking-[-0.5px] text-sky-blue">{pending.id}</p>
              <p>
                {formatLong(pending.checkIn)} to the morning of {formatLong(pending.checkOut)}
              </p>
              <p>
                {pending.guests} {pending.guests === 1 ? "guest" : "guests"} · {eachNight(pending.checkIn, pending.checkOut).length} nights ·{" "}
                {inr(quote(room.price, pending.checkIn, pending.checkOut).total)}
              </p>
              <p className="text-graphite">
                Show this reference to {property.host}. It lives in Your stays on this browser.
              </p>
            </div>
          ) : null}
          <DialogFooter className="bg-transparent">
            <Button variant="outline" nativeButton={false} render={<Link href="/host" />}>
              See occupancy
            </Button>
            <Button type="button" onClick={() => setPending(null)}>
              Stay on this room
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
