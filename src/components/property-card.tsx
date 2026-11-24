import Link from "next/link";
import { ValleyPoster } from "@/components/valley-poster";
import { countNights, nextOpenNight } from "@/lib/availability";
import { elevationLabel, formatDay, inr } from "@/lib/dates";
import type { GuestBooking, HostBlock, Property } from "@/lib/types";

export function PropertyCard({
  property,
  today,
  bookings,
  blocks,
}: {
  property: Property;
  today: string;
  bookings: GuestBooking[];
  blocks: HostBlock[];
}) {
  const from = Math.min(...property.rooms.map((room) => room.price));
  const week = property.rooms.reduce(
    (sum, room) => {
      if (!today) return sum;
      const count = countNights(property.slug, room.slug, today, bookings, blocks, 7);
      return { open: sum.open + count.open, total: sum.total + 7 };
    },
    { open: 0, total: property.rooms.length * 7 },
  );
  const next = today
    ? property.rooms
        .map((room) => nextOpenNight(property.slug, room.slug, today, bookings, blocks))
        .filter((iso): iso is string => Boolean(iso))
        .sort()[0]
    : undefined;
  const takenShare = week.total === 0 ? 0 : ((week.total - week.open) / week.total) * 100;

  return (
    <Link
      href={`/stays/${property.slug}#${property.rooms[0]?.slug ?? ""}`}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-[#e0d4c2] bg-[#faf7f2]"
    >
      <ValleyPoster view={property.rooms[0]?.view ?? "valley"} className="h-40 w-full sm:h-44" />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <p className="text-[11px] tracking-[0.16em] text-[#8c4a2f] uppercase">
            {property.valley} · {elevationLabel(property.elevationM)}
          </p>
          <h3 className="font-heading mt-1 text-2xl text-[#1c1914] group-hover:text-[#1e3a32]">{property.name}</h3>
          <p className="text-sm text-[#5c5348]">{property.town}</p>
        </div>
        <p className="text-sm leading-6 text-[#3f382f]">{property.summary}</p>
        <div className="mt-auto">
          <div className="mb-2 h-1.5 overflow-hidden rounded-full bg-[#e7dccb]">
            <div className="h-full rounded-full bg-[#1e3a32]" style={{ width: `${takenShare}%` }} />
          </div>
          <p className="text-xs text-[#5c5348]">
            {today
              ? `${week.open} of ${week.total} room-nights open this week`
              : "Checking the week…"}
          </p>
          <div className="mt-3 flex items-end justify-between gap-3">
            <p className="text-sm">
              From <span className="font-medium">{inr(from)}</span>
              <span className="text-[#5c5348]"> / night</span>
            </p>
            <p className="text-xs text-[#5c5348]">
              {next ? `Next open ${formatDay(next)}` : today ? "Full this fortnight" : "Host " + property.host}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
