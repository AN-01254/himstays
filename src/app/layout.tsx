import type { Metadata } from "next";
import { Fraunces, Outfit } from "next/font/google";
import { Suspense } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
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
    <html lang="en" className={`${outfit.variable} ${fraunces.variable} h-full antialiased`}>
      <body className="flex min-h-full w-full max-w-[100vw] flex-col overflow-x-clip">
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-[#faf7f2] focus:px-3 focus:py-2"
        >
          Skip to content
        </a>
        <Suspense fallback={<div className="h-16 border-b border-[#e0d4c2]" />}>
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
