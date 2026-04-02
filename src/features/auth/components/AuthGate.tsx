"use client";

import { ReactNode, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useShallow } from "zustand/react/shallow";
import { useAuthStore } from "../store/auth.store";
import { UserRole } from "../types";
import { Skeleton } from "@/shared/ui/Skeleton";

function roleAllowed(pathname: string, role: UserRole) {
  if (pathname.startsWith("/candidate")) return role === "candidate" || role === "admin";
  if (pathname.startsWith("/company")) return role === "company" || role === "admin";
  return true;
}

export function AuthGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const redirectingTo = useRef<string | null>(null);
  const { user, isHydrating } = useAuthStore(useShallow((s) => ({ user: s.user, isHydrating: s.isHydrating })));

  useEffect(() => {
    if (isHydrating) return;

    if (!user) {
      const target = `/login?next=${encodeURIComponent(pathname)}`;
      if (redirectingTo.current === target) return;
      redirectingTo.current = target;
      router.replace(target);
      return;
    }

    if (!roleAllowed(pathname, user.role)) {
      if (redirectingTo.current === "/forbidden") return;
      redirectingTo.current = "/forbidden";
      router.replace("/forbidden");
      return;
    }

    redirectingTo.current = null;
  }, [isHydrating, user, pathname, router]);

  if (isHydrating || !user) {
    return (
      <div className="container-app py-8">
        <div className="space-y-3">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
