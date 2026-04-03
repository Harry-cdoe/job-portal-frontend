import { useMutation } from "@tanstack/react-query";
import { login, me } from "../api/auth.api";
import { useAuthStore } from "../store/auth.store";
import type { LoginRequestDto, LoginResponseDto } from "../types";
import { apiHandler } from "@/utils/apiHandler";

export function useLogin() {
  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation<LoginResponseDto, unknown, LoginRequestDto>({
    mutationFn: (payload) =>
      apiHandler(() => login(payload), {
        loading: "Logging in...",
        success: "Welcome back \uD83D\uDC4B",
        error: "Login failed",
      }),
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
