import { useMutation, useQueryClient } from "@tanstack/react-query";
import { applyToJob } from "../api/applications.api";
import { queryKeys } from "@/shared/api/query-keys";
import type { CandidateApplicationDto } from "../types";

export function useApplyJob() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: applyToJob,
    onMutate: async ({ jobId }) => {
      await qc.cancelQueries({ queryKey: queryKeys.applications.list("candidate") });
      const previous = qc.getQueryData<CandidateApplicationDto[]>(queryKeys.applications.list("candidate")) ?? [];

      const optimistic: CandidateApplicationDto = {
        id: -Date.now(),
        jobId,
        userId: -1,
        status: "pending",
        Job: {
          title: "Applying...",
          Company: { name: "Please wait" },
        },
      };

      qc.setQueryData<CandidateApplicationDto[]>(queryKeys.applications.list("candidate"), [optimistic, ...previous]);
      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        qc.setQueryData(queryKeys.applications.list("candidate"), context.previous);
      }
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: queryKeys.applications.list("candidate") });
      qc.invalidateQueries({ queryKey: queryKeys.dashboard.candidate });
    },
  });
}
