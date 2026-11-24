import Link from "next/link";
import { Wordmark } from "@/components/wordmark";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-[#e0d4c2]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-md">
          <Wordmark compact />
          <p className="mt-3 text-sm leading-6 text-[#5c5348]">
            A booking desk for independent lodges in Himachal Pradesh. The room is a model you can turn.
            The ledger of your stays stays on this browser.
          </p>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <Link href="/stays" className="text-[#1e3a32] underline-offset-4 hover:underline">
            All stays
          </Link>
          <Link href="/host" className="text-[#1e3a32] underline-offset-4 hover:underline">
            Occupancy desk
          </Link>
          <p className="text-[#5c5348]">Manali · Shimla · McLeod Ganj · Kasol · Kaza · Bir</p>
        </div>
      </div>
    </footer>
  );
}
