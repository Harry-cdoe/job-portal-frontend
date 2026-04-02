import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createJob } from "../api/jobs.api";
import { queryKeys } from "@/shared/api/query-keys";

export function useCreateJob() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createJob,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["jobs"] });
      qc.invalidateQueries({ queryKey: queryKeys.dashboard.company });
    },
  });
}
