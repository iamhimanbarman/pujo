import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva("btn", {
  variants: {
    variant: {
      default: "btn-primary",
      primary: "btn-primary",
      secondary: "btn-secondary",
      outline: "btn-outline",
      ghost: "btn-ghost",
      tonal: "btn-tonal",
      success: "btn-success",
      warning: "btn-warning",
      danger: "btn-danger",
      upload: "btn-upload",
      hero: "btn-hero",
      fab: "btn-fab",
      link: "btn-link",
    },
    size: {
      default: "",
      sm: "[--button-height-md:var(--button-height-sm)] [--button-padding-inline-md:var(--button-padding-inline-sm)] [--button-padding-block-md:var(--button-padding-block-sm)] [--button-font-md:var(--button-font-sm)] [--button-min-width-md:var(--button-min-width-sm)]",
      lg: "[--button-height-md:var(--button-height-lg)] [--button-padding-inline-md:var(--button-padding-inline-lg)] [--button-padding-block-md:var(--button-padding-block-lg)] [--button-font-md:var(--button-font-lg)] [--button-min-width-md:var(--button-min-width-lg)]",
      icon: "btn-square",
    },
    shape: {
      default: "",
      pill: "btn-pill",
      square: "btn-square",
      block: "btn-block",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "default",
    shape: "default",
  },
})

export interface ButtonProps
  extends React.ComponentPropsWithoutRef<typeof ButtonPrimitive>,
    VariantProps<typeof buttonVariants> {}

function Button({
  className,
  variant,
  size,
  shape,
  ...props
}: ButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, shape, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
