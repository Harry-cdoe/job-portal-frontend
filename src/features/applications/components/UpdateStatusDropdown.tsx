import { memo, useMemo, useState } from "react";
import { Button } from "@/shared/ui/Button";
import { cn } from "@/shared/lib/cn";
import {
  getValidTransitions,
  normalizeApplicationStatus,
  STATUS_LABELS,
} from "../constants/status-pipeline";
import type { ApplicationPipelineStatus, ApplicationStatus } from "../types";

type Props = {
  currentStatus: ApplicationStatus;
  validTransitions?: ApplicationStatus[];
  isPending?: boolean;
  onUpdate: (nextStatus: ApplicationPipelineStatus) => void;
};

function UpdateStatusDropdownBase({ currentStatus, validTransitions, isPending, onUpdate }: Props) {
  const [nextStatus, setNextStatus] = useState<ApplicationPipelineStatus | "">("");

  const normalizedCurrent = normalizeApplicationStatus(currentStatus);
  const options = useMemo(
    () => getValidTransitions(currentStatus, validTransitions).filter((status) => status !== normalizedCurrent),
    [currentStatus, normalizedCurrent, validTransitions]
  );

  const canSubmit = !!nextStatus && !isPending;

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <select
        className={cn(
          "h-9 min-w-[180px] rounded-lg border border-slate-300 bg-white px-3 text-xs outline-none transition",
          "focus:ring-4 focus:ring-brand-500/20 disabled:cursor-not-allowed disabled:bg-slate-100"
        )}
        disabled={isPending || options.length === 0}
        value={nextStatus}
        onChange={(event) => setNextStatus(event.target.value as ApplicationPipelineStatus)}
      >
        <option value="">
          {options.length === 0 ? "No valid transitions" : `Current: ${STATUS_LABELS[normalizedCurrent]}`}
        </option>
        {options.map((status) => (
          <option key={status} value={status}>
            Move to {STATUS_LABELS[status]}
          </option>
        ))}
      </select>

      <Button
        className="h-9 px-3 py-0 text-xs"
        disabled={!canSubmit}
        onClick={() => {
          if (!nextStatus || nextStatus === normalizedCurrent) return;
          onUpdate(nextStatus);
          setNextStatus("");
        }}
      >
        {isPending ? "Updating..." : "Update"}
      </Button>
    </div>
  );
}

export const UpdateStatusDropdown = memo(UpdateStatusDropdownBase);
