import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/shared/api/query-keys";
import { fetchApplicationHistory } from "../api/applications.api";
import type { ApplicationHistoryItemDto } from "../types";

export function useApplicationHistory(applicationId: number, enabled = true) {
  return useQuery<ApplicationHistoryItemDto[]>({
    queryKey: queryKeys.applications.history(applicationId),
    queryFn: () => fetchApplicationHistory(applicationId),
    enabled: enabled && Number.isFinite(applicationId) && applicationId > 0,
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: true,
  });
}
