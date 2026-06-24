import type { ContactSubmission } from "./contact.repo";
import type { WithId } from "../../shared/db/json-store";
import { getContactStore } from "./contact.store";
import type { CreateContactInput, UpdateContactInput } from "./contact.validation";
import { sendContactEmail } from "../../shared/mailer";

export async function listContacts(): Promise<WithId<ContactSubmission>[]> {
  const store = await getContactStore();
  return store.list();
}

export async function createContact(input: CreateContactInput): Promise<WithId<ContactSubmission>> {
  const store = await getContactStore();
  const doc: ContactSubmission = {
    name: input.name.trim(),
    email: input.email.trim(),
    phone: input.phone?.trim(),
    country: input.country?.trim(),
    city: input.city?.trim(),
    youtube: input.youtube?.trim(),
    facebook: input.facebook?.trim(),
    instagram: input.instagram?.trim(),
    x: input.x?.trim(),
    message: input.message.trim(),
  };
  const saved = await store.create(doc);
  sendContactEmail(doc).catch((err) =>
    console.error("[mailer] failed to send contact email:", err)
  );
  return saved;
}

export async function deleteContact(id: string): Promise<boolean> {
  const store = await getContactStore();
  return store.remove(id);
}

export async function updateContact(id: string, input: UpdateContactInput): Promise<WithId<ContactSubmission> | null> {
  const store = await getContactStore();
  const patch: Partial<ContactSubmission> = {};

  if (typeof input.message === "string") {
    patch.message = input.message.trim();
  }

  if (typeof input.approved === "boolean") {
    patch.approved = input.approved;
  }

  return store.update(id, patch);
}

export async function approveContact(id: string, approved: boolean): Promise<WithId<ContactSubmission> | null> {
  const store = await getContactStore();
  return store.approve(id, approved);
}

export async function listApprovedContacts(): Promise<WithId<ContactSubmission>[]> {
  const store = await getContactStore();
  return store.listApproved();
}
