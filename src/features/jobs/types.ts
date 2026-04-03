export type JobCompanyDto = {
  id: number;
  name: string;
  description?: string;
  industry?: string;
};

export type JobDto = {
  id: number;
  title: string;
  description: string;
  location: string;
  salary: number;
  experienceLevel?: "intern" | "junior" | "mid" | "senior" | "lead";
  jobType?: "full_time" | "part_time" | "contract" | "internship" | "remote";
  companyId: number;
  createdAt?: string;
  updatedAt?: string;
  Company?: JobCompanyDto;
};

export type JobsFilters = {
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "salary" | "relevance";
  sortOrder?: "ASC" | "DESC";
  location?: string;
  title?: string;
  search?: string;
  minSalary?: number;
  maxSalary?: number;
  experienceLevel?: "intern" | "junior" | "mid" | "senior" | "lead";
  jobType?: "full_time" | "part_time" | "contract" | "internship" | "remote";
};

export type JobsSortValue = "newest" | "salary_desc" | "salary_asc" | "relevance";

export type CreateJobRequestDto = {
  title: string;
  description: string;
  location: string;
  salary: number;
};

export type CreateJobResponseDto = {
  message: string;
  job: JobDto;
};
