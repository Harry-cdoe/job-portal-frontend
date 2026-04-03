"use client";

import { ApplicationCard, ApplicationCardSkeleton } from "@/features/applications/components/ApplicationCard";
import { useApplications } from "@/features/applications/hooks/useApplications";
import { EmptyState } from "@/shared/ui/EmptyState";
import { ErrorState } from "@/shared/ui/ErrorState";
import { PageHeader } from "@/shared/ui/PageHeader";

export default function ApplicationsPage() {
  const { data, isLoading, isError, refetch } = useApplications("candidate");

  return (
    <section>
      <PageHeader title="My Applications" subtitle="Track the current status of each job application." />

      {isLoading ? (
        <div className="space-y-3">
          <ApplicationCardSkeleton />
          <ApplicationCardSkeleton />
        </div>
      ) : null}

      {isError ? <ErrorState title="Unable to fetch applications" onRetry={() => refetch()} /> : null}

      {!isLoading && !isError && (data?.length ?? 0) === 0 ? (
        <EmptyState title="No applications yet" subtitle="Apply to jobs and track status here." />
      ) : null}

      <div className="space-y-3">
        {data?.map((app) => (
          <ApplicationCard key={app.id} application={app} view="candidate" />
        ))}
      </div>
    </section>
  );
}
