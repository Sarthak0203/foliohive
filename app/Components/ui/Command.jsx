"use client";

import * as React from "react";
import { CheckIcon } from "@radix-ui/react-icons";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const Command = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative flex flex-col flex-1 overflow-hidden rounded-md border border-input bg-background text-foreground",
      className
    )}
    {...props}
  />
));
Command.displayName = "Command";

const CommandList = React.forwardRef(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-col p-1 overflow-y-auto text-sm", className)}
    {...props}
  />
));
CommandList.displayName = "CommandList";

const CommandEmpty = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "py-6 text-center text-sm text-muted-foreground",
      className
    )}
    {...props}
  />
));
CommandEmpty.displayName = "CommandEmpty";

const CommandGroup = React.forwardRef(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("overflow-hidden", className)} {...props} />
));
CommandGroup.displayName = "CommandGroup";

const CommandSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    role="separator"
    aria-orientation="horizontal"
    {...props}
  />
));
CommandSeparator.displayName = "CommandSeparator";

const CommandInput = React.forwardRef(({ className, ...props }, ref) => (
  <div className="flex items-center px-3">
    <input
      ref={ref}
      className={cn(
        "flex-1 w-full text-sm leading-6 bg-transparent focus:outline-none",
        className
      )}
      {...props}
    />
  </div>
));
CommandInput.displayName = "CommandInput";

const CommandItem = React.forwardRef(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn(
      "group relative flex cursor-default select-none items-center rounded-md px-2 py-1.5 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  />
));
CommandItem.displayName = "CommandItem";

const CommandShortcut = ({ className, ...props }) => (
  <span
    className={cn(
      "ml-auto text-xs tracking-widest text-muted-foreground",
      className
    )}
    {...props}
  />
);
CommandShortcut.displayName = "CommandShortcut";

export {
  Command,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandSeparator,
  CommandInput,
  CommandItem,
  CommandShortcut,
};