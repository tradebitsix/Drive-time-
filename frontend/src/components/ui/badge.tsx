import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "border-[hsl(var(--border))] bg-[hsl(var(--muted))] text-[hsl(var(--foreground))]",
        success: "border-emerald-800/40 bg-emerald-900/30 text-emerald-200",
        warning: "border-amber-800/40 bg-amber-900/30 text-amber-200",
        neutral: "border-slate-700/60 bg-slate-900/20 text-slate-200",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export function Badge({ className, variant, ...props }: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
