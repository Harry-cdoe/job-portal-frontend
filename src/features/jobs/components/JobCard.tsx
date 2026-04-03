import Link from "next/link";
import { memo, type ReactNode } from "react";
import type { JobDto } from "../types";

function JobCardBase({ job, action }: { job: JobDto; action?: ReactNode }) {
  return (
    <article className="card p-4 transition hover:shadow">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold">{job.title}</h3>
          <p className="mt-1 text-sm text-slate-600">{job.Company?.name ?? "Company"}</p>
          <p className="mt-2 line-clamp-2 text-sm text-slate-700">{job.description}</p>
          <p className="mt-2 text-xs text-slate-500">
            {job.location} | Salary: {new Intl.NumberFormat("en-IN").format(job.salary)}
          </p>
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

function JobCardSkeletonBase() {
  return (
    <article className="card space-y-3 p-4">
      <div className="h-4 w-1/3 animate-pulse rounded bg-slate-200" />
      <div className="h-3 w-1/4 animate-pulse rounded bg-slate-200" />
      <div className="h-3 w-full animate-pulse rounded bg-slate-200" />
      <div className="h-3 w-2/3 animate-pulse rounded bg-slate-200" />
    </article>
  );
}

export const JobCard = memo(JobCardBase);
export const JobCardSkeleton = memo(JobCardSkeletonBase);
