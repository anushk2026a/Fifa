import Image from "next/image";
import { cn } from "@/lib/utils";

/** A small country flag image (from flagcdn). Renders nothing if the ISO is unknown. */
export function Flag({
  iso2,
  label,
  className,
}: {
  iso2: string;
  label: string;
  className?: string;
}) {
  if (!iso2) {
    return <span className={cn("inline-block h-[18px] w-6 rounded-[2px] bg-line", className)} aria-hidden />;
  }
  return (
    <Image
      src={`https://flagcdn.com/w80/${iso2}.png`}
      alt={`${label} flag`}
      width={24}
      height={18}
      className={cn("h-[18px] w-6 rounded-[2px] border border-line object-cover", className)}
    />
  );
}
