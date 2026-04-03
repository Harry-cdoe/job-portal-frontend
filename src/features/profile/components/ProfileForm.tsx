import { memo } from "react";
import { Input } from "@/shared/ui/Input";
import { Button } from "@/shared/ui/Button";
import type { ProfileFormValues } from "../types";
import { SkillsInput } from "./SkillsInput";

interface ProfileFormProps {
  value: ProfileFormValues;
  onChange: (payload: ProfileFormValues) => void;
  errors: Partial<Record<keyof ProfileFormValues, string>>;
  onSubmit: () => void;
  isSaving: boolean;
}

function ProfileFormBase({ value, onChange, errors, onSubmit, isSaving }: ProfileFormProps) {
  const handleFieldChange = <T extends keyof ProfileFormValues>(field: T, fieldValue: ProfileFormValues[T]) => {
    onChange({ ...value, [field]: fieldValue });
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h2 className="mb-4 text-lg font-bold text-slate-800">Profile</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Name</label>
          <Input
            value={value.name}
            onChange={(e) => handleFieldChange("name", e.target.value)}
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Location</label>
          <Input
            value={value.location}
            onChange={(e) => handleFieldChange("location", e.target.value)}
            className={errors.location ? "border-red-500" : ""}
          />
          {errors.location && <p className="mt-1 text-xs text-red-500">{errors.location}</p>}
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700">Bio</label>
          <textarea
            value={value.bio}
            onChange={(e) => handleFieldChange("bio", e.target.value)}
            className={`h-28 w-full rounded-lg border px-3 py-2 text-sm outline-none ring-brand-500/30 focus:ring-4 ${
              errors.bio ? "border-red-500" : "border-slate-300"
            }`}
          />
          {errors.bio && <p className="mt-1 text-xs text-red-500">{errors.bio}</p>}
        </div>

        <div className="sm:col-span-2">
          <SkillsInput
            skills={value.skills}
            onChange={(updated) => handleFieldChange("skills", updated)}
            error={errors.skills}
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700">Years of experience</label>
          <Input
            type="number"
            min="0"
            step="1"
            value={value.experience}
            onChange={(e) => handleFieldChange("experience", e.target.value)}
            placeholder="e.g. 3"
            className={errors.experience ? "border-red-500" : ""}
          />
          {errors.experience && <p className="mt-1 text-xs text-red-500">{errors.experience}</p>}
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700">Education</label>
          <textarea
            value={value.education}
            onChange={(e) => handleFieldChange("education", e.target.value)}
            className={`h-24 w-full rounded-lg border px-3 py-2 text-sm outline-none ring-brand-500/30 focus:ring-4 ${
              errors.education ? "border-red-500" : "border-slate-300"
            }`}
          />
          {errors.education && <p className="mt-1 text-xs text-red-500">{errors.education}</p>}
        </div>
      </div>

      <Button
        type="submit"
        disabled={isSaving}
        className="mt-4 w-full justify-center px-4 py-3 text-sm font-semibold"
      >
        {isSaving ? "Saving..." : "Save profile"}
      </Button>
    </form>
  );
}

export const ProfileForm = memo(ProfileFormBase);
ProfileForm.displayName = "ProfileForm";
