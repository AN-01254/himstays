"use client";

import { useState, type FormEvent } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BedDouble, TreePine, Users } from "lucide-react";
import { countNights } from "@/lib/availability";
import { properties } from "@/lib/catalog";
import { editorialPhotos, heroPhoto, lodgePhoto } from "@/lib/photos";
import { useLedger } from "@/lib/use-ledger";

const ValleyMap = dynamic(() => import("@/components/valley-map").then((mod) => mod.ValleyMap), {
  ssr: false,
  loading: () => <div className="h-[520px] animate-pulse rounded-[28px] bg-[#e6e1d4] sm:h-[640px]" />,
});

const dock = properties.slice(0, 4);
const openNow = ["deodar-house", "bellview"]
  .map((slug) => properties.find((property) => property.slug === slug))
  .filter((property) => property != null);

const notes = [
  {
    icon: Users,
    title: "Kept by a host",
    copy: "A named person holds both keys. There is no front desk.",
  },
  {
    icon: TreePine,
    title: "Built for the weather",
    copy: "Cedar, a bukhari, and glass that faces the valley.",
  },
  {
    icon: BedDouble,
    title: "Two rooms, not a hotel",
    copy: "Small on purpose, so the house still feels like a house.",
  },
];

export function HomeDesk() {
  const { today, bookings, blocks, ready } = useLedger();
  const [dockIndex, setDockIndex] = useState(1);
  const [town, setTown] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState<string | null>(null);

  function keepNote(event: FormEvent) {
    event.preventDefault();
    const value = email.trim();
    if (value && (!value.includes("@") || !value.includes("."))) {
      setNote("Use an email address, or leave the field empty.");
      return;
    }
    setNote("Nothing was sent. The desk does not keep this.");
    setTown("");
    setEmail("");
  }

  return (
    <div className="bg-white">
      <section className="px-3 pt-3 sm:px-4 sm:pt-4">
        <h1 className="sr-only">HimStays. Rooms in Himachal you can picture before you book.</h1>
        <div className="relative h-[78vh] min-h-[640px] overflow-hidden rounded-[28px] bg-[#d7e2ea]">
          <Image
            src={heroPhoto.src}
            alt={heroPhoto.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-[62%_center]"
          />
          {dock.length > 0 ? (
            <div className="absolute inset-x-0 bottom-5 flex justify-center px-3 sm:bottom-7">
              <div className="flex max-w-full items-center">
                {dock.map((property, index) => {
                  const photo = lodgePhoto[property.slug] ?? heroPhoto;
                  if (index === dockIndex) {
                    return (
                      <Link
                        key={property.slug}
                        href={`/stays/${property.slug}`}
                        className="mx-1.5 flex min-w-0 items-center gap-3 rounded-full bg-white py-1.5 pr-4 pl-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.16)] sm:mx-2 sm:pr-5"
                      >
                        <Image src={photo.src} alt="" width={56} height={56} className="size-12 rounded-full object-cover sm:size-14" />
                        <span className="min-w-0">
                          <span className="block truncate text-[14px] tracking-[-0.2px] text-ink sm:text-[15px]">
                            {property.name}
                            <span className="text-graphite"> {property.town}</span>
                          </span>
                          <span className="block text-[14px] text-sky-blue">See the room</span>
                        </span>
                      </Link>
                    );
                  }
                  return (
                    <button
                      key={property.slug}
                      type="button"
                      aria-label={property.name}
                      aria-pressed={false}
                      onClick={() => setDockIndex(index)}
                      className="mx-1 size-12 shrink-0 overflow-hidden rounded-full ring-2 ring-white sm:mx-1.5 sm:size-14"
                    >
                      <Image src={photo.src} alt="" width={56} height={56} className="h-full w-full object-cover" />
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
        <p className="px-2 pt-3 text-[12px] tracking-[-0.2px] text-[#9a9a9a]">
          Homestay near Shimla, public domain, Shivya. Other houses: CC BY-SA, Wikimedia Commons.
        </p>
      </section>

      <section className="px-5 pt-24 pb-4 sm:px-8 sm:pt-32">
        <div className="mx-auto max-w-[820px] text-center">
          <h2 className="font-heading text-[clamp(40px,5.4vw,68px)] leading-[0.98] tracking-[-0.045em]">
            A quieter way
            <br />
            to stay in the hills.
          </h2>
        </div>
        <p className="mx-auto mt-8 max-w-[440px] text-left text-[17px] leading-[1.45] tracking-[-0.2px]">
          Each house is a pair of rooms with a host who lives there, in the valleys people already walk. You can see the room, which nights are open, and whose name is on the key.
        </p>
      </section>

      <section className="mx-auto grid w-full max-w-[1100px] gap-3 px-4 py-10 sm:px-6 md:grid-cols-3">
        {notes.map((item) => (
          <div key={item.title} className="rounded-[20px] bg-[#f4f4f1] px-6 py-8 text-center">
            <item.icon className="mx-auto size-5 text-ink" strokeWidth={1.5} />
            <p className="mt-4 text-[16px] tracking-[-0.2px]">{item.title}</p>
            <p className="mx-auto mt-1.5 max-w-[240px] text-[14px] leading-[1.4] text-graphite">{item.copy}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto w-full max-w-[1100px] px-4 pb-8 sm:px-6">
        <figure className="relative overflow-hidden rounded-[28px] bg-[#e7e3dc]">
          <Image
            src={editorialPhotos.sitting.src}
            alt={editorialPhotos.sitting.alt}
            width={1600}
            height={1100}
            sizes="(min-width: 1100px) 1100px, 100vw"
            className="aspect-[16/10] w-full object-cover"
          />
          <figcaption className="absolute top-4 left-4 text-[13px] tracking-[-0.2px] text-white">
            The sitting room
          </figcaption>
        </figure>
      </section>

      <section id="houses" className="px-3 pt-16 pb-6 sm:px-4 sm:pt-24">
        <div className="mx-auto max-w-[760px] text-center">
          <h2 className="font-heading text-[clamp(40px,6vw,72px)] leading-[0.96] tracking-[-0.04em]">
            Where the houses are
          </h2>
          <p className="mx-auto mt-5 max-w-md text-[18px] leading-[1.4] tracking-[-0.2px] text-graphite">
            Six lodges, from Old Manali and the Parvati to Shimla, Bir, and Kaza.
          </p>
        </div>
        <div className="mx-auto mt-10 w-full max-w-[1100px]">
          <ValleyMap />
        </div>
      </section>

      <section className="overflow-x-clip px-4 py-20 sm:px-6 sm:py-28">
        <div className="relative mx-auto grid max-w-[1080px] items-start gap-8 lg:grid-cols-2 lg:gap-x-12">
          <h2 className="order-2 font-heading text-[clamp(64px,8vw,108px)] leading-[0.84] tracking-[-0.05em] lg:pointer-events-none lg:absolute lg:top-10 lg:right-0 lg:left-[22%] lg:z-10 lg:flex lg:items-center">
            <span className="block">Space</span>
            <span aria-hidden className="mx-6 hidden h-px min-w-8 flex-1 bg-ink lg:block" />
            <span className="mt-1 block text-right lg:mt-0">
              for
              <br />
              life.
            </span>
          </h2>
          <figure className="relative order-1 lg:order-none">
            <Image
              src={editorialPhotos.room.src}
              alt={editorialPhotos.room.alt}
              width={900}
              height={1100}
              sizes="(min-width: 1024px) 500px, 100vw"
              className="aspect-[4/5] w-full rounded-[22px] object-cover"
            />
            <figcaption className="absolute top-4 left-4 text-[13px] tracking-[-0.2px] text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.55)]">
              The room
            </figcaption>
          </figure>
          <div className="hidden lg:order-none lg:block" aria-hidden />
          <div className="order-3 lg:order-none">
            <p className="text-[16px] tracking-[-0.2px]">Lives large.</p>
            <p className="mt-2 max-w-sm text-[15px] leading-[1.45] tracking-[-0.2px]">
              A wide bed under the timber, and enough quiet that the valley stays in the room.
            </p>
          </div>
          <figure className="order-4 lg:order-none lg:-mt-16">
            <div className="relative">
              <Image
                src={editorialPhotos.window.src}
                alt={editorialPhotos.window.alt}
                width={1200}
                height={800}
                sizes="(min-width: 1024px) 520px, 100vw"
                className="aspect-[4/3] w-full rounded-[22px] object-cover"
              />
              <figcaption className="absolute top-4 left-4 text-[13px] tracking-[-0.2px] text-white">The window</figcaption>
            </div>
            <p className="mt-5 text-[16px] tracking-[-0.2px]">The little things.</p>
            <p className="mt-2 max-w-sm text-[15px] leading-[1.45] tracking-[-0.2px]">
              A kettle by the bed, wool on the chair, and a window onto the trees.
            </p>
          </figure>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[920px] px-4 pb-8 sm:px-6">
        <figure>
          <div className="relative overflow-hidden rounded-[22px] bg-[#e7e3dc]">
            <Image
              src="/photos/nagdhar.jpg"
              alt="A white house in an orchard above a Kullu valley"
              width={1400}
              height={900}
              sizes="(min-width: 920px) 920px, 100vw"
              className="aspect-[16/10] w-full object-cover"
            />
            <figcaption className="absolute top-4 left-4 text-[13px] tracking-[-0.2px] text-white">The orchard</figcaption>
          </div>
          <figcaption className="mt-5 max-w-sm">
            <p className="text-[16px] tracking-[-0.2px]">Common ground.</p>
            <p className="mt-2 text-[15px] leading-[1.45] tracking-[-0.2px]">
              An orchard, a lane, and the hill the house already shares with its neighbours.
            </p>
          </figcaption>
        </figure>
        <p className="mt-6 text-[12px] leading-[1.45] tracking-[-0.2px] text-[#9a9a9a]">
          Bir rooms, Panchkaranvarun, CC BY 4.0. Timber bedroom, Microrao, CC BY-SA 4.0. Wikimedia Commons.
        </p>
      </section>

      <section className="mt-16 flex min-h-[68vh] items-end bg-[#cfcabf] px-6 py-14 sm:min-h-[78vh] sm:px-16 sm:py-20">
        <h2 className="font-heading text-[clamp(64px,10vw,120px)] leading-none tracking-[-0.045em] text-white">
          <Link href="/stays">Look closer.</Link>
        </h2>
      </section>

      <section className="px-4 py-20 sm:px-6 sm:py-28">
        <h2 className="text-center font-heading text-[clamp(40px,5vw,64px)] leading-[1.02] tracking-[-0.04em]">
          Open now in the valleys.
        </h2>
        <div className="mx-auto mt-12 grid max-w-[1100px] gap-8 md:grid-cols-2">
          {openNow.map((property) => {
            const photo = lodgePhoto[property.slug] ?? heroPhoto;
            const open = ready
              ? property.rooms.some(
                  (room) => countNights(property.slug, room.slug, today, bookings, blocks, 7).open > 0,
                )
              : null;
            return (
              <article key={property.slug}>
                <Link href={`/stays/${property.slug}`} className="relative block overflow-hidden rounded-[22px] bg-[#e7e3dc]">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    width={1200}
                    height={800}
                    sizes="(min-width: 768px) 540px, 100vw"
                    className="aspect-[16/10] w-full object-cover"
                  />
                  <span className="absolute top-4 left-4 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-[13px] tracking-[-0.2px] text-ink">
                    <span className={`size-1.5 rounded-full ${open === false ? "bg-[#b0b0b0]" : "bg-[#2f9e44]"}`} />
                    {open === false ? "Full this week" : "Available now"}
                  </span>
                </Link>
                <div className="mt-3 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[15px] tracking-[-0.2px]">
                      {property.name}, {property.town}
                    </p>
                    <Link href={`/stays/${property.slug}`} className="text-[15px] text-sky-blue">
                      See this house
                    </Link>
                  </div>
                  <Link
                    href={`/stays/${property.slug}`}
                    aria-label={`See ${property.name}`}
                    className="grid size-9 shrink-0 place-items-center rounded-full border border-black/15 text-ink"
                  >
                    <ArrowUpRight className="size-4" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="px-4 pb-24 sm:px-6 sm:pb-32">
        <form onSubmit={keepNote} className="mx-auto max-w-[920px] rounded-[28px] bg-[#f4f4f1] px-5 py-12 sm:px-12 sm:py-14">
          <h2 className="text-center font-heading text-[32px] leading-none tracking-[-0.03em] sm:text-[36px]">
            Be first to know.
          </h2>
          <p className="mx-auto mt-3 max-w-md text-center text-[15px] leading-[1.45] tracking-[-0.2px] text-graphite">
            Name a town, and leave an email if you want. Nothing is sent, and the desk does not keep either.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <label className="sr-only" htmlFor="note-town">
              Town
            </label>
            <input
              id="note-town"
              value={town}
              onChange={(event) => {
                setTown(event.target.value);
                setNote(null);
              }}
              placeholder="Town"
              className="h-12 flex-1 rounded-full border border-black/5 bg-white px-5 text-[15px] tracking-[-0.2px] outline-none placeholder:text-[#b5b5b5]"
            />
            <label className="sr-only" htmlFor="note-email">
              Email
            </label>
            <input
              id="note-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setNote(null);
              }}
              placeholder="Email"
              className="h-12 flex-[1.4] rounded-full border border-black/5 bg-white px-5 text-[15px] tracking-[-0.2px] outline-none placeholder:text-[#b5b5b5]"
            />
          </div>
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <label className="flex items-center gap-2 text-[14px] tracking-[-0.2px] text-graphite">
              <input type="checkbox" className="size-4 accent-ink" />
              A note when a house opens nearby
            </label>
            <button type="submit" className="h-11 rounded-full bg-[#e4e4e1] px-5 text-[15px] tracking-[-0.2px] text-ink">
              Get updates
            </button>
          </div>
          {note ? (
            <p className="mt-4 text-center text-[13px] text-graphite" role="status">
              {note}
            </p>
          ) : null}
        </form>
      </section>
    </div>
  );
}
