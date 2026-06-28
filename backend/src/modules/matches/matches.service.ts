import type { Match } from "./matches.repo";
import type { WithId } from "../../shared/db/json-store";
import { getMatchesStore } from "./matches.store";
import type { CreateMatchInput, UpdateMatchInput } from "./matches.validation";

export async function listMatches(): Promise<WithId<Match>[]> {
  const store = await getMatchesStore();
  const rows = await store.list();
  return rows.sort((a, b) => a.kickoffUtc.localeCompare(b.kickoffUtc));
}

export async function createMatch(input: CreateMatchInput): Promise<WithId<Match>> {
  const store = await getMatchesStore();
  const doc: Match = {
    kickoffUtc: input.kickoffUtc,
    citySlug: input.citySlug.trim().toLowerCase(),
    stadium: input.stadium.trim(),
    home: {
      name: input.home.name.trim(),
      code: input.home.code.trim().toUpperCase(),
      score: input.home.score,
    },
    away: {
      name: input.away.name.trim(),
      code: input.away.code.trim().toUpperCase(),
      score: input.away.score,
    },
    status: input.status,
  };
  return store.create(doc);
}

export async function updateMatch(id: string, input: UpdateMatchInput): Promise<WithId<Match> | null> {
  const store = await getMatchesStore();
  return store.update(id, input);
}

export async function deleteMatch(id: string): Promise<boolean> {
  const store = await getMatchesStore();
  return store.remove(id);
}
