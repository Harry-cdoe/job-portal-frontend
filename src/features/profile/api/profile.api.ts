import { http } from "@/shared/api/http";
import { apiHandler } from "@/utils/apiHandler";
import type {
  ProfileApiEntity,
  ProfileApiResponseDto,
  ProfileDto,
  UpdateProfileRequestDto,
  UploadResumeResponseDto,
} from "../types";

function getResumeName(resumeUrl?: string) {
  if (!resumeUrl) {
    return undefined;
  }

  return resumeUrl.split("/").pop();
}

function normalizeProfile(entity?: ProfileApiEntity): ProfileDto {
  return {
    id: entity?.id,
    name: entity?.fullName ?? "",
    bio: entity?.bio ?? "",
    skills: entity?.skills ?? [],
    experience: entity?.experience ?? 0,
    education: entity?.education ?? "",
    location: entity?.location ?? "",
    resumeUrl: entity?.resumeUrl,
    resumeName: getResumeName(entity?.resumeUrl),
  };
}

function isProfileResponse(data: ProfileApiResponseDto | ProfileApiEntity): data is ProfileApiResponseDto {
  return "profile" in data;
}

function extractProfileEntity(data: ProfileApiResponseDto | ProfileApiEntity): ProfileApiEntity | undefined {
  return isProfileResponse(data) ? data.profile : data;
}

export async function fetchProfile(): Promise<ProfileDto> {
  const { data } = await http.get<ProfileApiResponseDto | ProfileApiEntity>("/profile");
  return normalizeProfile(extractProfileEntity(data));
}

export async function updateProfile(payload: UpdateProfileRequestDto): Promise<ProfileDto> {
  return apiHandler(
    async () => {
      const requestBody = {
        fullName: payload.name,
        bio: payload.bio,
        skills: payload.skills,
        experience: payload.experience,
        education: payload.education,
        location: payload.location,
      };

      const { data } = await http.patch<ProfileApiResponseDto | ProfileApiEntity>("/profile", requestBody);
      return normalizeProfile(extractProfileEntity(data));
    },
    {
      loading: "Saving profile...",
      success: "Profile updated successfully",
      error: "Failed to update profile",
    }
  );
}

export async function uploadResume(file: File, onProgress?: (percentage: number) => void): Promise<UploadResumeResponseDto> {
  if (file.type !== "application/pdf") {
    throw new Error("Only PDF resumes are allowed.");
  }

  const maxBytes = 5 * 1024 * 1024;
  if (file.size > maxBytes) {
    throw new Error("File exceeds maximum size of 5MB.");
  }

  const form = new FormData();
  form.append("resume", file);

  const { data } = await http.post<UploadResumeResponseDto>("/profile/upload-resume", form, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress(event) {
      if (!event.total) return;
      const percent = Math.round((event.loaded * 100) / event.total);
      onProgress?.(percent);
    },
  });

  return data;
}
