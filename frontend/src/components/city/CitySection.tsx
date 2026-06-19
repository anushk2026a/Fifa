import { Container } from "@/components/common/Container";

export function CitySection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-32 border-b border-line">
      <Container className="py-10">
        <h2 className="mb-5 text-xl font-semibold tracking-tight text-ink sm:text-2xl">{title}</h2>
        {children}
      </Container>
    </section>
  );
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-[var(--radius-card)] border border-dashed border-line bg-paper px-4 py-6 text-sm text-muted">
      {children}
    </p>
  );
}
