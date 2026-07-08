import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "input-border flex min-h-[120px] w-full rounded-[var(--radius-md)] bg-[var(--input-bg)] text-[var(--input-text)] outline-none placeholder:text-[var(--input-placeholder)] px-[var(--input-padding-x)] py-[var(--input-padding-y)] disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-[var(--error-border)] aria-invalid:ring-3 aria-invalid:ring-[var(--error-border)]/20",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
