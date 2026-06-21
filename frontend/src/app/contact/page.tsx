import type { Metadata } from "next";
import { Container } from "@/components/common/Container";
import { ContactForm } from "@/components/contact/ContactForm";
import img from "../../../public/images/contact/image.png";
export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Share your details and we'll help guide you for your FIFA World Cup 2026 host city — restaurants, hotels, transport and more.",
};

export default function ContactPage() {
  return (
    <>
      <section
        className="border-b border-line bg-accent-soft"
        style={{
          backgroundImage: `url(${img.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Container className="py-12 sm:py-24">
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Share Your FIFA Experiences
          </h1>
          <span className="mt-3 max-w-2xl text-base text-white">
            Celebrate the passion of football. Share your matchday memories,
            stadium moments, fan celebrations, photos, and unforgettable
            experiences with supporters around the world.
          </span>
        </Container>
      </section>

      <ContactForm />
    </>
  );
}
