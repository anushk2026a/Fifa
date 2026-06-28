import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Match Calendar — FIFA World Cup 2026 Schedule",
  description:
    "Browse the complete FIFA World Cup 2026 match schedule on an interactive calendar in US Eastern Time (ET). Click any date to see kick-off times, teams, and results.",
};

export default function ScheduleLayout({ children }: { children: React.ReactNode }) {
  return children;
}
