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

function NavLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
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
              "text-sm text-[#3f382f]",
              active && "text-[#1e3a32] underline decoration-[#c9843a] decoration-2 underline-offset-8",
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

  return (
    <header className="sticky top-0 z-30 border-b border-[#e0d4c2]/80 bg-[#f3eee4]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Wordmark />
        <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
          <NavLinks pathname={pathname} />
          <YourStays />
        </nav>
        <div className="flex items-center gap-2 md:hidden">
          <YourStays />
          <Button type="button" variant="outline" size="icon" aria-label="Open menu" onClick={() => setOpen(true)}>
            <Menu />
          </Button>
        </div>
      </div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="bg-[#faf7f2]">
          <SheetHeader>
            <SheetTitle className="font-heading text-xl">HimStays</SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col gap-4 px-4" aria-label="Mobile">
            <NavLinks pathname={pathname} onNavigate={() => setOpen(false)} />
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}
