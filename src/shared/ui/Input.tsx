import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/shared/lib/cn";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none ring-brand-500/30 placeholder:text-slate-400 focus:ring-4",
        className
      )}
      {...props}
    />
  )
);

Input.displayName = "Input";
