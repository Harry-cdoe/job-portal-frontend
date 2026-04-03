"use client";

import { useCallback } from "react";
import { ApplicationCard, ApplicationCardSkeleton } from "@/features/applications/components/ApplicationCard";
import { useApplications } from "@/features/applications/hooks/useApplications";
import { useUpdateApplicationStatus } from "@/features/applications/hooks/useUpdateApplicationStatus";
import type { ApplicationPipelineStatus } from "@/features/applications/types";
import { EmptyState } from "@/shared/ui/EmptyState";
import { ErrorState } from "@/shared/ui/ErrorState";
import { PageHeader } from "@/shared/ui/PageHeader";

export default function CompanyApplicationsPage() {
  const { data, isLoading, isError, refetch } = useApplications("company");
  const { mutate, isPending, variables } = useUpdateApplicationStatus();

  const handleStatusUpdate = useCallback(
    (payload: { id: number; nextStatus: ApplicationPipelineStatus; expectedCurrentStatus: ApplicationPipelineStatus }) =>
      mutate({
        id: payload.id,
        status: payload.nextStatus,
        expectedCurrentStatus: payload.expectedCurrentStatus,
      }),
    [mutate]
  );

  return (
    <section>
      <PageHeader title="Incoming Applications" subtitle="Review candidates and update decisions quickly." />

      {isLoading ? (
        <div className="space-y-3">
          <ApplicationCardSkeleton />
          <ApplicationCardSkeleton />
        </div>
      ) : null}

      {isError ? <ErrorState title="Unable to load applications" onRetry={() => refetch()} /> : null}

      {!isLoading && !isError && (data?.length ?? 0) === 0 ? (
        <EmptyState title="No applicants yet" subtitle="Applications for your jobs will appear here." />
      ) : null}

      <div className="space-y-3">
        {data?.map((app) => (
          <ApplicationCard
            key={app.id}
            application={app}
            view="company"
            isUpdating={isPending && variables?.id === app.id}
            onUpdateStatus={handleStatusUpdate}
          />
        ))}
      </div>
    </section>
  );
}
