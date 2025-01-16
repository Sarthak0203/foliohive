"use client";

import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const textareaVariants = cva(
  "w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border-gray-300 focus-visible:ring-primary-500 focus-visible:border-primary-500", // Changed default variant
        destructive: "border-destructive focus-visible:ring-destructive",
        outline: "border-input focus-visible:ring-ring",
        secondary: "border-gray-200",
        ghost: "border-transparent",
      },
      size: {
        default: "h-24",
        sm: "h-20",
        lg: "h-28",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Textarea = React.forwardRef(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <textarea
        className={cn(textareaVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };