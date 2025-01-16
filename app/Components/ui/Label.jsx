"use client";

import React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";


const labelVariants = cva("text-sm font-medium leading-none", {
  variants: {
    variant: {
      default: "",
      error: "text-red-600",
    },
    required: {
      true: "after:content-['*'] after:ml-0.5 after:text-red-500",
      false: "",
    },
  },
  defaultVariants: {
    variant: "default",
    required: false,
  },
});

const Label = React.forwardRef(({ className, variant, required, ...props }, ref) => (
  <label
    className={cn(labelVariants({ variant, required }), className)}
    ref={ref}
    {...props}
  />
));
Label.displayName = "Label";

export { Label };
