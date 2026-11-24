import { getRoom } from "@/lib/catalog";
import { isIsoDate } from "@/lib/dates";
import type { GuestBooking, HostBlock } from "@/lib/types";

export const LEDGER_EVENT = "himstays-ledger";
const BOOKINGS_KEY = "himstays.bookings.v1";
const BLOCKS_KEY = "himstays.blocks.v1";

function storage(): Storage | null {
  if (typeof window === "undefined") return null;
  return window.localStorage;
}

function isBooking(value: unknown): value is GuestBooking {
  if (!value || typeof value !== "object") return false;
  const booking = value as GuestBooking;
  return (
    typeof booking.id === "string" &&
    booking.id.length > 0 &&
    booking.id.length <= 40 &&
    typeof booking.propertySlug === "string" &&
    typeof booking.roomSlug === "string" &&
    getRoom(booking.propertySlug, booking.roomSlug) !== undefined &&
    typeof booking.guestName === "string" &&
    booking.guestName.trim().length >= 2 &&
    booking.guestName.length <= 80 &&
    typeof booking.phone === "string" &&
    booking.phone.length <= 18 &&
    typeof booking.guests === "number" &&
    Number.isInteger(booking.guests) &&
    booking.guests >= 1 &&
    booking.guests <= 8 &&
    typeof booking.checkIn === "string" &&
    isIsoDate(booking.checkIn) &&
    typeof booking.checkOut === "string" &&
    isIsoDate(booking.checkOut) &&
    booking.checkOut > booking.checkIn &&
    typeof booking.note === "string" &&
    booking.note.length <= 280 &&
    typeof booking.createdAt === "string" &&
    booking.createdAt.length <= 40
  );
}

function isBlock(value: unknown): value is HostBlock {
  if (!value || typeof value !== "object") return false;
  const block = value as HostBlock;
  return (
    typeof block.id === "string" &&
    block.id.length > 0 &&
    block.id.length <= 80 &&
    typeof block.propertySlug === "string" &&
    typeof block.roomSlug === "string" &&
    getRoom(block.propertySlug, block.roomSlug) !== undefined &&
    typeof block.date === "string" &&
    isIsoDate(block.date) &&
    typeof block.reason === "string" &&
    block.reason.length > 0 &&
    block.reason.length <= 40
  );
}

function readList<T>(key: string, guard: (value: unknown) => value is T, limit: number): T[] {
  const store = storage();
  if (!store) return [];
  try {
    const raw = store.getItem(key);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(guard).slice(0, limit);
  } catch {
    return [];
  }
}

export function ledgerStamp(): string {
  const store = storage();
  if (!store) return "";
  return `${store.getItem(BOOKINGS_KEY) ?? ""}\n${store.getItem(BLOCKS_KEY) ?? ""}`;
}

export function readLedger(): { bookings: GuestBooking[]; blocks: HostBlock[] } {
  return {
    bookings: readList(BOOKINGS_KEY, isBooking, 40),
    blocks: readList(BLOCKS_KEY, isBlock, 200),
  };
}

export function writeLedger(bookings: GuestBooking[], blocks: HostBlock[]): void {
  const store = storage();
  if (!store) return;
  store.setItem(BOOKINGS_KEY, JSON.stringify(bookings.slice(0, 40)));
  store.setItem(BLOCKS_KEY, JSON.stringify(blocks.slice(0, 200)));
  window.dispatchEvent(new Event(LEDGER_EVENT));
}

export function createReference(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  let code = "HS-";
  for (const byte of bytes) code += alphabet[byte % alphabet.length];
  return code;
}
