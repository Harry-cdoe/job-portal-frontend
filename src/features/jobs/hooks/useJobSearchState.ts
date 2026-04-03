"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { DEFAULT_JOBS_PAGE_SIZE } from "../constants";
import type { JobsFilters, JobsSortValue } from "../types";

type UiState = {
  keyword: string;
  location: string;
  minSalary: number;
  maxSalary: number;
  experienceLevel: JobsFilters["experienceLevel"] | "";
  jobType: JobsFilters["jobType"] | "";
  sort: JobsSortValue;
  page: number;
  limit: number;
};

const MAX_SALARY = 200000;
const DEFAULT_MAX_SALARY = 150000;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function parsePositiveInt(value: string | null, fallback: number) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

function parseState(params: URLSearchParams): UiState {
  const minSalary = clamp(parsePositiveInt(params.get("minSalary"), 0), 0, MAX_SALARY);
  const maxSalary = clamp(parsePositiveInt(params.get("maxSalary"), DEFAULT_MAX_SALARY), minSalary, MAX_SALARY);

  const sort = (params.get("sort") as JobsSortValue | null) ?? "newest";
  const validSort: JobsSortValue[] = ["newest", "salary_desc", "salary_asc", "relevance"];

  return {
    keyword: params.get("q") ?? "",
    location: params.get("location") ?? "",
    minSalary,
    maxSalary,
    experienceLevel: (params.get("experienceLevel") as UiState["experienceLevel"]) ?? "",
    jobType: (params.get("jobType") as UiState["jobType"]) ?? "",
    sort: validSort.includes(sort) ? sort : "newest",
    page: parsePositiveInt(params.get("page"), 1),
    limit: parsePositiveInt(params.get("limit"), DEFAULT_JOBS_PAGE_SIZE),
  };
}

function toSortFilters(sort: JobsSortValue) {
  if (sort === "salary_desc") return { sortBy: "salary" as const, sortOrder: "DESC" as const };
  if (sort === "salary_asc") return { sortBy: "salary" as const, sortOrder: "ASC" as const };
  if (sort === "relevance") return { sortBy: "relevance" as const, sortOrder: "DESC" as const };
  return { sortBy: "createdAt" as const, sortOrder: "DESC" as const };
}

function serialize(state: UiState) {
  const params = new URLSearchParams();
  if (state.keyword.trim()) params.set("q", state.keyword.trim());
  if (state.location.trim()) params.set("location", state.location.trim());
  if (state.minSalary > 0) params.set("minSalary", String(state.minSalary));
  if (state.maxSalary !== DEFAULT_MAX_SALARY) params.set("maxSalary", String(state.maxSalary));
  if (state.experienceLevel) params.set("experienceLevel", state.experienceLevel);
  if (state.jobType) params.set("jobType", state.jobType);
  if (state.sort !== "newest") params.set("sort", state.sort);
  if (state.page > 1) params.set("page", String(state.page));
  if (state.limit !== DEFAULT_JOBS_PAGE_SIZE) params.set("limit", String(state.limit));
  return params.toString();
}

export function useJobSearchState() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const parsedFromUrl = useMemo(() => parseState(new URLSearchParams(searchParams.toString())), [searchParams]);
  const [state, setState] = useState<UiState>(parsedFromUrl);
  const debouncedKeyword = useDebounce(state.keyword, 400);

  useEffect(() => {
    setState(parsedFromUrl);
  }, [parsedFromUrl]);

  useEffect(() => {
    const next = serialize(state);
    const current = searchParams.toString();

    if (next !== current) {
      router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
    }
  }, [pathname, router, searchParams, state]);

  const setKeyword = useCallback((keyword: string) => {
    setState((previous) => ({ ...previous, keyword, page: 1 }));
  }, []);

  const updateFilters = useCallback(
    (updates: Partial<Pick<UiState, "location" | "minSalary" | "maxSalary" | "experienceLevel" | "jobType">>) => {
      setState((previous) => ({
        ...previous,
        ...updates,
        minSalary: clamp(updates.minSalary ?? previous.minSalary, 0, MAX_SALARY),
        maxSalary: clamp(updates.maxSalary ?? previous.maxSalary, updates.minSalary ?? previous.minSalary, MAX_SALARY),
        page: 1,
      }));
    },
    []
  );

  const setSort = useCallback((sort: JobsSortValue) => {
    setState((previous) => ({ ...previous, sort, page: 1 }));
  }, []);

  const setPage = useCallback((page: number) => {
    setState((previous) => ({ ...previous, page: Math.max(1, page) }));
  }, []);

  const clearFilters = useCallback(() => {
    setState((previous) => ({
      ...previous,
      keyword: "",
      location: "",
      minSalary: 0,
      maxSalary: DEFAULT_MAX_SALARY,
      experienceLevel: "",
      jobType: "",
      sort: "newest",
      page: 1,
    }));
  }, []);

  const activeFilters = useMemo(
    () =>
      [
        state.keyword.trim() ? `Keyword: ${state.keyword.trim()}` : "",
        state.location.trim() ? `Location: ${state.location.trim()}` : "",
        state.minSalary > 0 ? `Min Salary: ${state.minSalary}` : "",
        state.maxSalary < DEFAULT_MAX_SALARY ? `Max Salary: ${state.maxSalary}` : "",
        state.experienceLevel ? `Experience: ${state.experienceLevel.replace("_", " ")}` : "",
        state.jobType ? `Type: ${state.jobType.replace("_", " ")}` : "",
      ].filter(Boolean),
    [state.experienceLevel, state.jobType, state.keyword, state.location, state.maxSalary, state.minSalary]
  );

  const queryFilters: JobsFilters = useMemo(() => {
    const mappedSort = toSortFilters(state.sort);

    return {
      search: debouncedKeyword.trim() || undefined,
      location: state.location.trim() || undefined,
      minSalary: state.minSalary > 0 ? state.minSalary : undefined,
      maxSalary: state.maxSalary < DEFAULT_MAX_SALARY ? state.maxSalary : undefined,
      experienceLevel: state.experienceLevel || undefined,
      jobType: state.jobType || undefined,
      page: state.page,
      limit: state.limit,
      ...mappedSort,
    };
  }, [debouncedKeyword, state.experienceLevel, state.jobType, state.limit, state.location, state.maxSalary, state.minSalary, state.page, state.sort]);

  return {
    state,
    queryFilters,
    activeFilters,
    setKeyword,
    updateFilters,
    setSort,
    setPage,
    clearFilters,
  };
}
