"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu } from "lucide-react";
import { Wordmark } from "@/components/wordmark";
import { YourStays } from "@/components/your-stays";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const links = [
  { href: "/stays", label: "Stays" },
  { href: "/host", label: "Occupancy" },
];

function NavLinks({
  pathname,
  onDark,
  onNavigate,
}: {
  pathname: string;
  onDark: boolean;
  onNavigate?: () => void;
}) {
  return (
    <>
      {links.map((link) => {
        const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className={cn(
              "text-[15px] tracking-[-0.2px]",
              onDark ? "text-white/80" : "text-ink",
              active && "text-sky-blue",
            )}
            aria-current={active ? "page" : undefined}
          >
            {link.label}
          </Link>
        );
      })}
    </>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const onDark = pathname === "/";

  return (
    <header
      className={cn(
        "sticky top-0 z-30 border-b backdrop-blur-md",
        onDark ? "border-white/10 bg-black/90 text-white" : "border-black/10 bg-parchment/95 text-ink",
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-[1280px] items-center justify-between gap-3 px-5 sm:px-8">
        <Wordmark />
        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          <NavLinks pathname={pathname} onDark={onDark} />
          <YourStays onDark={onDark} />
        </nav>
        <div className="flex items-center gap-2 md:hidden">
          <YourStays onDark={onDark} />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Open menu"
            className={onDark ? "text-white hover:bg-white/10" : undefined}
            onClick={() => setOpen(true)}
          >
            <Menu />
          </Button>
        </div>
      </div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="bg-parchment text-ink">
          <SheetHeader>
            <SheetTitle className="font-heading text-[30px] tracking-[-0.9px]">HimStays</SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col gap-5 px-4 text-[18px]" aria-label="Mobile">
            <NavLinks pathname={pathname} onDark={false} onNavigate={() => setOpen(false)} />
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}
