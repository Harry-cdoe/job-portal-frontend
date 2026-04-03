import { useQuery } from "@tanstack/react-query";
import { fetchProfile } from "../api/profile.api";
import { queryKeys } from "@/shared/api/query-keys";

export function useProfile() {
  return useQuery({
    queryKey: queryKeys.profile.me,
    queryFn: fetchProfile,
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: false,
  });
}
