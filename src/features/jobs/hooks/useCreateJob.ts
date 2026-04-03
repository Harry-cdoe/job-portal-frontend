import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createJob } from "../api/jobs.api";
import { queryKeys } from "@/shared/api/query-keys";
import type { CreateJobRequestDto, CreateJobResponseDto } from "../types";
import { apiHandler } from "@/utils/apiHandler";

export function useCreateJob() {
  const qc = useQueryClient();

  return useMutation<CreateJobResponseDto, unknown, CreateJobRequestDto>({
    mutationFn: (payload) =>
      apiHandler(() => createJob(payload), {
        loading: "Posting job...",
        success: "Job posted successfully \uD83D\uDE80",
        error: "Job creation failed",
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["jobs"] });
      qc.invalidateQueries({ queryKey: queryKeys.dashboard.company });
    },
  });
}
