import { memo } from "react";
import { SORT_OPTIONS } from "../constants";
import type { JobsSortValue } from "../types";

function SortDropdownBase({ value, onChange }: { value: JobsSortValue; onChange: (value: JobsSortValue) => void }) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Sort</label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as JobsSortValue)}
        className="h-9 rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:ring-4 focus:ring-brand-500/20"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export const SortDropdown = memo(SortDropdownBase);
