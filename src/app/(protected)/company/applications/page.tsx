"use client";

import { useApplications } from "@/features/applications/hooks/useApplications";
import { useUpdateApplicationStatus } from "@/features/applications/hooks/useUpdateApplicationStatus";
import { ApplicationStatusBadge } from "@/features/applications/components/ApplicationStatusBadge";
import { Button } from "@/shared/ui/Button";
import { EmptyState } from "@/shared/ui/EmptyState";
import { ErrorState } from "@/shared/ui/ErrorState";
import { PageHeader } from "@/shared/ui/PageHeader";

export default function CompanyApplicationsPage() {
  const { data, isLoading, isError, refetch } = useApplications("company");
  const { mutate, isPending } = useUpdateApplicationStatus();

  return (
    <section>
      <PageHeader title="Incoming Applications" subtitle="Review candidates and update decisions quickly." />

      {isLoading ? <p className="text-sm text-slate-600">Loading applications...</p> : null}
      {isError ? <ErrorState title="Unable to load applications" onRetry={() => refetch()} /> : null}

      {!isLoading && !isError && (data?.length ?? 0) === 0 ? (
        <EmptyState title="No applicants yet" subtitle="Applications for your jobs will appear here." />
      ) : null}

      <div className="space-y-3">
        {data?.map((app) => (
          <article key={app.id} className="card p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-medium">{app.Job.title}</h2>
                <p className="text-xs text-slate-500">{app.User.name} ({app.User.email})</p>
                <p className="text-xs text-slate-500">{app.Job.location}</p>
              </div>

              <div className="flex flex-col items-end gap-2">
                <ApplicationStatusBadge status={app.status} />
                <div className="flex gap-2">
                  <Button
                    className="px-3 py-1 text-xs"
                    disabled={isPending || app.status !== "pending"}
                    onClick={() => mutate({ id: app.id, status: "accepted" })}
                  >
                    Accept
                  </Button>
                  <Button
                    className="bg-red-600 px-3 py-1 text-xs hover:bg-red-700"
                    disabled={isPending || app.status !== "pending"}
                    onClick={() => mutate({ id: app.id, status: "rejected" })}
                  >
                    Reject
                  </Button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
