import { JsonCollection } from "../../shared/db/json-store";

export type ContactSubmission = {
  name: string;
  email: string;
  phone?: string;
  country?: string;
  city?: string;
  stadium?: string;
  socialUrl?: string;
  youtube?: string;
  facebook?: string;
  instagram?: string;
  x?: string;
  message: string;
  approved?: boolean;
};

export const contactRepo = new JsonCollection<ContactSubmission>("contacts");
