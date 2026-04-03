import { memo } from "react";
import { Button } from "@/shared/ui/Button";
import { EXPERIENCE_OPTIONS, JOB_TYPE_OPTIONS } from "../constants";
import type { JobsFilters } from "../types";

type Props = {
  location: string;
  minSalary: number;
  maxSalary: number;
  experienceLevel: JobsFilters["experienceLevel"] | "";
  jobType: JobsFilters["jobType"] | "";
  activeFilters: string[];
  onChange: (
    updates: Partial<{
      location: string;
      minSalary: number;
      maxSalary: number;
      experienceLevel: JobsFilters["experienceLevel"] | "";
      jobType: JobsFilters["jobType"] | "";
    }>
  ) => void;
  onClear: () => void;
};

function FiltersPanelBase({
  location,
  minSalary,
  maxSalary,
  experienceLevel,
  jobType,
  activeFilters,
  onChange,
  onClear,
}: Props) {
  return (
    <aside className="card space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-900">Filters</h2>
        <Button className="bg-slate-100 px-3 py-1 text-xs text-slate-700 hover:bg-slate-200" onClick={onClear}>
          Clear filters
        </Button>
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Location</label>
        <input
          value={location}
          onChange={(event) => onChange({ location: event.target.value })}
          placeholder="Bengaluru, Remote..."
          className="h-9 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:ring-4 focus:ring-brand-500/20"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Experience</label>
        <select
          value={experienceLevel}
          onChange={(event) => onChange({ experienceLevel: event.target.value as Props["experienceLevel"] })}
          className="h-9 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:ring-4 focus:ring-brand-500/20"
        >
          {EXPERIENCE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Job Type</label>
        <select
          value={jobType}
          onChange={(event) => onChange({ jobType: event.target.value as Props["jobType"] })}
          className="h-9 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:ring-4 focus:ring-brand-500/20"
        >
          {JOB_TYPE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Salary Range</label>
        <div className="rounded-lg border border-slate-200 p-3">
          <div className="mb-2 flex items-center justify-between text-xs text-slate-600">
            <span>Min: {minSalary.toLocaleString("en-IN")}</span>
            <span>Max: {maxSalary.toLocaleString("en-IN")}</span>
          </div>
          <input
            type="range"
            min={0}
            max={200000}
            step={5000}
            value={minSalary}
            onChange={(event) =>
              onChange({
                minSalary: Math.min(Number(event.target.value), maxSalary),
              })
            }
            className="w-full accent-brand-500"
          />
          <input
            type="range"
            min={0}
            max={200000}
            step={5000}
            value={maxSalary}
            onChange={(event) =>
              onChange({
                maxSalary: Math.max(Number(event.target.value), minSalary),
              })
            }
            className="mt-2 w-full accent-brand-500"
          />
        </div>
      </div>

      {activeFilters.length > 0 ? (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Active</p>
          <div className="flex flex-wrap gap-2">
            {activeFilters.map((label) => (
              <span key={label} className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700">
                {label}
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </aside>
  );
}

export const FiltersPanel = memo(FiltersPanelBase);
