import { getRoom, roomKey } from "@/lib/catalog";
import { addDays, daysBetween, eachNight, weekdayIndex } from "@/lib/dates";
import type {
  GuestBooking,
  HostBlock,
  NightStatus,
  SampleStay,
  StayDraft,
} from "@/lib/types";

export const GUEST_HORIZON = 18;
export const HOST_HORIZON = 14;

const SAMPLE_GUESTS = [
  "Aarav Mehta",
  "Ishita Rao",
  "Kabir Anand",
  "Leah Joseph",
  "Nimrat Kaur",
  "Omar Farooq",
  "Priya Nair",
  "Raghav Sethi",
  "Sana Qureshi",
  "Tara Bhattacharya",
  "Vikrant Paul",
  "Zoya Khan",
];

export function hashString(value: string): number {
  let hash = 2_166_136_261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 1_677_761_9);
  }
  return hash >>> 0;
}

export function sampleRate(key: string): number {
  return 38 + (hashString(key) % 31);
}

export function heldOpenOffsets(key: string): { start: number; length: number } {
  return { start: hashString(`${key}|open`) % 8, length: 4 };
}

export function isHeldOpen(key: string, iso: string, today: string): boolean {
  const offset = daysBetween(today, iso);
  const { start, length } = heldOpenOffsets(key);
  return offset >= start && offset < start + length;
}

export function sampleWants(key: string, iso: string, today: string): boolean {
  if (iso >= today && isHeldOpen(key, iso, today)) return false;
  return hashString(`${key}|${iso}`) % 100 < sampleRate(key);
}

export function nightPrice(base: number, iso: string): number {
  const weekday = weekdayIndex(iso);
  if (weekday === 5 || weekday === 6) return Math.round(base * 1.12);
  return base;
}

export function quote(
  base: number,
  checkIn: string,
  checkOut: string,
): { nights: { iso: string; amount: number }[]; total: number; weekendNights: number } {
  const nights = eachNight(checkIn, checkOut).map((iso) => ({
    iso,
    amount: nightPrice(base, iso),
  }));
  const total = nights.reduce((sum, night) => sum + night.amount, 0);
  const weekendNights = nights.filter((night) => night.amount !== base).length;
  return { nights, total, weekendNights };
}

function covers(booking: GuestBooking, propertySlug: string, roomSlug: string, iso: string): boolean {
  return (
    booking.propertySlug === propertySlug &&
    booking.roomSlug === roomSlug &&
    iso >= booking.checkIn &&
    iso < booking.checkOut
  );
}

export function nightStatus(
  propertySlug: string,
  roomSlug: string,
  iso: string,
  today: string,
  bookings: GuestBooking[],
  blocks: HostBlock[],
): NightStatus {
  if (
    blocks.some(
      (block) =>
        block.propertySlug === propertySlug &&
        block.roomSlug === roomSlug &&
        block.date === iso,
    )
  ) {
    return "blocked";
  }
  if (bookings.some((booking) => covers(booking, propertySlug, roomSlug, iso))) {
    return "yours";
  }
  if (sampleWants(roomKey(propertySlug, roomSlug), iso, today)) return "sample";
  return "open";
}

export function statusLabel(status: NightStatus): string {
  if (status === "open") return "Open";
  if (status === "sample") return "Guest stay";
  if (status === "yours") return "Your stay";
  return "House hold";
}

export function moodFor(status: NightStatus): "open" | "held" | "blocked" {
  if (status === "blocked") return "blocked";
  if (status === "open") return "open";
  return "held";
}

export type StayCheck =
  | { ok: true }
  | { ok: false; error: string };

