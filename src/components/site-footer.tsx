import Link from "next/link";
import { Wordmark } from "@/components/wordmark";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-black/10 bg-parchment text-ink">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-10 px-5 py-24 sm:px-8 md:flex-row md:items-end md:justify-between">
        <div className="max-w-md">
          <Wordmark compact />
          <p className="mt-4 text-[16px] leading-[1.49] tracking-[-0.22px] text-graphite">
            A booking desk for independent lodges in Himachal Pradesh. The room is a model you can turn.
            The ledger of your stays stays on this browser.
          </p>
        </div>
        <div className="flex flex-col gap-3 text-[16px] tracking-[-0.22px]">
          <Link href="/stays" className="text-sky-blue">
            All stays
          </Link>
          <Link href="/host" className="text-sky-blue">
            Occupancy desk
          </Link>
          <p className="text-graphite">Manali · Shimla · McLeod Ganj · Kasol · Kaza · Bir</p>
        </div>
      </div>
    </footer>
  );
}
