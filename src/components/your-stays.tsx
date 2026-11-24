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

export function YourStays() {
  const { bookings, ready, cancel, today } = useLedger();
  const [open, setOpen] = useState(false);
  const upcoming = bookings.filter((booking) => !today || booking.checkOut > today);
  const count = upcoming.length;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={<Button variant="outline" size="sm" className="h-8" />}
      >
        Your stays{ready && count > 0 ? ` (${count})` : ""}
      </SheetTrigger>
      <SheetContent className="w-full bg-[#faf7f2] sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-heading text-2xl">Your stays</SheetTitle>
          <SheetDescription>
            Saved on this browser. Cancelling one puts the nights back on the board.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-3 overflow-y-auto px-4 pb-6">
          {!ready ? <p className="text-sm text-[#5c5348]">Opening the ledger…</p> : null}
          {ready && bookings.length === 0 ? (
            <p className="text-sm leading-6 text-[#5c5348]">
              No stays in your name yet. Turn a room model and take an open night.
            </p>
          ) : null}
          {bookings.map((booking) => {
            const found = getRoom(booking.propertySlug, booking.roomSlug);
            const past = today ? booking.checkOut <= today : false;
            return (
              <article key={booking.id} className="rounded-2xl border border-[#e0d4c2] bg-[#f3eee4] p-4">
                <p className="font-heading text-lg tracking-[0.14em]">{booking.id}</p>
                <h3 className="mt-1 font-medium text-[#1c1914]">
                  {found ? found.property.name : booking.propertySlug}
                </h3>
                <p className="text-sm text-[#5c5348]">
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
                    className="mt-3 block text-sm text-[#1e3a32] underline underline-offset-4"
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
