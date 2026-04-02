"use client";

import { useJobDetails } from "@/features/jobs/hooks/useJobDetails";
import { Skeleton } from "@/shared/ui/Skeleton";
import { ErrorState } from "@/shared/ui/ErrorState";
import { PageHeader } from "@/shared/ui/PageHeader";

export default function JobDetailsPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  const { data, isLoading, isError, error, refetch } = useJobDetails(id);

  if (isLoading) {
    return (
      <section className="space-y-3">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-20 w-full" />
      </section>
    );
  }

  if (isError || !data) {
    return (
      <ErrorState
        title="Unable to load job details"
        message={String(error) || "Try again later."}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <section>
      <PageHeader title={data.title} subtitle={`${data.location} • Salary: ${data.salary}`} />
      <article className="card p-5">
        <p className="text-sm leading-6 text-slate-700">{data.description}</p>
        <p className="mt-4 text-sm text-slate-500">Company: {data.Company?.name ?? "N/A"}</p>
      </article>
    </section>
  );
}
