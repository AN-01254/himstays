import type { Metadata } from "next";
import { Suspense } from "react";
import { StaysBrowser } from "@/components/stays-browser";

export const metadata: Metadata = {
  title: "Stays",
  description: "Independent lodges in Kullu, Shimla, Kangra, Parvati, Spiti, and Bir.",
};

export default function Page() {
  return (
    <Suspense fallback={<div className="mx-auto h-80 w-full max-w-[1280px] animate-pulse px-5 py-16" />}>
      <StaysBrowser />
    </Suspense>
  );
}
