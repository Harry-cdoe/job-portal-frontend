"use client";

import { useApplications } from "@/features/applications/hooks/useApplications";
import { ApplicationStatusBadge } from "@/features/applications/components/ApplicationStatusBadge";
import { EmptyState } from "@/shared/ui/EmptyState";
import { Skeleton } from "@/shared/ui/Skeleton";
import { ErrorState } from "@/shared/ui/ErrorState";
import { PageHeader } from "@/shared/ui/PageHeader";

export default function ApplicationsPage() {
  const { data, isLoading, isError, refetch } = useApplications("candidate");

  return (
    <section>
      <PageHeader title="My Applications" subtitle="Track the current status of each job application." />

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      ) : null}

      {isError ? <ErrorState title="Unable to fetch applications" onRetry={() => refetch()} /> : null}

      {!isLoading && !isError && (data?.length ?? 0) === 0 ? (
        <EmptyState title="No applications yet" subtitle="Apply to jobs and track status here." />
      ) : null}

      <div className="space-y-3">
        {data?.map((app) => (
          <article key={app.id} className="card p-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-medium">{app.Job.title}</h2>
                <p className="text-xs text-slate-500">{app.Job.Company?.name ?? "Company"}</p>
              </div>
              <ApplicationStatusBadge status={app.status} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
