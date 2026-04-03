import type { ApplicationPipelineStatus, ApplicationStatus } from "../types";

export const APPLICATION_PIPELINE_STEPS: ApplicationPipelineStatus[] = [
  "applied",
  "under_review",
  "shortlisted",
  "rejected",
  "hired",
];

export const STATUS_LABELS: Record<ApplicationPipelineStatus, string> = {
  applied: "Applied",
  under_review: "Under review",
  shortlisted: "Shortlisted",
  rejected: "Rejected",
  hired: "Hired",
};

export const DEFAULT_VALID_TRANSITIONS: Record<ApplicationPipelineStatus, ApplicationPipelineStatus[]> = {
  applied: ["under_review"],
  under_review: ["shortlisted", "rejected"],
  shortlisted: ["hired", "rejected"],
  rejected: [],
  hired: [],
};

export function normalizeApplicationStatus(status: ApplicationStatus): ApplicationPipelineStatus {
  if (status === "pending") return "applied";
  if (status === "accepted") return "hired";
  return status;
}

export function getValidTransitions(
  status: ApplicationStatus,
  backendTransitions?: ApplicationStatus[]
): ApplicationPipelineStatus[] {
  if (backendTransitions && backendTransitions.length > 0) {
    return backendTransitions.map(normalizeApplicationStatus);
  }

  return DEFAULT_VALID_TRANSITIONS[normalizeApplicationStatus(status)];
}
