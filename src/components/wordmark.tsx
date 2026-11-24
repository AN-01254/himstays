import Link from "next/link";

export function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M12 2.2 20.5 20.8H3.5L12 2.2Z" fill="currentColor" />
      <path d="M12 8.4 16.1 17.4H7.9L12 8.4Z" className="fill-[#f3eee4]" />
    </svg>
  );
}

export function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2 text-[#1e3a32]">
      <Mark className="size-6" />
      <span className="font-heading text-xl tracking-tight">HimStays</span>
      {compact ? null : (
        <span className="hidden text-xs tracking-[0.14em] text-[#5c5348] uppercase sm:inline">Himachal</span>
      )}
    </Link>
  );
}
