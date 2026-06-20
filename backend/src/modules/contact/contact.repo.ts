import { JsonCollection } from "../../shared/db/json-store";

export type ContactSubmission = {
  name: string;
  email: string;
  phone?: string;
  country?: string;
  city?: string;
  youtube?: string;
  facebook?: string;
  instagram?: string;
  x?: string;
  message: string;
};

export const contactRepo = new JsonCollection<ContactSubmission>("contacts");
