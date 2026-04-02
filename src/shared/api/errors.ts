import axios from "axios";
import type { ApiErrorResponse } from "@/shared/types/api";

export class ApiClientError extends Error {
  public readonly status?: number;
  public readonly code?: string;

  constructor(message: string, status?: number, code?: string) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.code = code;
  }
}

export function toApiClientError(error: unknown): ApiClientError {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const data = error.response?.data as ApiErrorResponse | undefined;
    return new ApiClientError(data?.message ?? error.message ?? "Request failed", status, data?.code);
  }

  if (error instanceof Error) {
    return new ApiClientError(error.message);
  }

  return new ApiClientError("Unknown error");
}
