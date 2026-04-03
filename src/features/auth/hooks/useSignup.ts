import { useMutation } from "@tanstack/react-query";
import { signup } from "../api/auth.api";
import type { SignupRequestDto, SignupResponseDto } from "../types";
import { apiHandler } from "@/utils/apiHandler";

export function useSignup() {
  return useMutation<SignupResponseDto, unknown, SignupRequestDto>({
    mutationFn: (payload) =>
      apiHandler(() => signup(payload), {
        loading: "Creating account...",
        success: "Account created successfully \uD83C\uDF89",
        error: "Signup failed",
      }),
  });
}
