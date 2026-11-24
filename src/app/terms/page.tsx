import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms",
  description: "What a HimStays confirmation means.",
};

export default function TermsPage() {
  return (
    <article className="mx-auto w-full max-w-[760px] px-5 py-24 sm:px-8 sm:py-28">
      <p className="text-[14px] tracking-[-0.56px] text-graphite">HimStays</p>
      <h1 className="mt-4 font-heading text-[clamp(40px,5vw,60px)] leading-[0.96] tracking-[-0.04em]">
        Terms
      </h1>
      <div className="mt-8 grid gap-5 text-[18px] leading-[1.4] tracking-[-0.18px]">
        <p>
          The six lodges, their hosts, and the prices are a model of a booking desk. A confirmation code is a
          record on this browser, not a reservation with a house.
        </p>
        <p>Friday and Saturday nights in the model are twelve percent higher. Check-in is 1pm. Checkout is 11am.</p>
        <p>Clearing this browser’s storage removes your stays and any nights the house was holding.</p>
      </div>
    </article>
  );
}