export function validateStay(
  draft: StayDraft,
  today: string,
  bookings: GuestBooking[],
  blocks: HostBlock[],
): StayCheck {
  const found = getRoom(draft.propertySlug, draft.roomSlug);
  if (!found) return { ok: false, error: "That room is not on the desk." };

  const name = draft.guestName.trim();
  if (name.length < 2) return { ok: false, error: "Add the name that should be on the stay." };
  if (name.length > 80) return { ok: false, error: "That name is too long to put on the key." };

  const phone = draft.phone.trim();
  if (phone && !/^[0-9+\s-]{8,18}$/.test(phone)) {
    return { ok: false, error: "That phone number does not look right." };
  }

  if (draft.note.trim().length > 280) {
    return { ok: false, error: "Keep the note to a few lines. The host reads it on the key." };
  }

  if (!Number.isInteger(draft.guests) || draft.guests < 1 || draft.guests > found.room.capacity) {
    return {
      ok: false,
      error: `This room sleeps ${found.room.capacity}.`,
    };
  }

  if (draft.checkIn < today) return { ok: false, error: "Arrival has to be today or later." };

  const nights = eachNight(draft.checkIn, draft.checkOut);
  if (nights.length === 0) {
    return { ok: false, error: "Pick a night to arrive, and a later morning to leave." };
  }
  if (nights.length > 14) return { ok: false, error: "HimStays holds a room for up to 14 nights." };

  const taken = nights.filter(
    (iso) => nightStatus(draft.propertySlug, draft.roomSlug, iso, today, bookings, blocks) !== "open",
  );
  if (taken.length > 0) {
    const count = taken.length;
    return {
      ok: false,
      error:
        count === 1
          ? "One of these nights is already spoken for."
          : `${count} of these nights are already spoken for.`,
    };
  }

  return { ok: true };
}

export function nextOpenNight(
  propertySlug: string,
  roomSlug: string,
  today: string,
  bookings: GuestBooking[],
  blocks: HostBlock[],
  horizon = GUEST_HORIZON,
): string | null {
  for (let offset = 0; offset < horizon; offset += 1) {
    const iso = addDays(today, offset);
    if (nightStatus(propertySlug, roomSlug, iso, today, bookings, blocks) === "open") return iso;
  }
  return null;
}

export function countNights(
  propertySlug: string,
  roomSlug: string,
  today: string,
  bookings: GuestBooking[],
  blocks: HostBlock[],
  horizon: number,
): { open: number; taken: number } {
  let open = 0;
  let taken = 0;
  for (let offset = 0; offset < horizon; offset += 1) {
    const status = nightStatus(
      propertySlug,
      roomSlug,
      addDays(today, offset),
      today,
      bookings,
      blocks,
    );
    if (status === "open") open += 1;
    else taken += 1;
  }
  return { open, taken };
}

export function sampleStaysForRoom(
  propertySlug: string,
  roomSlug: string,
  today: string,
  capacity: number,
): SampleStay[] {
  const key = roomKey(propertySlug, roomSlug);
  const stays: SampleStay[] = [];
  let cursor = addDays(today, -8);
  const end = addDays(today, GUEST_HORIZON);
  while (cursor < end) {
    if (sampleWants(key, cursor, today)) {
      const checkIn = cursor;
      let next = addDays(cursor, 1);
      while (next < end && sampleWants(key, next, today)) next = addDays(next, 1);
      const id = `sample-${key}-${checkIn}`;
      stays.push({
        id,
        propertySlug,
        roomSlug,
        guestName: SAMPLE_GUESTS[hashString(id) % SAMPLE_GUESTS.length] ?? "Guest",
        guests: 1 + (hashString(`${id}|g`) % Math.max(capacity, 1)),
        checkIn,
        checkOut: next,
      });
      cursor = next;
    } else {
      cursor = addDays(cursor, 1);
    }
  }
  return stays.filter((stay) => stay.checkOut > today && stay.checkIn < end);
}

export function bookingOnNight(
  bookings: GuestBooking[],
  propertySlug: string,
  roomSlug: string,
  iso: string,
): GuestBooking | undefined {
  return bookings.find((booking) => covers(booking, propertySlug, roomSlug, iso));
}
