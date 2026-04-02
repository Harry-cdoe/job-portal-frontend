import Link from "next/link";
import { Button } from "@/shared/ui/Button";

export default function ForbiddenPage() {
  return (
    <main className="container-app py-14">
      <div className="card mx-auto max-w-xl p-8 text-center">
        <h1 className="text-2xl font-semibold">Access Restricted</h1>
        <p className="mt-2 text-sm text-slate-600">Your current role does not have permission to access this section.</p>
        <Link href="/login" className="mt-5 inline-block">
          <Button>Go To Login</Button>
        </Link>
      </div>
    </main>
  );
}
