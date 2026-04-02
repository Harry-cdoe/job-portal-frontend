"use client";

import { useCandidateDashboard } from "../hooks/useDashboard";

export function CandidateStats() {
  const { data, isLoading } = useCandidateDashboard();

  if (isLoading) return <p className="text-slate-600">Loading stats...</p>;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card label="Total" value={data.totalApplications} />
      <Card label="Pending" value={data.pending} />
      <Card label="Accepted" value={data.accepted} />
      <Card label="Rejected" value={data.rejected} />
    </div>
  );
}

function Card({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-white p-4 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
}
