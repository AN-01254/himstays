import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy",
  description: "What HimStays keeps, and where it stays.",
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto w-full max-w-[760px] px-5 py-24 sm:px-8 sm:py-28">
      <p className="text-[14px] tracking-[-0.56px] text-graphite">HimStays</p>
      <h1 className="mt-4 font-heading text-[clamp(40px,5vw,60px)] leading-[0.96] tracking-[-0.04em]">
        Privacy
      </h1>
      <div className="mt-8 grid gap-5 text-[18px] leading-[1.4] tracking-[-0.18px]">
        <p>Your name, phone, note, and the nights you book stay in this browser. They are not sent to a server.</p>
        <p>
          An email typed into the footer is checked, then dropped. It is not stored and it is not mailed.
        </p>
        <p>Sample guests on the occupancy board are fictional. They are part of the model, not people you can reach.</p>
      </div>
    </article>
  );
}
