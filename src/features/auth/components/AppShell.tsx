"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useMemo } from "react";
import { logout } from "@/features/auth/api/auth.api";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { UserRole } from "@/features/auth/types";
import { cn } from "@/shared/lib/cn";
import { Button } from "@/shared/ui/Button";

type NavItem = { label: string; href: string };

const navByRole: Record<UserRole, NavItem[]> = {
  candidate: [
    { label: "Dashboard", href: "/candidate/dashboard" },
    { label: "Jobs", href: "/candidate/jobs" },
    { label: "Applications", href: "/candidate/applications" },
  ],
  company: [
    { label: "Dashboard", href: "/company/dashboard" },
    { label: "Create Job", href: "/company/jobs" },
    { label: "Applications", href: "/company/applications" },
  ],
  admin: [
    { label: "Candidate Area", href: "/candidate/dashboard" },
    { label: "Company Area", href: "/company/dashboard" },
  ],
};

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const clearSession = useAuthStore((s) => s.clearSession);

  const navItems = useMemo(() => {
    if (!user) return [];
    return navByRole[user.role];
  }, [user]);

  const onLogout = async () => {
    try {
      await logout();
    } finally {
      clearSession();
      router.replace("/login");
    }
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="container-app flex h-14 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-brand-500" />
            <div>
              <p className="text-sm font-semibold text-slate-900">Job Portal</p>
              <p className="text-xs text-slate-500">Demo Console</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium capitalize text-slate-700">
                {user.role}
              </span>
            ) : null}
            <Button className="px-3 py-1.5 text-xs" onClick={onLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container-app py-6">
        <div className="grid gap-6 md:grid-cols-[220px_1fr]">
          <aside className="card h-fit p-3">
            <nav className="space-y-1">
              {navItems.map((item) => {
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "block rounded-lg px-3 py-2 text-sm font-medium transition",
                      active ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>

          <main className="min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
