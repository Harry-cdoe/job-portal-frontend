"use client";

import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { loginSchema, type LoginSchema } from "../schema";
import { useLogin } from "../hooks/useLogin";
import { useAuthStore } from "../store/auth.store";
import { Input } from "@/shared/ui/Input";
import { Button } from "@/shared/ui/Button";

function defaultPathByRole(role: "candidate" | "company" | "admin") {
  if (role === "company") return "/company/dashboard";
  if (role === "admin") return "/candidate/dashboard";
  return "/candidate/dashboard";
}

function getLoginErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return "Network/CORS issue: ensure backend is running on http://localhost:8000 and frontend origin exactly matches backend CORS_ORIGIN.";
    }

    const message = (error.response.data as { message?: string } | undefined)?.message;
    return message ?? "Login failed.";
  }

  return "Login failed.";
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next");
  const { mutateAsync, isPending, error } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = handleSubmit(async (values) => {
    const loginResult = await mutateAsync(values);
    const currentRole = loginResult.user?.role ?? useAuthStore.getState().user?.role ?? "candidate";
    const fallback = defaultPathByRole(currentRole);
    router.replace(nextPath || fallback);
  });

  return (
    <form className="space-y-3" onSubmit={onSubmit}>
      <div>
        <Input type="email" placeholder="Email" {...register("email")} />
        {errors.email ? <p className="mt-1 text-xs text-red-600">{errors.email.message}</p> : null}
      </div>
      <div>
        <Input type="password" placeholder="Password" {...register("password")} />
        {errors.password ? <p className="mt-1 text-xs text-red-600">{errors.password.message}</p> : null}
      </div>

      {error ? <p className="text-xs text-red-600">{getLoginErrorMessage(error)}</p> : null}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Signing in..." : "Login"}
      </Button>
    </form>
  );
}
