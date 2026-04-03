import { useQuery } from "@tanstack/react-query";
import { fetchJobs } from "../api/jobs.api";
import type { JobsFilters } from "../types";
import { queryKeys } from "@/shared/api/query-keys";

export function useJobs(filters: JobsFilters) {
  return useQuery({
    queryKey: queryKeys.jobs.list(filters),
    queryFn: () => fetchJobs(filters),
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    placeholderData: (previousData) => previousData,
    refetchOnWindowFocus: false,
  });
}
