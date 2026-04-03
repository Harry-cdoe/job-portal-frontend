"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { loginSchema, type LoginSchema } from "../schema";
import { useLogin } from "../hooks/useLogin";
import { useAuthStore } from "../store/auth.store";
import { getApiErrorMessage } from "@/shared/api/errors";
import { Input } from "@/shared/ui/Input";
import { Button } from "@/shared/ui/Button";
import { Spinner } from "@/shared/ui/Spinner";

function defaultPathByRole(role: "candidate" | "company" | "admin") {
  if (role === "company") return "/company/dashboard";
  if (role === "admin") return "/candidate/dashboard";
  return "/candidate/dashboard";
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
    if (isPending) return;

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

      {error ? <p className="text-xs text-red-600">{getApiErrorMessage(error, "Login failed")}</p> : null}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? (
          <span className="inline-flex items-center gap-2">
            <Spinner />
            Signing in...
          </span>
        ) : (
          "Login"
        )}
      </Button>
    </form>
  );
}
