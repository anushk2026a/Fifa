import type { ContactSubmission } from "./contact.repo";
import type { WithId } from "../../shared/db/json-store";
import { getContactStore } from "./contact.store";
import type { CreateContactInput, UpdateContactInput } from "./contact.validation";
import { sendContactEmail } from "../../shared/mailer";
import { stripTags } from "../../shared/middleware/xss";
import { logger } from "../../shared/logger";

export async function listContacts(): Promise<WithId<ContactSubmission>[]> {
  const store = await getContactStore();
  return store.list();
}

export async function createContact(input: CreateContactInput): Promise<WithId<ContactSubmission>> {
  const store = await getContactStore();

  // Strip HTML from all text fields before persisting to prevent stored XSS.
  const doc: ContactSubmission = {
    name:      stripTags(input.name.trim()),
    email:     input.email.trim().toLowerCase(),
    phone:     input.phone     ? stripTags(input.phone.trim())     : undefined,
    country:   input.country   ? stripTags(input.country.trim())   : undefined,
    city:      input.city      ? stripTags(input.city.trim())      : undefined,
    stadium:   input.stadium   ? stripTags(input.stadium.trim())   : undefined,
    socialUrl: input.socialUrl?.trim(),
    imageUrl:  input.imageUrl?.trim(),
    message:   stripTags(input.message.trim()),
  };

  const saved = await store.create(doc);
  sendContactEmail(doc).catch((err) =>
    logger.error("[mailer] failed to send contact email", { err: (err as Error).message }),
  );
  return saved;
}

export async function deleteContact(id: string): Promise<boolean> {
  const store = await getContactStore();
  return store.remove(id);
}

export async function updateContact(
  id: string,
  input: UpdateContactInput,
): Promise<WithId<ContactSubmission> | null> {
  const store = await getContactStore();
  const patch: Partial<ContactSubmission> = {};

  if (typeof input.message === "string") {
    patch.message = stripTags(input.message.trim());
  }
  if (typeof input.approved === "boolean") {
    patch.approved = input.approved;
  }

  return store.update(id, patch);
}

export async function approveContact(
  id: string,
  approved: boolean,
): Promise<WithId<ContactSubmission> | null> {
  const store = await getContactStore();
  return store.approve(id, approved);
}

export async function listApprovedContacts(): Promise<WithId<ContactSubmission>[]> {
  const store = await getContactStore();
  return store.listApproved();
}
