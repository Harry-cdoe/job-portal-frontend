"use client";

import { useMemo } from "react";
import { useApplyJob } from "@/features/applications/hooks/useApplyJob";
import { FiltersPanel } from "@/features/jobs/components/FiltersPanel";
import { JobCard, JobCardSkeleton } from "@/features/jobs/components/JobCard";
import { Pagination } from "@/features/jobs/components/Pagination";
import { SearchBar } from "@/features/jobs/components/SearchBar";
import { SortDropdown } from "@/features/jobs/components/SortDropdown";
import { useJobSearchState } from "@/features/jobs/hooks/useJobSearchState";
import { useJobs } from "@/features/jobs/hooks/useJobs";
import { Button } from "@/shared/ui/Button";
import { EmptyState } from "@/shared/ui/EmptyState";
import { ErrorState } from "@/shared/ui/ErrorState";
import { PageHeader } from "@/shared/ui/PageHeader";
import { Spinner } from "@/shared/ui/Spinner";

export default function JobsPage() {
  const { state, queryFilters, activeFilters, setKeyword, updateFilters, setSort, setPage, clearFilters } =
    useJobSearchState();

  const { data, isLoading, isFetching, isError, refetch } = useJobs(queryFilters);
  const { mutate: apply, isPending: isApplying } = useApplyJob();

  const jobs = data?.jobs ?? [];
  const hasResults = jobs.length > 0;
  const totalPages = data?.totalPages ?? 0;
  const totalJobs = data?.totalJobs ?? 0;

  const applyingLabel = useMemo(
    () => (
      <span className="inline-flex items-center gap-2">
        <Spinner className="h-3 w-3 border-[1.5px]" />
        Applying...
      </span>
    ),
    []
  );

  return (
    <section className="space-y-4">
      <PageHeader title="Browse Jobs" subtitle="Find relevant opportunities faster with smart filters." />

      <SearchBar value={state.keyword} onChange={setKeyword} onClear={() => setKeyword("")} />

      <div className="grid gap-4 lg:grid-cols-[280px,1fr]">
        <FiltersPanel
          location={state.location}
          minSalary={state.minSalary}
          maxSalary={state.maxSalary}
          experienceLevel={state.experienceLevel}
          jobType={state.jobType}
          activeFilters={activeFilters}
          onChange={updateFilters}
          onClear={clearFilters}
        />

        <div className="space-y-4">
          <div className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-white p-3 sm:flex-row sm:items-center sm:justify-between">
            <SortDropdown value={state.sort} onChange={setSort} />
            <p className="text-xs text-slate-500">{isFetching ? "Refreshing results..." : "Results are up to date"}</p>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              <JobCardSkeleton />
              <JobCardSkeleton />
              <JobCardSkeleton />
            </div>
          ) : null}

          {isError ? (
            <ErrorState title="Failed to load jobs" message="Please try again in a moment." onRetry={() => refetch()} />
          ) : null}

          {!isLoading && !isError && !hasResults ? (
            <EmptyState
              title="No jobs found"
              subtitle="Try broadening your filters or clearing search terms."
              action={
                <Button className="bg-slate-100 text-slate-700 hover:bg-slate-200" onClick={clearFilters}>
                  Clear all filters
                </Button>
              }
            />
          ) : null}

          <div className="space-y-3 transition-all duration-200">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                action={
                  <Button className="px-3 py-1 text-xs" disabled={isApplying} onClick={() => apply({ jobId: job.id })}>
                    {isApplying ? applyingLabel : "Apply"}
                  </Button>
                }
              />
            ))}
          </div>

          {!isLoading && !isError ? (
            <Pagination
              page={state.page}
              totalPages={totalPages}
              totalResults={totalJobs}
              isFetching={isFetching}
              onChange={setPage}
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}
