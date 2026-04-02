"use client";

import { Button } from "@/shared/ui/Button";

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="container-app py-12">
      <h2 className="text-xl font-semibold">Something went wrong.</h2>
      <p className="mt-2 text-slate-600">Try reloading this section.</p>
      <Button className="mt-4" onClick={reset}>
        Retry
      </Button>
    </main>
  );
}
