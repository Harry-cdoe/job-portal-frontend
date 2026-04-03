import { memo, useMemo } from "react";
import type { ProfileDto, ProfileFormValues } from "../types";

interface ProfileCompletionBarProps {
  profile: ProfileDto | ProfileFormValues;
}

function ProfileCompletionBarBase({ profile }: ProfileCompletionBarProps) {
  const hasExperience =
    typeof profile.experience === "number"
      ? Number.isFinite(profile.experience) && profile.experience >= 0
      : profile.experience.trim().length > 0;

  const fields = useMemo(
    () => [
      { key: "name", filled: Boolean(profile.name?.trim()), description: "Add your full name" },
      { key: "bio", filled: Boolean(profile.bio?.trim()), description: "Add a personal summary" },
      { key: "skills", filled: profile.skills?.length > 0, description: "Add relevant skills" },
      { key: "experience", filled: hasExperience, description: "Add your years of experience" },
      { key: "education", filled: Boolean(profile.education?.trim()), description: "Add education history" },
      { key: "location", filled: Boolean(profile.location?.trim()), description: "Add location" },
      { key: "resume", filled: Boolean(profile.resumeName), description: "Upload your resume" },
    ],
    [hasExperience, profile]
  );

  const percentage = useMemo(() => Math.round((fields.filter((f) => f.filled).length / fields.length) * 100), [fields]);

  const missing = fields.filter((f) => !f.filled).map((f) => f.description);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-700">Profile completeness</p>
        <p className="text-xs font-semibold text-slate-500">{percentage}%</p>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
        <div className="h-full rounded-full bg-green-500" style={{ width: `${percentage}%` }} />
      </div>
      {missing.length > 0 && (
        <div className="mt-3">
          <p className="text-xs font-medium text-slate-500">Missing / suggestions</p>
          <ul className="mt-1 list-disc space-y-1 pl-5 text-xs text-slate-600">
            {missing.slice(0, 4).map((item) => (
              <li key={item}>{item}</li>
            ))}
            {missing.length > 4 && <li>And {missing.length - 4} more suggestions...</li>}
          </ul>
        </div>
      )}
    </div>
  );
}

export const ProfileCompletionBar = memo(ProfileCompletionBarBase);
ProfileCompletionBar.displayName = "ProfileCompletionBar";
