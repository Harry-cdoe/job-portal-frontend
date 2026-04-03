"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Toaster } from "react-hot-toast";
import { queryClient } from "@/shared/api/query-client";
import { setupInterceptors } from "@/shared/api/interceptors";
import { useHydrateAuth } from "@/features/auth/hooks/useHydrateAuth";

export function Providers({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const shouldHydrateAuth =
    pathname?.startsWith("/candidate") ||
    pathname?.startsWith("/company") ||
    pathname?.startsWith("/admin");

  useHydrateAuth(Boolean(shouldHydrateAuth));

  useEffect(() => {
    const cleanup = setupInterceptors();
    return cleanup;
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster position="top-right" />
    </QueryClientProvider>
  );
}
