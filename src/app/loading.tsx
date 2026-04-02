import { Skeleton } from "@/shared/ui/Skeleton";

export default function GlobalLoading() {
  return (
    <main className="container-app py-8">
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    </main>
  );
}
