export type ApplicationStatus = "pending" | "accepted" | "rejected";
export type ApplicationView = "candidate" | "company";

export type CandidateApplicationDto = {
  id: number;
  userId: number;
  jobId: number;
  status: ApplicationStatus;
  createdAt?: string;
  updatedAt?: string;
  Job: {
    title: string;
    Company?: {
      name: string;
    };
  };
};

export type CompanyApplicationDto = {
  id: number;
  userId: number;
  jobId: number;
  status: ApplicationStatus;
  createdAt?: string;
  updatedAt?: string;
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

export type UpdateApplicationStatusRequestDto = {
  status: "accepted" | "rejected";
};

export type UpdateApplicationStatusResponseDto = {
  message: string;
  application: CompanyApplicationDto;
};
