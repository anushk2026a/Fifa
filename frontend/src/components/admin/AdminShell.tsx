"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopBar } from "./AdminTopBar";
import { getToken, clearToken, authHeaders } from "@/lib/admin-auth";
import { apiUrl } from "@/lib/api";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  const loadPending = useCallback(async () => {
    try {
      const res = await fetch(apiUrl("/contact"), { headers: authHeaders(), cache: "no-store" });
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
    if (!getToken()) { router.replace("/admin/login"); return; }
    fetch(apiUrl("/auth/me"), { headers: authHeaders() })
      .then((res) => {
        if (!res.ok) { clearToken(); router.replace("/admin/login"); }
        else { setReady(true); loadPending(); }
      })
      .catch(() => setReady(true));
  }, [router, loadPending]);

  function logout() { clearToken(); router.replace("/admin/login"); }

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
        <div className="fixed inset-0 z-20 bg-black/40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}
      <AdminSidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        onLogout={logout}
        pendingCount={pendingCount}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminTopBar onMobileMenuToggle={() => setMobileOpen((o) => !o)} onLogout={logout} />
        <main className="flex-1 overflow-y-auto p-5">{children}</main>
      </div>
    </div>
  );
}
