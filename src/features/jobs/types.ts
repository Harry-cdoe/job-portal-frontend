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
  companyId: number;
  createdAt?: string;
  updatedAt?: string;
  Company?: JobCompanyDto;
};

export type JobsFilters = {
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "title" | "salary" | "location";
  sortOrder?: "ASC" | "DESC";
  location?: string;
  title?: string;
  search?: string;
  minSalary?: number;
  maxSalary?: number;
};

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
