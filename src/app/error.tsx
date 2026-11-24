"use client";

import { Button } from "@/components/ui/button";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-4 px-4 py-24">
      <h1 className="font-heading text-4xl text-[#1c1914]">The desk hit a snag.</h1>
      <p className="text-base leading-7 text-[#3f382f]">The page did not finish loading. Try it again.</p>
      <Button type="button" className="h-11 w-fit px-4" onClick={() => reset()}>
        Try again
      </Button>
    </div>
  );
}
