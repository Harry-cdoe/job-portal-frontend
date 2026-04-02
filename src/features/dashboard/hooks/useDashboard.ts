import { useMemo } from "react";
import { useApplications } from "@/features/applications/hooks/useApplications";

export function useCandidateDashboard() {
  const query = useApplications("candidate");

  const data = useMemo(() => {
    const list = query.data ?? [];
    return {
      totalApplications: list.length,
      pending: list.filter((x) => x.status === "pending").length,
      accepted: list.filter((x) => x.status === "accepted").length,
      rejected: list.filter((x) => x.status === "rejected").length,
    };
  }, [query.data]);

  return { ...query, data };
}

export function useCompanyDashboard() {
  const query = useApplications("company");

  const data = useMemo(() => {
    const list = query.data ?? [];
    return {
      totalApplications: list.length,
      pending: list.filter((x) => x.status === "pending").length,
      accepted: list.filter((x) => x.status === "accepted").length,
      rejected: list.filter((x) => x.status === "rejected").length,
      uniqueJobsWithApplicants: new Set(list.map((x) => x.jobId)).size,
    };
  }, [query.data]);

  return { ...query, data };
}
