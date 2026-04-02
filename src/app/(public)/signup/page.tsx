import { SignupForm } from "@/features/auth/components/SignupForm";

export default function SignupPage() {
  return (
    <main className="container-app py-12">
      <div className="mx-auto max-w-md rounded-xl bg-white p-6 shadow-sm">
        <h1 className="mb-4 text-2xl font-semibold">Sign up</h1>
        <SignupForm />
      </div>
    </main>
  );
}
 