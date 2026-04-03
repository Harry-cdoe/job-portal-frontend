export interface ProfileDto {
  id?: number;
  name: string;
  bio: string;
  skills: string[];
  experience: number;
  education: string;
  location: string;
  resumeName?: string;
  resumeUrl?: string;
}

export interface ProfileApiEntity {
  id?: number;
  email?: string;
  role?: string;
  fullName?: string;
  bio?: string;
  skills?: string[];
  experience?: number;
  education?: string;
  location?: string;
  resumeUrl?: string;
}

export interface ProfileApiResponseDto {
  profile?: ProfileApiEntity;
  completeness?: number;
}

export interface UpdateProfileRequestDto {
  name: string;
  bio: string;
  skills: string[];
  experience: number;
  education: string;
  location: string;
}

export interface ProfileFormValues {
  name: string;
  bio: string;
  skills: string[];
  experience: string;
  education: string;
  location: string;
  resumeName?: string;
  resumeUrl?: string;
}

export interface UploadResumeResponseDto {
  resumeName: string;
  resumeUrl: string;
}
