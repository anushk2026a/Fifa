"use client";

import { usePathname } from "next/navigation";
import { Menu, LogOut } from "lucide-react";

const TITLES: [string, string, boolean][] = [
  ["/admin/matches", "Matches", false],
  ["/admin/news", "News", false],
  ["/admin/experiences", "Share Your Experiences", false],
  ["/admin", "Dashboard", true],
];

function pageTitle(pathname: string): string {
  for (const [path, label, exact] of TITLES) {
    if (exact ? pathname === path : pathname.startsWith(path)) return label;
  }
  return "Dashboard";
}

interface Props {
  onMobileMenuToggle: () => void;
  onLogout: () => void;
}

export function AdminTopBar({ onMobileMenuToggle, onLogout }: Props) {
  const pathname = usePathname();

  return (
    <header className="flex h-15 shrink-0 items-center justify-between border-b border-line bg-surface px-5">
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuToggle}
          className="lg:hidden -ml-1 flex h-8 w-8 items-center justify-center rounded text-muted hover:text-ink transition-colors cursor-pointer"
        >
          <Menu className="h-5 w-5" />
        </button>
        <span className="text-sm font-semibold text-ink">{pageTitle(pathname)}</span>
      </div>

      <button
        onClick={onLogout}
        className="flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs font-medium text-muted hover:bg-paper hover:text-ink transition-colors cursor-pointer"
      >
        <LogOut className="h-3.5 w-3.5" />
        <span className="hidden sm:block">Sign out</span>
      </button>
    </header>
  );
}
