"use client";

import { useEffect } from "react";
import { me, refresh } from "../api/auth.api";
import { useAuthStore } from "../store/auth.store";

export function useHydrateAuth(enabled = true) {
  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const setUser = useAuthStore((s) => s.setUser);
  const clearSession = useAuthStore((s) => s.clearSession);
  const setHydrating = useAuthStore((s) => s.setHydrating);

  useEffect(() => {
    if (!enabled) {
      setHydrating(false);
      return;
    }

    const existingState = useAuthStore.getState();
    if (existingState.user) {
      setHydrating(false);
      return;
    }

    let mounted = true;
    setHydrating(true);

    (async () => {
      try {
        const currentUser = await me();
        if (mounted) setUser(currentUser);
      } catch {
        try {
          const refreshed = await refresh();
          if (mounted) setAccessToken(refreshed.accessToken);

          const currentUser = await me();
          if (mounted) setUser(currentUser);
        } catch {
          if (mounted) clearSession();
        }
      } finally {
        if (mounted) setHydrating(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [enabled, setAccessToken, setUser, clearSession, setHydrating]);
}
