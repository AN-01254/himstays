"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Mark } from "@/components/wordmark";

const linkClass =
  "block font-heading text-[28px] leading-[1.12] tracking-[-0.03em] text-ink hover:text-sky-blue sm:text-[32px]";
const labelClass =
  "block font-heading text-[28px] leading-[1.12] tracking-[-0.03em] text-[#c8c8c8] sm:text-[32px]";

export function SiteFooter() {
  const [email, setEmail] = useState("");
  const [note, setNote] = useState<string | null>(null);

  function keepEmail(event: FormEvent) {
    event.preventDefault();
    const value = email.trim();
    if (!value.includes("@") || !value.includes(".")) {
      setNote("Use an email address, or leave the field empty.");
      return;
    }
    setNote("Nothing was sent. The desk does not keep this email.");
    setEmail("");
  }

  return (
    <footer className="mt-auto bg-white text-ink">
      <div className="mx-auto w-full max-w-[1280px] px-5 pt-28 pb-12 sm:px-8 sm:pt-32">
        <div className="grid items-start gap-x-8 gap-y-14 lg:grid-cols-[1fr_1fr_1fr_minmax(260px,320px)]">
          <nav aria-label="HimStays">
            <p className={labelClass}>HimStays</p>
            <Link href="/stays" className={linkClass}>
              Stays
            </Link>
            <Link href="/host" className={linkClass}>
              Occupancy
            </Link>
            <Link href="/#content" className={linkClass}>
              The model
            </Link>
          </nav>
          <nav aria-label="Houses">
            <p className={labelClass}>Houses</p>
            <Link href="/stays/deodar-house" className={linkClass}>
              Deodar
            </Link>
            <Link href="/stays/bellview" className={linkClass}>
              Bellview
            </Link>
            <Link href="/stays/mud-sky" className={linkClass}>
              Mud & Sky
            </Link>
          </nav>
          <nav aria-label="Valleys">
            <p className={labelClass}>Valleys</p>
            <Link href="/stays" className={linkClass}>
              Kullu
            </Link>
            <Link href="/stays" className={linkClass}>
              Shimla
            </Link>
            <Link href="/stays" className={linkClass}>
              Spiti
            </Link>
          </nav>
          <div>
            <p className="text-[15px] tracking-[-0.2px]">A note from the desk</p>
            <p className="mt-1 text-[14px] leading-[1.45] tracking-[-0.4px] text-graphite">
              Drop an email. Nothing is sent.
            </p>
            <form className="mt-4 flex h-12 items-center rounded-full bg-[#f3f3f1] pr-1.5 pl-5" onSubmit={keepEmail}>
              <label htmlFor="desk-email" className="sr-only">
                Email
              </label>
              <input
                id="desk-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setNote(null);
                }}
                placeholder="Email"
                className="min-w-0 flex-1 bg-transparent text-[15px] tracking-[-0.2px] text-ink outline-none placeholder:text-[#b5b5b5]"
              />
              <button
                type="submit"
                aria-label="Keep this email on this browser"
                className="grid size-9 shrink-0 place-items-center rounded-full text-graphite hover:bg-black/5"
              >
                <ArrowRight className="size-4" />
              </button>
            </form>
            {note ? (
              <p className="mt-3 text-[13px] leading-[1.4] text-graphite" role="status">
                {note}
              </p>
            ) : null}
            <div className="mt-8 text-[#c8c8c8]">
              <Mark className="size-8" />
              <span className="mt-1 block text-[8px] tracking-[0.18em]">HIMSTAYS</span>
            </div>
          </div>
        </div>

        <div className="mt-20 grid items-end gap-8 lg:grid-cols-[1fr_1fr_1fr_minmax(260px,320px)]">
          <p className="order-2 text-[13px] tracking-[-0.2px] text-[#a3a3a3] lg:order-none lg:col-span-3">© 2026 HimStays</p>
          <div className="order-1 lg:order-none">
            <p className="text-[12px] leading-[1.55] tracking-[-0.2px] text-[#9a9a9a]">
              HimStays is a model of a booking desk for fictional lodges in Himachal. Sample guests are not
              real people. Stays and house holds live in this browser and are not sent to a server.
            </p>
            <div className="mt-8 flex gap-6 text-[14px] tracking-[-0.2px]">
              <Link href="/privacy">Privacy policy</Link>
              <Link href="/terms">Terms of service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
