import { JsonCollection } from "../../shared/db/json-store";

export type News = {
  title: string;
  date: string; // YYYY-MM-DD
  summary: string;
  url: string;
  source?: string;
  image?: string;
};

export const newsRepo = new JsonCollection<News>("news");
