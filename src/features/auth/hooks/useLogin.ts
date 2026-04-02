import { useMutation } from "@tanstack/react-query";
import { login, me } from "../api/auth.api";
import { useAuthStore } from "../store/auth.store";

export function useLogin() {
  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: login,
    onSuccess: async (data) => {
      if (data.accessToken) {
        setAccessToken(data.accessToken);
      }

      if (data.user) {
        setUser(data.user);
        return;
      }

      try {
        const currentUser = await me();
        setUser(currentUser);
      } catch {
        // Login already succeeded; don't fail the mutation if profile fetch is unavailable.
      }
    },
  });
}
