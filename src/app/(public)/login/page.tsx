import { LoginForm } from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <main className="container-app py-12">
      <div className="mx-auto max-w-md rounded-xl bg-white p-6 shadow-sm">
        <h1 className="mb-4 text-2xl font-semibold">Login</h1>
        <LoginForm />
      </div>
    </main>
  );
}
