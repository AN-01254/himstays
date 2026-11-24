"use client";

import { useState } from "react";
import Link from "next/link";
import { getRoom } from "@/lib/catalog";
import { formatLong } from "@/lib/dates";
import { useLedger } from "@/lib/use-ledger";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function YourStays({ onDark = false }: { onDark?: boolean }) {
  const { bookings, ready, cancel, today } = useLedger();
  const [open, setOpen] = useState(false);
  const upcoming = bookings.filter((booking) => !today || booking.checkOut > today);
  const count = upcoming.length;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="sm"
            className={
              onDark
                ? "h-9 rounded-3xl bg-white/10 px-4 text-white hover:bg-white/20"
                : "h-9 rounded-3xl bg-black/4 px-4 text-ink hover:bg-black/8"
            }
          />
        }
      >
        Your stays{ready && count > 0 ? ` (${count})` : ""}
      </SheetTrigger>
      <SheetContent className="w-full bg-parchment sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-heading text-[30px] tracking-[-0.9px]">Your stays</SheetTitle>
          <SheetDescription>
            Saved on this browser. Cancelling one puts the nights back on the board.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-3 overflow-y-auto px-4 pb-6">
          {!ready ? <p className="text-sm text-graphite">Opening the ledger…</p> : null}
          {ready && bookings.length === 0 ? (
            <p className="text-[16px] leading-[1.49] text-graphite">
              No stays in your name yet. Turn a room model and take an open night.
            </p>
          ) : null}
          {bookings.map((booking) => {
            const found = getRoom(booking.propertySlug, booking.roomSlug);
            const past = today ? booking.checkOut <= today : false;
            return (
              <article key={booking.id} className="rounded-[18px] bg-warm-sand p-6 shadow-subtle">
                <p className="font-heading text-[23px] tracking-[-0.46px] text-sky-blue">{booking.id}</p>
                <h3 className="mt-1 text-[16px] text-ink">
                  {found ? found.property.name : booking.propertySlug}
                </h3>
                <p className="text-sm text-graphite">
                  {found ? found.room.name : booking.roomSlug} · {booking.guestName}
                </p>
                <p className="mt-2 text-sm">
                  {formatLong(booking.checkIn)} – {formatLong(booking.checkOut)}
                  {past ? " · past" : ""}
                </p>
                {past ? null : (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="mt-3"
                    onClick={() => cancel(booking.id)}
                  >
                    Cancel stay
                  </Button>
                )}
                {found ? (
                  <Link
                    href={`/stays/${booking.propertySlug}#${booking.roomSlug}`}
                    onClick={() => setOpen(false)}
                    className="mt-3 block text-sm text-sky-blue"
                  >
                    Open the room
                  </Link>
                ) : null}
              </article>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}
