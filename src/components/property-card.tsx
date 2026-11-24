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
      className="group flex h-full flex-col overflow-hidden rounded-xl bg-[#f7f7f0] shadow-card"
    >
      <ValleyPoster view={property.rooms[0]?.view ?? "valley"} className="h-40 w-full sm:h-44" />
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <p className="text-[12px] tracking-[-0.48px] text-graphite">
            {property.valley} · {elevationLabel(property.elevationM)}
          </p>
          <h3 className="font-heading mt-2 text-[30px] leading-[1.14] tracking-[-0.9px] text-ink">{property.name}</h3>
          <p className="text-[14px] text-graphite">{property.town}</p>
        </div>
        <p className="text-[16px] leading-[1.49] tracking-[-0.22px]">{property.summary}</p>
        <div className="mt-auto">
          <div className="mb-2 h-1 overflow-hidden rounded-full bg-ash">
            <div className="h-full rounded-full bg-sky-blue" style={{ width: `${takenShare}%` }} />
          </div>
          <p className="text-[12px] tracking-[-0.48px] text-graphite">
            {today
              ? `${week.open} of ${week.total} room-nights open this week`
              : "Checking the week…"}
          </p>
          <div className="mt-4 flex items-end justify-between gap-3">
            <p className="text-[15px]">
              From {inr(from)}
              <span className="text-graphite"> / night</span>
            </p>
            <p className="text-[12px] text-graphite">
              {next ? `Next open ${formatDay(next)}` : today ? "Full this fortnight" : "Host " + property.host}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
