import type { BedSize, Property, Room, WallFinish, WindowView } from "@/lib/types";

const sharedRules = [
  "Check-in from 1 pm. Check-out by 11 am.",
  "Shoes come off on the timber.",
  "The lane is quiet after 10 pm.",
];

function room(
  input: Omit<Room, "notes"> & { notes: Room["notes"] },
): Room {
  return input;
}

export const properties: Property[] = [
  {
    slug: "deodar-house",
    name: "Deodar House",
    valley: "Kullu",
    town: "Old Manali",
    elevationM: 1850,
    host: "Anuja Negi",
    hostLine: "Anuja keeps the orchard lane and both keys.",
    summary: "Cedar and a river loft above the Beas, where the lane narrows into apple trees.",
    story:
      "Anuja's family orchard starts where the lane narrows above Old Manali. The cedar suite faces the valley; the loft faces the water. Breakfast is apples in season and a thick omelette the rest of the year.",
    rules: [...sharedRules, "The orchard dogs bark at jeeps. They settle."],
    rooms: [
      room({
        slug: "cedar-suite",
        name: "Cedar suite",
        summary: "A king bed, a bukhari, and the long window onto the valley.",
        price: 7800,
        capacity: 3,
        bed: "king",
        wall: "cedar",
        view: "valley",
        fireplace: true,
        sizeSqm: 28,
        amenities: ["King bed", "Bukhari", "Wool throws", "Kettle", "Valley-facing window"],
        notes: {
          window: "The north window looks down the Beas valley. On a clear afternoon the snow line sits on the far ridge.",
          bed: "A king in cedar. It sleeps two, or two and a child on the daybed rolled out from under it.",
          stove: "Anuja lights the bukhari when the valley goes blue. Guests do not feed it.",
        },
      }),
      room({
        slug: "river-loft",
        name: "River loft",
        summary: "A queen under the eaves, closer to the sound of the Beas.",
        price: 5400,
        capacity: 2,
        bed: "queen",
        wall: "lime",
        view: "river",
        fireplace: true,
        sizeSqm: 18,
        amenities: ["Queen bed", "Bukhari", "Reading lamp", "Kettle", "River window"],
        notes: {
          window: "The loft window is low and close to the river. You hear the water before you see it.",
          bed: "A queen tucked under the slope of the roof. Fine for two, not for a third.",
          stove: "A small bukhari in the corner. It takes the chill off the timber by dusk.",
        },
      }),
    ],
  },
  {
    slug: "ridge-kettle",
    name: "Ridge & Kettle",
    valley: "Shimla",
    town: "The Ridge, Shimla",
    elevationM: 2205,
    host: "Vikram Chauhan",
    hostLine: "Vikram runs the kettle and the two rooms off the mall.",
    summary: "Two quiet rooms just off the Ridge, with the mall a short walk when the mist lifts.",
    story:
      "The house sits one lane below the Ridge, in a row that still has its old shutters. Vikram's kettle is always on. The rooms are small on purpose — Shimla rooms usually are — and the glass looks along the ridge rather than into the next balcony.",
    rules: [...sharedRules, "The mall is steep. Ask Vikram for the shorter steps in rain."],
    rooms: [
      room({
        slug: "ridge-room",
        name: "Ridge room",
        summary: "Lime walls, a queen, and the ridge in the window.",
        price: 6400,
        capacity: 2,
        bed: "queen",
        wall: "lime",
        view: "ridge",
        fireplace: true,
        sizeSqm: 20,
        amenities: ["Queen bed", "Bukhari", "Writing table", "Kettle", "Ridge window"],
        notes: {
          window: "The window looks along the Shimla ridge. Christ Church is a pale shape when the cloud is thin.",
          bed: "A queen against the inner wall, away from the cold glass.",
          stove: "The bukhari is the old house one, blacked and small, with a kettle that actually gets used.",
        },
      }),
      room({
        slug: "mall-twin",
        name: "Mall twin",
        summary: "Two twins in the stone room, for friends who want their own blankets.",
        price: 4800,
        capacity: 2,
        bed: "twin",
        wall: "stone",
        view: "ridge",
        fireplace: false,
        sizeSqm: 16,
        amenities: ["Two twin beds", "Shared stove downstairs", "Wool blankets", "Kettle"],
        notes: {
          window: "A narrower ridge window. You still get the evening light, just less of the mall.",
          bed: "Two twins, each with its own blanket. The room is for two friends, not a family.",
          stove: "No stove in the room. Heat comes up from the bukhari in Vikram's sitting room.",
        },
      }),
    ],
  },
  {
    slug: "bellview",
    name: "Bellview Cottage",
    valley: "Kangra",
    town: "McLeod Ganj",
    elevationM: 1780,
    host: "Tenzin Dolma",
    hostLine: "Tenzin keeps the cottage above the temple road.",
    summary: "A cedar cottage above the temple road, with the monastery horns in the morning.",
    story:
      "Bellview is a short climb above the temple road. Tenzin runs it as a quiet house: two rooms, a shared kettle, and a window that frames the ridge rather than the market. The horns start early. That is the point of staying here.",
    rules: [...sharedRules, "The monastery horns start early. The cottage does not sleep through them."],
    rooms: [
      room({
        slug: "prayer-window",
        name: "Prayer window",
        summary: "The cedar room with the long view toward the monastery ridge.",
        price: 5200,
        capacity: 2,
        bed: "queen",
        wall: "cedar",
        view: "monastery",
        fireplace: true,
        sizeSqm: 22,
        amenities: ["Queen bed", "Bukhari", "Window seat", "Kettle", "Wool throws"],
        notes: {
          window: "Prayer flags and the ridge above McLeod Ganj. You hear the horns before you see the monastery.",
          bed: "A queen facing the window, so the morning light arrives on the linen.",
          stove: "Tenzin lights the bukhari on request once the cloud drops down the ridge.",
        },
      }),
      room({
        slug: "dormer",
        name: "Dormer",
        summary: "Two twins under the dormer, simpler and a little cooler.",
        price: 4100,
        capacity: 2,
        bed: "twin",
        wall: "lime",
        view: "monastery",
        fireplace: false,
        sizeSqm: 15,
        amenities: ["Two twin beds", "Dormer window", "Shared kettle", "Wool blankets"],
        notes: {
          window: "The dormer cuts the same ridge into a smaller frame. Flags still cross it when the wind is up.",
          bed: "Two twins under the slope. Sit up slowly on the window side.",
          stove: "No stove of its own. Extra blankets live in the chest, and the house stove is downstairs.",
        },
      }),
    ],
  },
  {
    slug: "parvati-glass",
    name: "Glass on the Parvati",
    valley: "Parvati",
    town: "Kasol",
    elevationM: 1640,
    host: "Mehar Singh",
    hostLine: "Mehar built the glass room and still splits the wood.",
    summary: "A glass cabin and an orchard room on the river path out of Kasol.",
    story:
      "Mehar's place is downstream of the village, where the path turns back to the water. The glass room is one wall of window. The orchard room is quieter, set into the apple trees behind. Both hear the river. In this season it is a steady sound, not a flood.",
    rules: [...sharedRules, "The path to the house is unlit. Mehar leaves a lamp at the gate."],
    rooms: [
      room({
        slug: "river-glass",
        name: "River glass",
        summary: "One glass wall, a king bed, and the Parvati in the foreground.",
        price: 8600,
        capacity: 2,
        bed: "king",
        wall: "lime",
        view: "river",
        fireplace: true,
        sizeSqm: 26,
        amenities: ["King bed", "Glass wall", "Bukhari", "Daybed", "Kettle"],
        notes: {
          window: "Almost a whole wall of glass toward the Parvati. At night it becomes a dark mirror until Mehar kills the lamp.",
          bed: "A king set back from the glass so the morning sun hits the foot, not your face.",
          stove: "The bukhari sits off to the side so it does not fog the glass. Mehar lights it after dusk.",
        },
      }),
      room({
        slug: "orchard-room",
        name: "Orchard room",
        summary: "Cedar walls and a queen, one row of trees back from the water.",
        price: 5900,
        capacity: 3,
        bed: "queen",
        wall: "cedar",
        view: "valley",
        fireplace: true,
        sizeSqm: 21,
        amenities: ["Queen bed", "Extra cot", "Bukhari", "Orchard window", "Kettle"],
        notes: {
          window: "Apple trees first, then the valley. The river is a sound here, not a view.",
          bed: "A queen, plus a cot Mehar pulls out for a third person. Say so when you book.",
          stove: "A bukhari against the orchard wall. The room holds heat well once it is going.",
        },
      }),
    ],
  },
  {
    slug: "mud-sky",
    name: "Mud & Sky",
    valley: "Spiti",
    town: "Kaza",
    elevationM: 3800,
    host: "Lobzang Angmo",
    hostLine: "Lobzang runs the mud house with her brother, who drives the valley jeep.",
    summary: "A mud house in Kaza. Thick walls, a serious stove, and Spiti light.",
    story:
      "At 3,800 metres the night is the main fact of the room. Lobzang's house is mud and timber, two rooms off a courtyard, both with stoves. Water is heated, showers are short, and the sky does the decorating. The jeep from Kaza town takes ten minutes.",
    rules: [...sharedRules, "Water is heated on the stove. Showers are short, and worth it."],
    rooms: [
      room({
        slug: "sun-room",
        name: "Sun room",
        summary: "The brighter mud room, with a queen and a stove that earns its keep.",
        price: 5600,
        capacity: 2,
        bed: "queen",
        wall: "mud",
        view: "desert",
        fireplace: true,
        sizeSqm: 19,
        amenities: ["Queen bed", "Bukhari", "Thick quilts", "Hot water by the stove", "Courtyard door"],
        notes: {
          window: "Spiti light. Ochre land, a hard blue sky, and mountains that look close enough to touch.",
          bed: "A queen piled with quilts. You will use all of them.",
          stove: "This bukhari is not decoration. Lobzang lights it before dinner and banks it at night.",
        },
      }),
      room({
        slug: "courtyard",
        name: "Courtyard",
        summary: "Two twins off the courtyard, same mud walls, same serious stove.",
        price: 4400,
        capacity: 2,
        bed: "twin",
        wall: "mud",
        view: "desert",
        fireplace: true,
        sizeSqm: 17,
        amenities: ["Two twin beds", "Bukhari", "Thick quilts", "Courtyard window"],
        notes: {
          window: "The courtyard window. You see the prayer flags and the lane, then the same bare hills.",
          bed: "Two twins. In this cold, each has its own quilt stack.",
          stove: "A second bukhari, smaller than the sun room's, lit on the same evening round.",
        },
      }),
    ],
  },
  {
    slug: "pine-perch",
    name: "Pine Perch",
    valley: "Bir",
    town: "Bir",
    elevationM: 1525,
    host: "Kabir Katoch",
    hostLine: "Kabir keeps the perch above the landing meadow.",
    summary: "A pine house above the landing meadow, for the morning the paragliders go up.",
    story:
      "Pine Perch looks over the meadow where the wings come down. Kabir's family has the upper house: a loft for two, and a twin room at the landing side. Cows use the path in the afternoon. Flyable mornings are the ones people come for, and the other mornings are quieter and just as good.",
    rules: [...sharedRules, "The meadow path is shared with cows. Give them the outside line."],
    rooms: [
      room({
        slug: "meadow-loft",
        name: "Meadow loft",
        summary: "A queen in the pine loft, with the landing meadow in the window.",
        price: 5700,
        capacity: 2,
        bed: "queen",
        wall: "cedar",
        view: "meadow",
        fireplace: true,
        sizeSqm: 20,
        amenities: ["Queen bed", "Bukhari", "Loft window", "Kettle", "Wool throws"],
        notes: {
          window: "The landing meadow at Bir. On flyable mornings the paragliders drift across this glass.",
          bed: "A queen in the loft. The ceiling slopes on the meadow side.",
          stove: "A bukhari at the top of the stair. Kabir lights it if the cloud sits on the meadow.",
        },
      }),
      room({
        slug: "landing-twin",
        name: "Landing twin",
        summary: "Two twins at meadow level, without a stove of their own.",
        price: 4300,
        capacity: 2,
        bed: "twin",
        wall: "lime",
        view: "meadow",
        fireplace: false,
        sizeSqm: 16,
        amenities: ["Two twin beds", "Meadow window", "Extra blankets", "Kettle"],
        notes: {
          window: "Meadow level. You see the landings from the pillow, which is either perfect or distracting.",
          bed: "Two twins, side by side, for two people who want their own blankets.",
          stove: "No stove in the room. The loft bukhari heats the stair, and there are extra blankets in the box.",
        },
      }),
    ],
  },
];

