import { useQuery } from "@tanstack/react-query";
import { me } from "../api/auth.api";
import { queryKeys } from "@/shared/api/query-keys";

export function useCurrentUser(enabled = true) {
  return useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: me,
    enabled,
    staleTime: 30_000
  });
}
