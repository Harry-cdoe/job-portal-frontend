import { memo, useMemo, useState } from "react";
import { Button } from "@/shared/ui/Button";
import { Skeleton } from "@/shared/ui/Skeleton";
import { StatusBadge } from "./StatusBadge";
import { StatusStepper } from "./StatusStepper";
import { UpdateStatusDropdown } from "./UpdateStatusDropdown";
import { ApplicationTimeline } from "./ApplicationTimeline";
import { normalizeApplicationStatus } from "../constants/status-pipeline";
import type {
  ApplicationPipelineStatus,
  CandidateApplicationDto,
  CompanyApplicationDto,
} from "../types";

type Props = {
  application: CandidateApplicationDto | CompanyApplicationDto;
  view: "candidate" | "company";
  isUpdating?: boolean;
  onUpdateStatus?: (payload: {
    id: number;
    nextStatus: ApplicationPipelineStatus;
    expectedCurrentStatus: ApplicationPipelineStatus;
  }) => void;
};

function ApplicationCardBase({ application, view, isUpdating, onUpdateStatus }: Props) {
  const [showTimeline, setShowTimeline] = useState(view === "candidate");
  const companyApp = view === "company" ? (application as CompanyApplicationDto) : null;
  const candidateApp = view === "candidate" ? (application as CandidateApplicationDto) : null;
  const latestNotes = useMemo(() => {
    const history = application.statusHistory ?? [];
    return history
      .slice()
      .reverse()
      .find((entry) => !!entry.notes)?.notes;
  }, [application.statusHistory]);

  const recruiterNotes = application.recruiterNotes ?? application.notes ?? latestNotes ?? null;

  return (
    <article className="card p-4">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="font-medium text-slate-900">{application.Job.title}</h2>
            {view === "candidate" ? (
              <p className="text-xs text-slate-500">{candidateApp?.Job.Company?.name ?? "Company"}</p>
            ) : (
              <>
                <p className="text-xs text-slate-500">
                  {companyApp?.User.name} ({companyApp?.User.email})
                </p>
                <p className="text-xs text-slate-500">{companyApp?.Job.location}</p>
              </>
            )}
          </div>
          <StatusBadge status={application.status} />
        </div>

        <StatusStepper status={application.status} />

        {view === "company" && onUpdateStatus ? (
          <UpdateStatusDropdown
            currentStatus={application.status}
            validTransitions={application.validTransitions}
            isPending={isUpdating}
            onUpdate={(nextStatus) =>
              onUpdateStatus({
                id: application.id,
                nextStatus,
                expectedCurrentStatus: normalizeApplicationStatus(application.status),
              })
            }
          />
        ) : null}

        {view === "candidate" && recruiterNotes ? (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Recruiter notes</p>
            <p className="mt-1 text-xs text-slate-700">{recruiterNotes}</p>
          </div>
        ) : null}

        <div>
          <Button
            className="h-8 bg-slate-100 px-3 py-0 text-xs text-slate-700 hover:bg-slate-200"
            onClick={() => setShowTimeline((prev) => !prev)}
          >
            {showTimeline ? "Hide timeline" : "View timeline"}
          </Button>
          {showTimeline ? (
            <div className="mt-3">
              <ApplicationTimeline applicationId={application.id} initialHistory={application.statusHistory} />
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function ApplicationCardSkeletonBase() {
  return (
    <div className="card space-y-3 p-4">
      <Skeleton className="h-5 w-1/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-10 w-44" />
    </div>
  );
}

export const ApplicationCard = memo(ApplicationCardBase);
export const ApplicationCardSkeleton = memo(ApplicationCardSkeletonBase);
