"use client";

import { useState } from "react";
import { JobCard } from "@/features/jobs/components/JobCard";
import { useJobs } from "@/features/jobs/hooks/useJobs";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { Input } from "@/shared/ui/Input";
import { Skeleton } from "@/shared/ui/Skeleton";
import { EmptyState } from "@/shared/ui/EmptyState";
import { Button } from "@/shared/ui/Button";
import { ErrorState } from "@/shared/ui/ErrorState";
import { PageHeader } from "@/shared/ui/PageHeader";
import { useApplyJob } from "@/features/applications/hooks/useApplyJob";

export default function JobsPage() {
  const [search, setSearch] = useState("");
  const debounced = useDebounce(search, 350);
  const { data, isLoading, isError, refetch } = useJobs({
    search: debounced,
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "DESC",
  });
  const { mutate: apply, isPending: isApplying } = useApplyJob();

  return (
    <section>
      <PageHeader title="Browse Jobs" subtitle="Search relevant openings and apply with one click." />

      <div className="card p-4">
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">Search</label>
        <Input placeholder="Search by title or description" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="mt-5 grid gap-4">
        {isLoading && (
          <>
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </>
        )}

        {isError ? <ErrorState title="Failed to load jobs" message="Check backend availability and try again." onRetry={() => refetch()} /> : null}

        {!isLoading && !isError && (data?.jobs.length ?? 0) === 0 ? (
          <EmptyState title="No jobs found" subtitle="Try changing your filters or search text." />
        ) : null}

        {data?.jobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            action={
              <Button className="px-3 py-1 text-xs" disabled={isApplying} onClick={() => apply({ jobId: job.id })}>
                Apply
              </Button>
            }
          />
        ))}
      </div>
    </section>
  );
}
