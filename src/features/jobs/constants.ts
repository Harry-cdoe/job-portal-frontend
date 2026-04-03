import type { JobsSortValue } from "./types";

export const DEFAULT_JOBS_PAGE_SIZE = 10;

export const SORT_OPTIONS: Array<{ label: string; value: JobsSortValue }> = [
  { label: "Newest", value: "newest" },
  { label: "Highest Salary", value: "salary_desc" },
  { label: "Lowest Salary", value: "salary_asc" },
  { label: "Relevance", value: "relevance" },
];

export const EXPERIENCE_OPTIONS = [
  { label: "Any Experience", value: "" },
  { label: "Intern", value: "intern" },
  { label: "Junior", value: "junior" },
  { label: "Mid", value: "mid" },
  { label: "Senior", value: "senior" },
  { label: "Lead", value: "lead" },
] as const;

export const JOB_TYPE_OPTIONS = [
  { label: "Any Type", value: "" },
  { label: "Full Time", value: "full_time" },
  { label: "Part Time", value: "part_time" },
  { label: "Contract", value: "contract" },
  { label: "Internship", value: "internship" },
  { label: "Remote", value: "remote" },
] as const;
