import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Suspense } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const regola = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-regola",
});

export const metadata: Metadata = {
  title: {
    default: "HimStays · Rooms in Himachal",
    template: "%s · HimStays",
  },
  description:
    "Turn a model of the room, see which nights are open, and leave your name on the key. Independent lodges in Himachal Pradesh.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${regola.variable} h-full antialiased`}>
      <body className="flex min-h-full w-full max-w-[100vw] flex-col overflow-x-clip bg-parchment text-ink">
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-xl focus:bg-parchment focus:px-3 focus:py-2"
        >
          Skip to content
        </a>
        <Suspense fallback={<div className="h-16 border-b border-black/10 bg-parchment" />}>
          <SiteHeader />
        </Suspense>
        <main id="content" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
