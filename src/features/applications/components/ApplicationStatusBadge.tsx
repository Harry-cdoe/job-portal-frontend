import type { ApplicationStatus } from "../types";
import { StatusBadge } from "./StatusBadge";

export function ApplicationStatusBadge({ status }: { status: ApplicationStatus }) {
  return <StatusBadge status={status} />;
}
