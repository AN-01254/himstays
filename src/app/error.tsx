"use client";

import { Button } from "@/components/ui/button";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-5 px-5 py-28">
      <h1 className="font-heading text-[48px] leading-none tracking-[-1.3px] text-ink">The desk hit a snag.</h1>
      <p className="text-[18px] leading-[1.33] tracking-[-0.18px]">The page did not finish loading. Try it again.</p>
      <Button type="button" className="h-auto w-fit rounded-xl px-[14px] py-[14px]" onClick={() => reset()}>
        Try again
      </Button>
    </div>
  );
}
