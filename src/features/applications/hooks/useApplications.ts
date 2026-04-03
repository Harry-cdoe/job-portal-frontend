import { useQuery } from "@tanstack/react-query";
import { fetchCandidateApplications, fetchCompanyApplications } from "../api/applications.api";
import type { CandidateApplicationDto, CompanyApplicationDto } from "../types";
import { queryKeys } from "@/shared/api/query-keys";

export function useApplications(view: "candidate"): ReturnType<typeof useQuery<CandidateApplicationDto[]>>;
export function useApplications(view: "company"): ReturnType<typeof useQuery<CompanyApplicationDto[]>>;
export function useApplications(view: "candidate" | "company") {
  return useQuery({
    queryKey: queryKeys.applications.list(view),
    queryFn: () => (view === "candidate" ? fetchCandidateApplications() : fetchCompanyApplications()),
    staleTime: 20_000,
    gcTime: 5 * 60_000,
    placeholderData: (previousData) => previousData,
    refetchOnWindowFocus: true,
  });
}
