import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "input-border flex w-full rounded-[var(--radius-md)] bg-[var(--input-bg)] text-[var(--input-text)] outline-none placeholder:text-[var(--input-placeholder)] h-[var(--input-height)] px-[var(--input-padding-x)] py-[var(--input-padding-y)] disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-[var(--error-border)] aria-invalid:ring-3 aria-invalid:ring-[var(--error-border)]/20",
        className
      )}
      {...props}
    />
  )
}

export { Input }