export function roomKey(propertySlug: string, roomSlug: string): string {
  return `${propertySlug}/${roomSlug}`;
}

export function getProperty(slug: string): Property | undefined {
  return properties.find((property) => property.slug === slug);
}

export function getRoom(
  propertySlug: string,
  roomSlug: string,
): { property: Property; room: Room } | undefined {
  const property = getProperty(propertySlug);
  const found = property?.rooms.find((item) => item.slug === roomSlug);
  if (!property || !found) return undefined;
  return { property, room: found };
}

export function allRooms(): { property: Property; room: Room }[] {
  return properties.flatMap((property) => property.rooms.map((room) => ({ property, room })));
}

export function bedLabel(bed: BedSize): string {
  if (bed === "twin") return "Two twin beds";
  if (bed === "king") return "King bed";
  return "Queen bed";
}

export function wallLabel(wall: WallFinish): string {
  if (wall === "cedar") return "Cedar";
  if (wall === "stone") return "Stone";
  if (wall === "mud") return "Mud plaster";
  return "Limewash";
}

export function viewLabel(view: WindowView): string {
  if (view === "valley") return "Valley";
  if (view === "ridge") return "Ridge";
  if (view === "monastery") return "Monastery ridge";
  if (view === "river") return "River";
  if (view === "desert") return "Spiti desert";
  return "Landing meadow";
}

export const valleys = ["Kullu", "Shimla", "Kangra", "Parvati", "Spiti", "Bir"] as const;
