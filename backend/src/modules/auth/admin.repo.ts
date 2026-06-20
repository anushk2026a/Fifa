import { JsonCollection } from "../../shared/db/json-store";

export type Admin = {
  email: string;
  passwordHash: string;
  name: string;
  role: "admin";
};

export const adminRepo = new JsonCollection<Admin>("admins");
