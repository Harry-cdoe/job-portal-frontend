import type { JobsFilters } from "@/features/jobs/types";
import type { ApplicationView } from "@/features/applications/types";

export const queryKeys = {
  auth: {
    me: ["auth", "me"] as const,
  },
  jobs: {
    list: (filters: JobsFilters) => ["jobs", "list", filters] as const,
    detail: (id: number) => ["jobs", "detail", id] as const,
  },
  applications: {
    list: (view: ApplicationView) => ["applications", "list", view] as const,
    history: (applicationId: number) => ["applications", "history", applicationId] as const,
  },
  dashboard: {
    candidate: ["dashboard", "candidate"] as const,
    company: ["dashboard", "company"] as const,
  },
  profile: {
    me: ["profile", "me"] as const,
    resume: ["profile", "resume"] as const,
  },
};
