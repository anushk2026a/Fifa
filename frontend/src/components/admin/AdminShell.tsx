"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopBar } from "./AdminTopBar";
import { authFetch, logout } from "@/lib/admin-auth";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  const loadPending = useCallback(async () => {
    try {
      const res = await authFetch("/contact", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      if (data.ok) {
        setPendingCount(
          (data.contacts as { approved?: boolean }[]).filter((c) => !c.approved).length,
        );
      }
    } catch { /* offline */ }
  }, []);

  useEffect(() => {
    // Validate the session by calling /auth/me with the HttpOnly cookie.
    // The browser sends the cookie automatically — no localStorage needed.
    authFetch("/auth/me")
      .then((res) => {
        if (!res.ok) {
          router.replace("/admin/login");
        } else {
          setReady(true);
          loadPending();
        }
      })
      .catch(() => setReady(true));
  }, [router, loadPending]);

  async function handleLogout() {
    await logout();
    router.replace("/admin/login");
  }

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-paper">
      {mobileOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <AdminSidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        onLogout={handleLogout}
        pendingCount={pendingCount}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminTopBar
          onMobileMenuToggle={() => setMobileOpen((o) => !o)}
          onLogout={handleLogout}
        />
        <main className="flex-1 overflow-y-auto p-5">{children}</main>
      </div>
    </div>
  );
}
