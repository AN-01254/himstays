import Link from "next/link";

export function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        d="M4.5 11.2 12 4.5l7.5 6.7V20h-15Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <path d="M10 20v-5.2h4V20" fill="none" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  );
}

export function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2 text-current">
      <Mark className="size-6" />
      <span className="font-heading text-[21px] leading-none tracking-[-0.6px]">HimStays</span>
      {compact ? null : (
        <span className="hidden text-[12px] tracking-[-0.48px] text-current/60 sm:inline">Himachal</span>
      )}
    </Link>
  );
}
