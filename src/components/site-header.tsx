"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Menu, Plus, X } from "lucide-react";
import { YourStays } from "@/components/your-stays";
import { properties, valleys } from "@/lib/catalog";
import { heroPhoto, lodgePhoto } from "@/lib/photos";
import { cn } from "@/lib/utils";

type MenuKey = "stays" | "valleys" | "occupancy";

const items: { id: MenuKey; label: string }[] = [
  { id: "stays", label: "Stays" },
  { id: "valleys", label: "Valleys" },
  { id: "occupancy", label: "Occupancy" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [menu, setMenu] = useState<MenuKey | null>(null);
  const featured = properties[0];

  return (
    <header
      className={cn("z-40", onHome ? "absolute inset-x-0 top-0" : "sticky top-0 bg-white")}
      onMouseLeave={() => setMenu(null)}
    >
      <div className={cn(onHome ? "px-3 pt-3 sm:px-4 sm:pt-4" : "border-b border-black/5")}>
        <div className="relative mx-auto flex h-[72px] w-full max-w-[1440px] items-center justify-between px-4 sm:px-6">
          <Link href="/" className="font-heading text-[22px] tracking-[-0.6px] text-ink" onClick={() => setMenu(null)}>
            HimStays
          </Link>

          <nav
            className="absolute left-1/2 hidden -translate-x-1/2 items-center rounded-full bg-white/80 p-1 shadow-subtle backdrop-blur-md md:flex"
            aria-label="Primary"
          >
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-expanded={menu === item.id}
                className={cn(
                  "rounded-full px-4 py-2 text-[15px] tracking-[-0.2px] text-ink",
                  menu === item.id && "bg-white shadow-subtle",
                )}
                onMouseEnter={() => setMenu(item.id)}
                onClick={() => setMenu(item.id)}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="grid size-10 place-items-center rounded-full bg-white/80 text-ink shadow-subtle md:hidden"
              aria-label={menu ? "Close menu" : "Open menu"}
              aria-expanded={menu !== null}
              onClick={() => setMenu((current) => (current ? null : "stays"))}
            >
              {menu ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
            <Link
              href="/stays"
              onClick={() => setMenu(null)}
              className="rounded-full bg-sky-blue px-4 py-2.5 text-[15px] tracking-[-0.2px] text-white sm:px-5"
            >
              Get started
            </Link>
          </div>

          {menu ? (
            <div className="absolute inset-x-3 top-[calc(100%-4px)] z-40 sm:inset-x-4 md:inset-x-auto md:left-1/2 md:w-[min(920px,calc(100vw-48px))] md:-translate-x-1/2">
              <div className="rounded-[28px] bg-[#f4f4f1] p-5 shadow-[0_12px_40px_rgba(0,0,0,0.12)] sm:p-7">
                <div className="mb-5 flex gap-2 md:hidden">
                  {items.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={cn(
                        "rounded-full px-3 py-1.5 text-[14px]",
                        menu === item.id ? "bg-white text-ink shadow-subtle" : "text-graphite",
                      )}
                      onClick={() => setMenu(item.id)}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
                {menu === "stays" && featured ? <StaysPanel featuredSlug={featured.slug} onNavigate={() => setMenu(null)} /> : null}
                {menu === "valleys" ? <ValleysPanel onNavigate={() => setMenu(null)} /> : null}
                {menu === "occupancy" ? <OccupancyPanel onNavigate={() => setMenu(null)} /> : null}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}

function StaysPanel({ featuredSlug, onNavigate }: { featuredSlug: string; onNavigate: () => void }) {
  const featured = properties.find((property) => property.slug === featuredSlug) ?? properties[0];
  const photo = featured ? lodgePhoto[featured.slug] ?? heroPhoto : heroPhoto;
  return (
    <div className="grid gap-8 md:grid-cols-[220px_1fr]">
      {featured ? (
        <div>
          <Image src={photo.src} alt={photo.alt} width={440} height={330} className="aspect-[4/3] w-full rounded-2xl object-cover" />
          <p className="mt-4 text-[20px] tracking-[-0.4px]">{featured.name}</p>
          <p className="mt-1 text-[14px] leading-[1.45] text-graphite">{featured.summary}</p>
          <Link href={`/stays/${featured.slug}`} onClick={onNavigate} className="mt-3 inline-block text-[15px] text-sky-blue">
            Open the room
          </Link>
        </div>
      ) : null}
      <div>
        <p className="text-[13px] tracking-[-0.2px] text-graphite">Latest stays</p>
        <ul className="mt-3 grid gap-3">
          {properties.slice(0, 4).map((property) => (
            <li key={property.slug} className="flex items-baseline justify-between gap-4">
              <Link
                href={`/stays/${property.slug}`}
                onClick={onNavigate}
                className="text-[20px] tracking-[-0.4px] sm:text-[22px]"
              >
                {property.name}
                <span className="ml-2 text-[14px] text-graphite">{property.town}</span>
              </Link>
              <span className="hidden text-[14px] text-graphite sm:inline">{property.rooms.length} rooms</span>
            </li>
          ))}
        </ul>
        <Link href="/stays" onClick={onNavigate} className="mt-4 inline-block text-[15px]">
          View all stays
        </Link>
        <div className="mt-6 grid gap-3">
          <Link href="/stays/deodar-house" onClick={onNavigate} className="flex items-center gap-3 text-[16px] text-sky-blue">
            <Plus className="size-4" /> Turn a room
          </Link>
          <Link href="/host" onClick={onNavigate} className="flex items-center gap-3 text-[16px] text-sky-blue">
            <ArrowRight className="size-4" /> See occupancy
          </Link>
          <YourStays appearance="link" />
        </div>
      </div>
    </div>
  );
}

function ValleysPanel({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div>
      <p className="text-[13px] tracking-[-0.2px] text-graphite">Six valleys on the desk</p>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {valleys.map((valley) => (
          <li key={valley}>
            <Link
              href={`/stays?valley=${valley}`}
              onClick={onNavigate}
              className="text-[28px] tracking-[-0.6px] sm:text-[32px]"
            >
              {valley}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function OccupancyPanel({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr] md:items-end">
      <div>
        <p className="text-[13px] tracking-[-0.2px] text-graphite">Lodge desk</p>
        <p className="mt-3 max-w-md text-[28px] leading-[1.15] tracking-[-0.6px] sm:text-[32px]">
          See which keys are out tonight, and hold a night for the house.
        </p>
      </div>
      <Link href="/host" onClick={onNavigate} className="text-[16px] text-sky-blue">
        Open occupancy
      </Link>
    </div>
  );
}
