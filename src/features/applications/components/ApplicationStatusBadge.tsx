import type { ApplicationStatus } from "../types";

const statusClass: Record<ApplicationStatus, string> = {
  pending: "bg-amber-100 text-amber-700",
  accepted: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-700",
};

export function ApplicationStatusBadge({ status }: { status: ApplicationStatus }) {
  return <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusClass[status]}`}>{status}</span>;
}
