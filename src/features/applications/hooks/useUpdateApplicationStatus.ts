import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { updateApplicationStatus } from "../api/applications.api";
import { queryKeys } from "@/shared/api/query-keys";
import { getValidTransitions } from "../constants/status-pipeline";
import type {
  ApplicationPipelineStatus,
  CandidateApplicationDto,
  CompanyApplicationDto,
} from "../types";

export function useUpdateApplicationStatus() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
      notes,
      expectedCurrentStatus,
    }: {
      id: number;
      status: ApplicationPipelineStatus;
      notes?: string;
      expectedCurrentStatus?: ApplicationPipelineStatus;
    }) => updateApplicationStatus(id, { status, notes, expectedCurrentStatus }),
    onMutate: async ({ id, status }) => {
      await Promise.all([
        qc.cancelQueries({ queryKey: queryKeys.applications.list("company") }),
        qc.cancelQueries({ queryKey: queryKeys.applications.list("candidate") }),
      ]);

      const previousCompany =
        qc.getQueryData<CompanyApplicationDto[]>(queryKeys.applications.list("company")) ?? [];
      const previousCandidate =
        qc.getQueryData<CandidateApplicationDto[]>(queryKeys.applications.list("candidate")) ?? [];

      qc.setQueryData<CompanyApplicationDto[]>(queryKeys.applications.list("company"), (current) =>
        (current ?? []).map((application) => {
          if (application.id !== id) return application;
          return {
            ...application,
            status,
            updatedAt: new Date().toISOString(),
            validTransitions: getValidTransitions(status),
          };
        })
      );

      return { previousCompany, previousCandidate };
    },
    onSuccess: (response, { id }) => {
      toast.success(response.idempotent ? "Status already up to date" : "Application status updated");

      qc.setQueryData<CompanyApplicationDto[]>(queryKeys.applications.list("company"), (current) =>
        (current ?? []).map((application) => (application.id === id ? response.application : application))
      );

      qc.invalidateQueries({ queryKey: queryKeys.applications.list("company") });
      qc.invalidateQueries({ queryKey: queryKeys.applications.list("candidate") });
      qc.invalidateQueries({ queryKey: queryKeys.applications.history(id) });
      qc.invalidateQueries({ queryKey: queryKeys.dashboard.company });
      qc.invalidateQueries({ queryKey: queryKeys.dashboard.candidate });
    },
    onError: (error, _vars, context) => {
      if (context?.previousCompany) {
        qc.setQueryData(queryKeys.applications.list("company"), context.previousCompany);
      }
      if (context?.previousCandidate) {
        qc.setQueryData(queryKeys.applications.list("candidate"), context.previousCandidate);
      }

      if (axios.isAxiosError(error) && error.response?.status === 409) {
        toast.error("Another recruiter updated this application. Syncing latest status...");
      } else {
        toast.error("Unable to update application status");
      }
    },
    onSettled: (_result, _error, vars) => {
      qc.invalidateQueries({ queryKey: queryKeys.applications.list("company") });
      qc.invalidateQueries({ queryKey: queryKeys.applications.list("candidate") });
      if (vars?.id) {
        qc.invalidateQueries({ queryKey: queryKeys.applications.history(vars.id) });
      }
    },
  });
}
