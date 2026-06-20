import { cn } from "@/lib/utils";
import { FiExternalLink } from "react-icons/fi";

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
      className={cn(
        "text-accent hover:text-accent-strong flex items-center gap-1 underline-offset-2 hover:underline",
        className,
      )}
    >
      {children}
      {showIcon && <FiExternalLink className="size-3.5" />}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
