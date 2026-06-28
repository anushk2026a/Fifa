export type MatchTeam = {
  name: string;
  code: string;
  score?: number;
};

export type Match = {
  kickoffUtc: string;
  citySlug: string;
  stadium: string;
  home: MatchTeam;
  away: MatchTeam;
  status: "scheduled" | "live" | "finished";
};
