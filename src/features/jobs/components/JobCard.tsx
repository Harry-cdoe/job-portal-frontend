import Link from "next/link";
import type { ReactNode } from "react";
import type { JobDto } from "../types";

export function JobCard({ job, action }: { job: JobDto; action?: ReactNode }) {
  return (
    <article className="rounded-lg bg-white p-4 shadow-sm transition hover:shadow">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold">{job.title}</h3>
          <p className="mt-1 text-sm text-slate-600">{job.Company?.name ?? "Company"}</p>
          <p className="mt-2 line-clamp-2 text-sm text-slate-700">{job.description}</p>
          <p className="mt-2 text-xs text-slate-500">{job.location} • Salary: {job.salary}</p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <Link className="text-sm font-medium text-brand-600" href={`/candidate/jobs/${job.id}`}>
            View
          </Link>
          {action}
        </div>
      </div>
    </article>
  );
}
