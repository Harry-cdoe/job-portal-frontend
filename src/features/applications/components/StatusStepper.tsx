import { memo } from "react";
import { cn } from "@/shared/lib/cn";
import {
  APPLICATION_PIPELINE_STEPS,
  normalizeApplicationStatus,
  STATUS_LABELS,
} from "../constants/status-pipeline";
import type { ApplicationStatus } from "../types";

function StatusStepperBase({ status, className }: { status: ApplicationStatus; className?: string }) {
  const current = normalizeApplicationStatus(status);
  const currentIndex = APPLICATION_PIPELINE_STEPS.indexOf(current);

  return (
    <ol className={cn("flex items-start gap-1 overflow-x-auto pb-1", className)}>
      {APPLICATION_PIPELINE_STEPS.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <li key={step} className="flex min-w-[108px] flex-1 items-start gap-1">
            <div className="flex w-full items-center gap-1">
              <span
                className={cn(
                  "inline-flex h-6 w-6 flex-none items-center justify-center rounded-full border text-[11px] font-semibold",
                  isCurrent
                    ? "border-brand-500 bg-brand-50 text-brand-700"
                    : isCompleted
                    ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                    : "border-slate-300 bg-white text-slate-500"
                )}
              >
                {index + 1}
              </span>
              <span
                className={cn(
                  "truncate text-[11px] font-medium",
                  isCurrent ? "text-brand-700" : isCompleted ? "text-slate-700" : "text-slate-500"
                )}
              >
                {STATUS_LABELS[step]}
              </span>
            </div>
            {index < APPLICATION_PIPELINE_STEPS.length - 1 ? (
              <span className={cn("mt-3 hidden h-px flex-1 md:block", isCompleted ? "bg-emerald-300" : "bg-slate-300")} />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

export const StatusStepper = memo(StatusStepperBase);
