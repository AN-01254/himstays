import * as React from "react"
import { cn } from "cn"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-24 w-full rounded-xl border border-black/10 bg-black/[0.03] px-[15px] py-[15px] text-[15px] tracking-[-0.2px] text-ink transition-colors outline-none placeholder:text-[#999] focus-visible:border-sky-blue focus-visible:ring-3 focus-visible:ring-sky-blue/30 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
