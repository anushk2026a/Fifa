"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Trophy,
  Newspaper,
  Users,
  LogOut,
  PanelLeft,
  X,
} from "lucide-react";
import Image from "next/image";
import logo from "../../../public/logo/fifalogo.png";

const NAV = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
  { label: "Matches", href: "/admin/matches", icon: Trophy, exact: true },
  { label: "News", href: "/admin/news", icon: Newspaper, exact: false },
  {
    label: "Experiences",
    href: "/admin/experiences",
    icon: Users,
    exact: false,
  },
];

interface Props {
  mobileOpen: boolean;
  onMobileClose: () => void;
  onLogout: () => void;
  pendingCount?: number;
}

export function AdminSidebar({
  mobileOpen,
  onMobileClose,
  onLogout,
  pendingCount = 0,
}: Props) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  function isActive(item: (typeof NAV)[0]) {
    return item.exact ? pathname === item.href : pathname.startsWith(item.href);
  }

  const inner = (
    <div className="flex h-full flex-col">
      {/* Logo row */}
      <div
        className={`flex h-15 shrink-0 items-center border-b border-line px-4 ${
          collapsed ? "justify-center" : "justify-between"
        }`}
      >
        {!collapsed && (
          <Link href="/admin" onClick={onMobileClose}>
            <div className="h-7 w-18">
              <Image
                src={logo}
                alt="FIFA One Point"
                className="h-full w-full object-contain"
                priority
              />
            </div>
          </Link>
        )}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="hidden lg:flex h-7 w-7 items-center justify-center rounded text-faint hover:text-ink transition-colors cursor-pointer"
          title={collapsed ? "Expand" : "Collapse"}
        >
          <PanelLeft
            className={`h-4 w-4 transition-transform duration-200 ${collapsed ? "rotate-180" : ""}`}
          />
        </button>
        <button
          onClick={onMobileClose}
          className="lg:hidden h-7 w-7 flex items-center justify-center rounded text-faint hover:text-ink cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = isActive(item);
          const showBadge =
            item.href === "/admin/experiences" && pendingCount > 0;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onMobileClose}
              title={collapsed ? item.label : undefined}
              className={`group flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                collapsed ? "justify-center" : ""
              } ${
                active
                  ? "bg-accent/8 text-accent font-semibold border-r-2 border-accent"
                  : "text-muted hover:text-ink hover:bg-paper"
              }`}
            >
              <Icon className="h-4.5 w-4.5 shrink-0" />
              {!collapsed && (
                <span className="flex-1 leading-none">{item.label}</span>
              )}
              {!collapsed && showBadge && (
                <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-white">
                  {pendingCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-line p-4">
        <button
          onClick={onLogout}
          title={collapsed ? "Sign out" : undefined}
          className={`flex items-center gap-3 text-sm text-muted hover:text-ink transition-colors cursor-pointer ${
            collapsed ? "justify-center w-full" : ""
          }`}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Sign out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside
        className={`hidden lg:flex flex-col bg-white border-r border-line shrink-0 transition-all duration-200 ${
          collapsed ? "w-15" : "w-56"
        }`}
      >
        {inner}
      </aside>
      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-56 flex-col bg-white border-r border-line transition-transform duration-200 lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {inner}
      </aside>
    </>
  );
}
