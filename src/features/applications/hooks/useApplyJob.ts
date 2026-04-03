import { useMutation, useQueryClient } from "@tanstack/react-query";
import { applyToJob } from "../api/applications.api";
import { queryKeys } from "@/shared/api/query-keys";
import type { ApplyToJobRequestDto, ApplyToJobResponseDto, CandidateApplicationDto } from "../types";
import { apiHandler } from "@/utils/apiHandler";

export function useApplyJob() {
  const qc = useQueryClient();

  return useMutation<
    ApplyToJobResponseDto,
    unknown,
    ApplyToJobRequestDto,
    { previous: CandidateApplicationDto[] }
  >({
    mutationFn: (payload) =>
      apiHandler(() => applyToJob(payload), {
        loading: "Submitting application...",
        success: "Application submitted \u2705",
        error: "Application submission failed",
      }),
    onMutate: async ({ jobId }) => {
      await qc.cancelQueries({ queryKey: queryKeys.applications.list("candidate") });
      const previous = qc.getQueryData<CandidateApplicationDto[]>(queryKeys.applications.list("candidate")) ?? [];

      const optimistic: CandidateApplicationDto = {
        id: -Date.now(),
        jobId,
        userId: -1,
        status: "applied",
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
