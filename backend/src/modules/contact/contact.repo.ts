import { JsonCollection } from "../../shared/db/json-store";

export type ContactSubmission = {
  name: string;
  email: string;
  phone?: string;
  country?: string;
  city?: string;
  stadium?: string;
  socialUrl?: string;
  imageUrl?: string;
  message: string;
  approved?: boolean;
};

export const contactRepo = new JsonCollection<ContactSubmission>("contacts");
