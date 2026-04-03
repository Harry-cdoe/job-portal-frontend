import { http } from "@/shared/api/http";
import type {
  ApplicationHistoryItemDto,
  ApplicationHistoryResponseDto,
  ApplyToJobRequestDto,
  ApplyToJobResponseDto,
  CandidateApplicationsResponseDto,
  CompanyApplicationsResponseDto,
  UpdateApplicationStatusRequestDto,
  UpdateApplicationStatusResponseDto,
} from "../types";

export async function fetchCandidateApplications() {
  const { data } = await http.get<CandidateApplicationsResponseDto>("/applications/candidate");
  return data.applications;
}

export async function fetchCompanyApplications() {
  const { data } = await http.get<CompanyApplicationsResponseDto>("/applications");
  return data.applications;
}

export async function applyToJob(payload: ApplyToJobRequestDto) {
  const { data } = await http.post<ApplyToJobResponseDto>("/applications", payload);
  return data;
}

export async function updateApplicationStatus(
  applicationId: number,
  payload: UpdateApplicationStatusRequestDto
) {
  const { data } = await http.patch<UpdateApplicationStatusResponseDto>(
    `/applications/${applicationId}/status`,
    payload
  );
  return data;
}

export async function fetchApplicationHistory(applicationId: number) {
  const { data } = await http.get<ApplicationHistoryResponseDto>(`/applications/${applicationId}/history`);

  if (Array.isArray(data)) {
    return data;
  }

  const history =
    data.history ??
    data.statusHistory ??
    data.timeline ??
    ([] as ApplicationHistoryItemDto[]);

  return history;
}
