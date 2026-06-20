import type { ContactSubmission } from "./contact.repo";
import type { WithId } from "../../shared/db/json-store";
import { getContactStore } from "./contact.store";
import type { CreateContactInput } from "./contact.validation";

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
  return store.create(doc);
}

export async function deleteContact(id: string): Promise<boolean> {
  const store = await getContactStore();
  return store.remove(id);
}
