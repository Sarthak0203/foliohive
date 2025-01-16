"use client";

import * as React from "react";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/Command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";

const selectVariants = cva("bg-background text-foreground", {
  variants: {
    variant: {
      default:
        "border border-input focus:shadow-md focus:border-accent data-[state=open]:border-accent",
      outline: "border border-input focus:border-accent",
    },
    size: {
      default: "h-10 px-3 py-2 text-sm",
      sm: "h-9 px-2 py-1.5 text-sm",
      lg: "h-11 px-3 py-2.5 text-base",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

const Select = React.forwardRef(
  (
    { className, options, variant, size, defaultValue, value, onValueChange },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            variant={variant === "outline" ? "outline" : "default"}
            className={cn(selectVariants({ variant, size }), className)}
          >
            {value
              ? options.find((option) => option.value === value)?.label
              : defaultValue || "Select..."}
            <ChevronDownIcon className="ml-2 h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-select-trigger-width)]">
          <Command>
            <CommandInput placeholder="Search..." />
            <CommandList>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => {
                    onValueChange(option.value);
                    setOpen(false);
                  }}
                >
                  {option.label}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }
);

Select.displayName = "Select";

export { Select };
