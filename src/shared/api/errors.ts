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

export function getApiErrorMessage(error: unknown, fallback = "Request failed") {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiErrorResponse | undefined;
    const firstValidation = data?.errors?.[0];

    if (firstValidation?.message) {
      return firstValidation.path ? `${firstValidation.path}: ${firstValidation.message}` : firstValidation.message;
    }

    return data?.message ?? fallback;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}
