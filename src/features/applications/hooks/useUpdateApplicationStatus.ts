import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateApplicationStatus } from "../api/applications.api";
import { queryKeys } from "@/shared/api/query-keys";

export function useUpdateApplicationStatus() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: "accepted" | "rejected" }) =>
      updateApplicationStatus(id, { status }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.applications.list("company") });
      qc.invalidateQueries({ queryKey: queryKeys.dashboard.company });
    },
  });
}
