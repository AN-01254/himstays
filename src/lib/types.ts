export type Valley = "Kullu" | "Shimla" | "Kangra" | "Parvati" | "Spiti" | "Bir";

export type WindowView = "valley" | "ridge" | "monastery" | "river" | "desert" | "meadow";

export type WallFinish = "cedar" | "stone" | "mud" | "lime";

export type BedSize = "king" | "queen" | "twin";

export type NightStatus = "open" | "sample" | "yours" | "blocked";

export type RoomNotes = {
  window: string;
  bed: string;
  stove: string;
};

export type Room = {
  slug: string;
  name: string;
  summary: string;
  price: number;
  capacity: number;
  bed: BedSize;
  wall: WallFinish;
  view: WindowView;
  fireplace: boolean;
  sizeSqm: number;
  amenities: string[];
  notes: RoomNotes;
};

export type Property = {
  slug: string;
  name: string;
  valley: Valley;
  town: string;
  elevationM: number;
  host: string;
  hostLine: string;
  summary: string;
  story: string;
  rules: string[];
  rooms: Room[];
};

export type GuestBooking = {
  id: string;
  propertySlug: string;
  roomSlug: string;
  guestName: string;
  phone: string;
  guests: number;
  checkIn: string;
  checkOut: string;
  note: string;
  createdAt: string;
};

export type HostBlock = {
  id: string;
  propertySlug: string;
  roomSlug: string;
  date: string;
  reason: string;
};

export type StayDraft = {
  propertySlug: string;
  roomSlug: string;
  guestName: string;
  phone: string;
  guests: number;
  checkIn: string;
  checkOut: string;
  note: string;
};

export type SampleStay = {
  id: string;
  propertySlug: string;
  roomSlug: string;
  guestName: string;
  guests: number;
  checkIn: string;
  checkOut: string;
};
