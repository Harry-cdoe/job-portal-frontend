import { http } from "@/shared/api/http";
import type { PaginatedListResponse } from "@/shared/types/api";
import type { CreateJobRequestDto, CreateJobResponseDto, JobDto, JobsFilters } from "../types";

function buildJobsQueryParams(filters: JobsFilters) {
  const params = Object.entries(filters).reduce<Record<string, string | number>>((acc, [key, value]) => {
    if (value === undefined || value === null) {
      return acc;
    }

    if (typeof value === "string") {
      const trimmed = value.trim();
      if (!trimmed) {
        return acc;
      }
      acc[key] = trimmed;
      return acc;
    }

    acc[key] = value;
    return acc;
  }, {});

  return params;
}

export async function fetchJobs(params: JobsFilters) {
  const query = buildJobsQueryParams(params);
  const { data } = await http.get<PaginatedListResponse<JobDto>>("/job", { params: query });
  return data;
}

// Backend currently has no /api/job/:id endpoint. This fallback keeps the UI functional
// until that endpoint is added.
export async function fetchJobById(id: number) {
  const list = await fetchJobs({ page: 1, limit: 100 });
  const match = list.jobs.find((j) => j.id === id);

  if (!match) {
    throw new Error("Job details endpoint missing and job not found in current page fallback.");
  }

  return match;
}

export async function createJob(payload: CreateJobRequestDto) {
  const { data } = await http.post<CreateJobResponseDto>("/job", payload);
  return data;
}
