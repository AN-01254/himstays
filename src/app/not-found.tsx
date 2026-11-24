import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-4 px-4 py-24">
      <p className="text-[11px] tracking-[0.18em] text-[#8c4a2f] uppercase">Missing from the desk</p>
      <h1 className="font-heading text-4xl text-[#1c1914]">This lodge is not on the board.</h1>
      <p className="text-base leading-7 text-[#3f382f]">
        HimStays keeps six houses. The address you opened is not one of them.
      </p>
      <Button className="h-11 w-fit px-4" nativeButton={false} render={<Link href="/stays" />}>
        Back to the stays
      </Button>
    </div>
  );
}
