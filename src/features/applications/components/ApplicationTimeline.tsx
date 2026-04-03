import { memo, useMemo } from "react";
import { useApplicationHistory } from "../hooks/useApplicationHistory";
import { normalizeApplicationStatus, STATUS_LABELS } from "../constants/status-pipeline";
import { Skeleton } from "@/shared/ui/Skeleton";
import type { ApplicationHistoryItemDto } from "../types";

function formatTimestamp(raw?: string) {
  if (!raw) return "Unknown time";
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return "Unknown time";

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function actorName(changedBy?: ApplicationHistoryItemDto["changedBy"]) {
  if (!changedBy) return "System";
  if (typeof changedBy === "string") return changedBy;
  return changedBy.name ?? changedBy.email ?? "Recruiter";
}

function sortChronological(items: ApplicationHistoryItemDto[]) {
  return [...items].sort((a, b) => {
    const aTime = new Date(a.changedAt ?? a.createdAt ?? a.timestamp ?? "").getTime();
    const bTime = new Date(b.changedAt ?? b.createdAt ?? b.timestamp ?? "").getTime();
    const left = Number.isNaN(aTime) ? 0 : aTime;
    const right = Number.isNaN(bTime) ? 0 : bTime;
    return left - right;
  });
}

function ApplicationTimelineBase({
  applicationId,
  initialHistory,
  enabled = true,
}: {
  applicationId: number;
  initialHistory?: ApplicationHistoryItemDto[];
  enabled?: boolean;
}) {
  const shouldFetch = !initialHistory || initialHistory.length === 0;
  const { data, isLoading, isError } = useApplicationHistory(applicationId, enabled && shouldFetch);

  const history = useMemo(
    () => sortChronological((initialHistory && initialHistory.length > 0 ? initialHistory : data) ?? []),
    [data, initialHistory]
  );

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
      </div>
    );
  }

  if (isError) {
    return <p className="text-xs text-red-600">Could not load timeline right now.</p>;
  }

  if (history.length === 0) {
    return <p className="text-xs text-slate-500">No timeline updates yet.</p>;
  }

  return (
    <ol className="space-y-3">
      {history.map((item, index) => {
        const from = item.fromStatus ? STATUS_LABELS[normalizeApplicationStatus(item.fromStatus)] : "Created";
        const to = STATUS_LABELS[normalizeApplicationStatus(item.toStatus)];

        return (
          <li key={item.id ?? `${item.toStatus}-${index}`} className="flex gap-3">
            <div className="flex w-4 flex-col items-center">
              <span className="mt-1 h-2.5 w-2.5 rounded-full bg-brand-500" />
              {index !== history.length - 1 ? <span className="mt-1 h-full w-px bg-slate-200" /> : null}
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-medium text-slate-800">
                {from} to {to}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                By {actorName(item.changedBy)} on {formatTimestamp(item.changedAt ?? item.createdAt ?? item.timestamp)}
              </p>
              {item.notes ? <p className="mt-2 text-xs text-slate-700">{item.notes}</p> : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export const ApplicationTimeline = memo(ApplicationTimelineBase);
