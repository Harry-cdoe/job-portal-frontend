"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { ProfileForm } from "@/features/profile/components/ProfileForm";
import { ProfileCompletionBar } from "@/features/profile/components/ProfileCompletionBar";
import { ResumeUpload } from "@/features/profile/components/ResumeUpload";
import { useProfile } from "@/features/profile/hooks/useProfile";
import { useUpdateProfile } from "@/features/profile/hooks/useUpdateProfile";
import { useUploadResume } from "@/features/profile/hooks/useUploadResume";
import { PageHeader } from "@/shared/ui/PageHeader";
import { Skeleton } from "@/shared/ui/Skeleton";
import type { ProfileDto, ProfileFormValues, UpdateProfileRequestDto } from "@/features/profile/types";

const initialProfile: ProfileFormValues = {
  name: "",
  bio: "",
  skills: [],
  experience: "",
  education: "",
  location: "",
};

const mapProfileToForm = (profile: Partial<ProfileFormValues> | Partial<ProfileDto>): ProfileFormValues => ({
  ...initialProfile,
  ...profile,
  experience:
    typeof profile.experience === "number"
      ? String(profile.experience)
      : typeof profile.experience === "string"
        ? profile.experience
        : "",
});

const validate = (payload: ProfileFormValues) => {
  const errs: Partial<Record<keyof ProfileFormValues, string>> = {};
  const normalizedExperience = Number(payload.experience);

  if (!payload.name.trim()) errs.name = "Name is required.";
  if (!payload.location.trim()) errs.location = "Location is required.";
  if (!payload.bio.trim()) errs.bio = "Bio is required.";
  if (!payload.experience.trim()) {
    errs.experience = "Experience is required.";
  } else if (!Number.isFinite(normalizedExperience) || normalizedExperience < 0) {
    errs.experience = "Enter a valid number of years.";
  }
  if (!payload.education.trim()) errs.education = "Education is required.";
  if (!payload.skills.length) errs.skills = "Add at least one skill.";

  return errs;
};

export default function CandidateProfilePage() {
  const { data: profile, isLoading: isFetching } = useProfile();
  const updateProfile = useUpdateProfile();
  const uploadResume = useUploadResume();

  const [form, setForm] = useState<ProfileFormValues>(initialProfile);
  const [errors, setErrors] = useState<Partial<Record<keyof ProfileFormValues, string>>>({});
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (profile) {
      setForm(mapProfileToForm(profile));
    }
  }, [profile]);

  const summaryProfile = useMemo(() => ({ ...initialProfile, ...(profile ?? {}), ...form }), [profile, form]);

  const handleSubmit = async () => {
    const payload: UpdateProfileRequestDto = {
      name: form.name,
      bio: form.bio,
      skills: form.skills,
      experience: Number(form.experience),
      education: form.education,
      location: form.location,
    };

    const validation = validate(form);
    setErrors(validation);

    if (Object.keys(validation).length) {
      toast.error("Please fix the highlighted fields.");
      return;
    }

    try {
      const savedProfile = await updateProfile.mutateAsync(payload);
      setForm(mapProfileToForm(savedProfile));
      toast.success("Profile saved.");
    } catch {
      toast.error("Unable to save profile.");
    }
  };

  const handleResumeUpload = async (file: File) => {
    setUploadProgress(0);
    try {
      await uploadResume.mutateAsync({
        file,
        onProgress: (percent) => setUploadProgress(percent),
      });
      toast.success("Resume uploaded successfully.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Resume upload failed.";
      toast.error(message);
    } finally {
      setUploadProgress(0);
    }
  };

  if (isFetching) {
    return (
      <section className="space-y-4">
        <PageHeader title="Profile" subtitle="Update your candidate profile & resume." />
        <div className="grid gap-4 lg:grid-cols-3">
          <Skeleton className="h-12 w-2/3" />
          <Skeleton className="h-[320px] w-full lg:col-span-2" />
          <Skeleton className="h-[480px] w-full lg:col-span-3" />
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <PageHeader title="Profile" subtitle="Update your candidate profile & resume." />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ProfileForm
            value={form}
            onChange={setForm}
            errors={errors}
            onSubmit={handleSubmit}
            isSaving={updateProfile.isPending}
          />
        </div>

        <div className="space-y-4">
          <ProfileCompletionBar profile={summaryProfile} />
          <ResumeUpload
            resumeName={summaryProfile.resumeName}
            resumeUrl={summaryProfile.resumeUrl}
            isUploading={uploadResume.isPending}
            progress={uploadProgress}
            onUpload={handleResumeUpload}
          />
        </div>
      </div>
    </section>
  );
}
