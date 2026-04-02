"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, type SignupSchema } from "../schema";
import { useSignup } from "../hooks/useSignup";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";

export function SignupForm() {
  const router = useRouter();
  const { mutateAsync, isPending, error } = useSignup();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
    defaultValues: { role: "candidate" },
  });

  const onSubmit = handleSubmit(async (values) => {
    await mutateAsync(values);
    router.replace("/login");
  });

  return (
    <form className="space-y-3" onSubmit={onSubmit}>
      <div>
        <Input placeholder="Full name" {...register("name")} />
        {errors.name ? <p className="mt-1 text-xs text-red-600">{errors.name.message}</p> : null}
      </div>

      <div>
        <Input type="email" placeholder="Email" {...register("email")} />
        {errors.email ? <p className="mt-1 text-xs text-red-600">{errors.email.message}</p> : null}
      </div>

      <div>
        <Input type="password" placeholder="Password" {...register("password")} />
        {errors.password ? <p className="mt-1 text-xs text-red-600">{errors.password.message}</p> : null}
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-slate-600">Role</label>
        <select className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm" {...register("role")}>
          <option value="candidate">Candidate</option>
          <option value="company">Company</option>
        </select>
      </div>

      {error ? <p className="text-xs text-red-600">Signup failed. Try with a different email.</p> : null}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Creating account..." : "Sign up"}
      </Button>
    </form>
  );
}
