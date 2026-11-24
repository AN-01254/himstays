"use client";

import { useCallback, useSyncExternalStore } from "react";
import { nightStatus, validateStay } from "@/lib/availability";
import { todayInKolkata } from "@/lib/dates";
import { createReference, LEDGER_EVENT, ledgerStamp, readLedger, writeLedger } from "@/lib/ledger";
import type { GuestBooking, HostBlock, StayDraft } from "@/lib/types";

type Snapshot = {
  today: string;
  bookings: GuestBooking[];
  blocks: HostBlock[];
  ready: boolean;
};

const serverSnapshot: Snapshot = { today: "", bookings: [], blocks: [], ready: false };
let cachedStamp = "";
let cachedSnapshot: Snapshot = serverSnapshot;

function subscribe(onStoreChange: () => void) {
  window.addEventListener(LEDGER_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(LEDGER_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function getSnapshot(): Snapshot {
  const today = todayInKolkata();
  const stamp = `${today}\n${ledgerStamp()}`;
  if (stamp === cachedStamp) return cachedSnapshot;
  const ledger = readLedger();
  cachedSnapshot = { today, bookings: ledger.bookings, blocks: ledger.blocks, ready: true };
  cachedStamp = stamp;
  return cachedSnapshot;
}

export function useLedger() {
  const { today, bookings, blocks, ready } = useSyncExternalStore(subscribe, getSnapshot, () => serverSnapshot);

  const book = useCallback((draft: StayDraft) => {
    const currentToday = todayInKolkata();
    const current = readLedger();
    const check = validateStay(draft, currentToday, current.bookings, current.blocks);
    if (!check.ok) return check;
    if (current.bookings.length >= 40) {
      return { ok: false as const, error: "This browser already holds 40 stays. Cancel one to add another." };
    }
    const booking: GuestBooking = {
      id: createReference(),
      propertySlug: draft.propertySlug,
      roomSlug: draft.roomSlug,
      guestName: draft.guestName.trim(),
      phone: draft.phone.trim(),
      guests: draft.guests,
      checkIn: draft.checkIn,
      checkOut: draft.checkOut,
      note: draft.note.trim(),
      createdAt: new Date().toISOString(),
    };
    writeLedger([booking, ...current.bookings], current.blocks);
    return { ok: true as const, booking };
  }, []);

  const cancel = useCallback((id: string) => {
    const current = readLedger();
    writeLedger(
      current.bookings.filter((booking) => booking.id !== id),
      current.blocks,
    );
  }, []);

  const holdNight = useCallback((propertySlug: string, roomSlug: string, date: string, reason: string) => {
    const currentToday = todayInKolkata();
    const current = readLedger();
    const status = nightStatus(propertySlug, roomSlug, date, currentToday, current.bookings, current.blocks);
    if (status !== "open") return { ok: false as const, error: "That night is not open to hold." };
    if (date < currentToday) return { ok: false as const, error: "Past nights stay as they were." };
    const cleanReason = reason.trim().slice(0, 40) || "Host stay";
    const block: HostBlock = {
      id: `hold-${propertySlug}-${roomSlug}-${date}`,
      propertySlug,
      roomSlug,
      date,
      reason: cleanReason,
    };
    writeLedger(current.bookings, [block, ...current.blocks.filter((item) => item.id !== block.id)].slice(0, 200));
    return { ok: true as const };
  }, []);

  const releaseNight = useCallback((propertySlug: string, roomSlug: string, date: string) => {
    const current = readLedger();
    writeLedger(
      current.bookings,
      current.blocks.filter(
        (block) =>
          !(block.propertySlug === propertySlug && block.roomSlug === roomSlug && block.date === date),
      ),
    );
  }, []);

  return { today, bookings, blocks, ready, book, cancel, holdNight, releaseNight };
}
