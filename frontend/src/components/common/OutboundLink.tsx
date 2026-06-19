import { cn } from "@/lib/utils";

/** External link with safe defaults and a "leaves the site" affordance. */
export function OutboundLink({
  href,
  children,
  className,
  showIcon = true,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  showIcon?: boolean;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn("text-accent hover:text-accent-strong underline-offset-2 hover:underline", className)}
    >
      {children}
      {showIcon && (
        <span aria-hidden="true" className="ml-0.5 text-[0.85em]">
          ↗
        </span>
      )}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
