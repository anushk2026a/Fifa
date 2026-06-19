import type { Metadata } from "next";
import { Container } from "@/components/common/Container";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Share your details and we'll help guide you for your FIFA World Cup 2026 host city — restaurants, hotels, transport and more.",
};

export default function ContactPage() {
  return (
    <>
      <section className="border-b border-line bg-accent-soft">
        <Container className="py-12 sm:py-16">
          <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">Contact us</h1>
          <p className="mt-3 max-w-2xl text-base text-muted">
            Still have questions — which stadium hosts your match, or how to get there? Share
            your details and we&apos;ll guide you for your location, including where to eat,
            stay, park and watch.
          </p>
        </Container>
      </section>

      <Container className="py-12">
        <ContactForm />
        <p className="mt-6 max-w-xl text-xs text-faint">
          We only use your details to respond to your enquiry. Always buy match tickets from
          official FIFA sources.
        </p>
      </Container>
    </>
  );
}
