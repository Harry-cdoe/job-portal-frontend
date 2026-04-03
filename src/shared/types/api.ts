export type ApiErrorResponse = {
  code?: string;
  message: string;
  errors?: Array<{
    path?: string;
    message?: string;
  }>;
};

export type PaginatedListResponse<T> = {
  page: number;
  limit: number;
  totalJobs: number;
  totalPages: number;
  jobs: T[];
};

export type ApiMessageResponse = {
  message: string;
};
