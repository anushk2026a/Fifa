import { FAQ } from "@/data/faq";

export function Faq() {
  return (
    <div className="divide-y divide-line border-y border-line">
      {FAQ.map((item) => (
        <details name="faq" key={item.q} className="group py-1">
          <summary className="flex cursor-pointer list-none items-center justify-between py-3 text-base font-medium text-ink">
            {item.q}
            <span aria-hidden className="ml-4 text-faint transition-transform group-open:rotate-45">
              +
            </span>
          </summary>
          <p className="pb-4 text-sm leading-relaxed text-muted">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
