import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { uploadResume } from "../api/profile.api";
import { useUploadResume } from "./useUploadResume";
import { queryKeys } from "@/shared/api/query-keys";
import type { ProfileDto } from "../types";

jest.mock("../api/profile.api", () => ({
  uploadResume: jest.fn(),
}));

const mockedUploadResume = jest.mocked(uploadResume);

function createWrapper(client: QueryClient) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  };
}

function createProfile(): ProfileDto {
  return {
    id: 1,
    name: "Aarav Sharma",
    bio: "Frontend engineer",
    skills: ["React"],
    experience: 5,
    education: "B.Tech",
    location: "Bengaluru",
    resumeName: "old-resume.pdf",
    resumeUrl: "https://example.com/old-resume.pdf",
  };
}

describe("useUploadResume", () => {
  beforeEach(() => {
    mockedUploadResume.mockReset();
  });

  it("optimistically updates and keeps the uploaded resume after a successful API call", async () => {
    const client = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    const profile = createProfile();
    client.setQueryData(queryKeys.profile.me, profile);

    mockedUploadResume.mockResolvedValue({
      resumeName: "new-resume.pdf",
      resumeUrl: "https://example.com/new-resume.pdf",
    });

    const { result } = renderHook(() => useUploadResume(), {
      wrapper: createWrapper(client),
    });

    const file = new File(["pdf"], "new-resume.pdf", { type: "application/pdf" });

    await act(async () => {
      await result.current.mutateAsync({ file });
    });

    await waitFor(() => {
      expect(client.getQueryData<ProfileDto>(queryKeys.profile.me)?.resumeName).toBe("new-resume.pdf");
    });

    expect(client.getQueryData<ProfileDto>(queryKeys.profile.me)?.resumeUrl).toBe("https://example.com/new-resume.pdf");
    expect(mockedUploadResume).toHaveBeenCalledWith(file, undefined);
  });

  it("rolls back the optimistic update when the upload API fails", async () => {
    const client = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    const profile = createProfile();
    client.setQueryData(queryKeys.profile.me, profile);

    mockedUploadResume.mockRejectedValue(new Error("Upload failed"));

    const { result } = renderHook(() => useUploadResume(), {
      wrapper: createWrapper(client),
    });

    const file = new File(["pdf"], "broken-resume.pdf", { type: "application/pdf" });

    await expect(
      act(async () => {
        await result.current.mutateAsync({ file });
      })
    ).rejects.toThrow("Upload failed");

    await waitFor(() => {
      expect(client.getQueryData<ProfileDto>(queryKeys.profile.me)).toEqual(profile);
    });
  });
});
