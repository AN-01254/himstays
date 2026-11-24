import assert from "node:assert/strict";
import test from "node:test";
import {
  heldOpenOffsets,
  isHeldOpen,
  nightPrice,
  nightStatus,
  quote,
  sampleWants,
  validateStay,
} from "./availability";
import { addDays, eachNight, weekdayIndex } from "./dates";
import type { GuestBooking, HostBlock } from "./types";

const today = "2026-11-24";
const key = "deodar-house/cedar-suite";

test("each night is the stay, not the morning you leave", () => {
  assert.deepEqual(eachNight("2026-11-24", "2026-11-27"), [
    "2026-11-24",
    "2026-11-25",
    "2026-11-26",
  ]);
  assert.deepEqual(eachNight("2026-11-27", "2026-11-27"), []);
});

test("every room keeps four open nights in a row", () => {
  const { start, length } = heldOpenOffsets(key);
  const open: number[] = [];
  for (let offset = 0; offset < 21; offset += 1) {
    if (isHeldOpen(key, addDays(today, offset), today)) open.push(offset);
  }
  assert.equal(open.length, length);
  assert.deepEqual(open, Array.from({ length }, (_, index) => start + index));
  for (const offset of open) {
    assert.equal(sampleWants(key, addDays(today, offset), today), false);
    assert.equal(nightStatus("deodar-house", "cedar-suite", addDays(today, offset), today, [], []), "open");
  }
});

test("a house hold beats a sample guest, and your stay beats both", () => {
  let taken = "";
  for (let offset = 0; offset < 40; offset += 1) {
    const iso = addDays(today, offset);
    if (!isHeldOpen(key, iso, today) && sampleWants(key, iso, today)) {
      taken = iso;
      break;
    }
  }
  assert.notEqual(taken, "");
  assert.equal(nightStatus("deodar-house", "cedar-suite", taken, today, [], []), "sample");

  const block: HostBlock = {
    id: "hold-1",
    propertySlug: "deodar-house",
    roomSlug: "cedar-suite",
    date: taken,
    reason: "Maintenance",
  };
  assert.equal(nightStatus("deodar-house", "cedar-suite", taken, today, [], [block]), "blocked");

  const booking: GuestBooking = {
    id: "HS-TEST",
    propertySlug: "deodar-house",
    roomSlug: "cedar-suite",
    guestName: "Anika Sharma",
    phone: "",
    guests: 2,
    checkIn: taken,
    checkOut: addDays(taken, 1),
    note: "",
    createdAt: "2026-11-24T00:00:00.000Z",
  };
  assert.equal(nightStatus("deodar-house", "cedar-suite", taken, today, [booking], []), "yours");
});

test("friday and saturday nights carry the weekend rate", () => {
  let friday = today;
  while (weekdayIndex(friday) !== 5) friday = addDays(friday, 1);
  assert.equal(nightPrice(1000, friday), 1120);
  assert.equal(nightPrice(1000, addDays(friday, 1)), 1120);
  assert.equal(nightPrice(1000, addDays(friday, 2)), 1000);
  const priced = quote(1000, friday, addDays(friday, 3));
  assert.equal(priced.total, 3240);
  assert.equal(priced.weekendNights, 2);
});

test("a stay on the open window is accepted, and a taken night is refused", () => {
  const { start } = heldOpenOffsets(key);
  const checkIn = addDays(today, start);
  const result = validateStay(
    {
      propertySlug: "deodar-house",
      roomSlug: "cedar-suite",
      guestName: "Anika Sharma",
      phone: "9812345678",
      guests: 2,
      checkIn,
      checkOut: addDays(checkIn, 2),
      note: "Arriving after the evening bus.",
    },
    today,
    [],
    [],
  );
  assert.equal(result.ok, true);

  const blocked = validateStay(
    {
      propertySlug: "deodar-house",
      roomSlug: "cedar-suite",
      guestName: "A",
      phone: "12",
      guests: 9,
      checkIn,
      checkOut: checkIn,
      note: "",
    },
    today,
    [],
    [],
  );
  assert.equal(blocked.ok, false);
});
