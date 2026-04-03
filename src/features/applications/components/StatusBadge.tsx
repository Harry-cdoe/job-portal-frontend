import { memo } from "react";
import { cn } from "@/shared/lib/cn";
import { normalizeApplicationStatus, STATUS_LABELS } from "../constants/status-pipeline";
import type { ApplicationStatus } from "../types";

type Tone = "success" | "warning" | "error" | "neutral";

const toneClass: Record<Tone, string> = {
  success: "bg-emerald-100 text-emerald-700",
  warning: "bg-amber-100 text-amber-700",
  error: "bg-red-100 text-red-700",
  neutral: "bg-slate-100 text-slate-700",
};

function getTone(status: ApplicationStatus): Tone {
  const normalized = normalizeApplicationStatus(status);
  if (normalized === "hired") return "success";
  if (normalized === "rejected") return "error";
  if (normalized === "under_review" || normalized === "shortlisted") return "warning";
  return "neutral";
}

function StatusBadgeBase({ status, className }: { status: ApplicationStatus; className?: string }) {
  const normalized = normalizeApplicationStatus(status);

  return (
    <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", toneClass[getTone(normalized)], className)}>
      {STATUS_LABELS[normalized]}
    </span>
  );
}

export const StatusBadge = memo(StatusBadgeBase);
