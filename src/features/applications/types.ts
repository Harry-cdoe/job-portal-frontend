export type ApplicationPipelineStatus =
  | "applied"
  | "under_review"
  | "shortlisted"
  | "rejected"
  | "hired";

export type LegacyApplicationStatus = "pending" | "accepted" | "rejected";
export type ApplicationStatus = ApplicationPipelineStatus | LegacyApplicationStatus;
export type ApplicationView = "candidate" | "company";

export type ApplicationHistoryActor = {
  id?: number;
  name?: string;
  email?: string;
};

export type ApplicationHistoryItemDto = {
  id?: number;
  fromStatus?: ApplicationStatus | null;
  toStatus: ApplicationStatus;
  changedBy?: ApplicationHistoryActor | string | null;
  changedAt?: string;
  createdAt?: string;
  timestamp?: string;
  notes?: string | null;
};

export type ApplicationBaseDto = {
  id: number;
  userId: number;
  jobId: number;
  status: ApplicationStatus;
  createdAt?: string;
  updatedAt?: string;
  notes?: string | null;
  recruiterNotes?: string | null;
  validTransitions?: ApplicationStatus[];
  statusHistory?: ApplicationHistoryItemDto[];
};

export type CandidateApplicationDto = ApplicationBaseDto & {
  Job: {
    title: string;
    Company?: {
      name: string;
    };
  };
};

export type CompanyApplicationDto = ApplicationBaseDto & {
  Job: {
    id: number;
    title: string;
    location: string;
  };
  User: {
    id: number;
    name: string;
    email: string;
  };
};

export type ApplyToJobRequestDto = {
  jobId: number;
};

export type ApplyToJobResponseDto = {
  message: string;
  application: {
    id: number;
    userId: number;
    jobId: number;
    status: ApplicationStatus;
  };
};

export type CandidateApplicationsResponseDto = {
  applications: CandidateApplicationDto[];
};

export type CompanyApplicationsResponseDto = {
  count: number;
  applications: CompanyApplicationDto[];
};

export type ApplicationHistoryResponseDto =
  | {
      history?: ApplicationHistoryItemDto[];
      statusHistory?: ApplicationHistoryItemDto[];
      timeline?: ApplicationHistoryItemDto[];
    }
  | ApplicationHistoryItemDto[];

export type UpdateApplicationStatusRequestDto = {
  status: ApplicationPipelineStatus;
  notes?: string;
  expectedCurrentStatus?: ApplicationPipelineStatus;
};

export type UpdateApplicationStatusResponseDto = {
  message: string;
  application: CompanyApplicationDto;
  idempotent?: boolean;
};
