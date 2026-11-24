import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-5 px-5 py-28">
      <p className="text-[14px] tracking-[-0.56px] text-graphite">Missing from the desk</p>
      <h1 className="font-heading text-[48px] leading-none tracking-[-1.3px] text-ink">This lodge is not on the board.</h1>
      <p className="text-[18px] leading-[1.33] tracking-[-0.18px]">
        HimStays keeps six houses. The address you opened is not one of them.
      </p>
      <Button className="h-auto w-fit rounded-xl px-[14px] py-[14px]" nativeButton={false} render={<Link href="/stays" />}>
        Back to the stays
      </Button>
    </div>
  );
}
