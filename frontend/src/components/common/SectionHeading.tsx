export function SectionHeading({
  title,
  eyebrow,
  action,
}: {
  title: string;
  eyebrow?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4 border-b border-line pb-3">
      <div>
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-wide text-faint">
            {eyebrow}
          </p>
        )}
        {/* <h2 className="mt-0.5 text-xl font-semibold tracking-tight text-ink sm:text-2xl">
          {title}
        </h2> */}
      </div>
      {action && <div className="shrink-0 text-sm">{action}</div>}
    </div>
  );
}
