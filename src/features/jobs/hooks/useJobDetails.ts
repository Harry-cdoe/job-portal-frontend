import { useQuery } from "@tanstack/react-query";
import { fetchJobById } from "../api/jobs.api";
import { queryKeys } from "@/shared/api/query-keys";

export function useJobDetails(id: number) {
  return useQuery({
    queryKey: queryKeys.jobs.detail(id),
    queryFn: () => fetchJobById(id),
    enabled: Number.isFinite(id) && id > 0,
    staleTime: 60_000,
  });
}
