import { ReactNode } from "react";

export function EmptyState({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="card p-8 text-center">
      <div className="mx-auto mb-4 h-10 w-10 rounded-full bg-slate-100" />
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      {subtitle ? <p className="mt-1 text-sm text-slate-600">{subtitle}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
