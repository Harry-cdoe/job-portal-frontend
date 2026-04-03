import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadResume } from "../api/profile.api";
import type { ProfileDto } from "../types";
import { queryKeys } from "@/shared/api/query-keys";

export function useUploadResume() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ file, onProgress }: { file: File; onProgress?: (percentage: number) => void }) =>
      uploadResume(file, onProgress),
    onMutate: async ({ file }) => {
      await qc.cancelQueries({ queryKey: queryKeys.profile.me });
      const prev = qc.getQueryData<ProfileDto>(queryKeys.profile.me);
      if (prev) {
        qc.setQueryData<ProfileDto>(queryKeys.profile.me, { ...prev, resumeName: file.name });
      }
      return { previous: prev };
    },
    onError: (_error, _variables, context: { previous?: ProfileDto } | undefined) => {
      if (context?.previous) {
        qc.setQueryData(queryKeys.profile.me, context.previous);
      }
    },
    onSuccess: (data) => {
      qc.setQueryData<ProfileDto | undefined>(queryKeys.profile.me, (old) =>
        old
          ? { ...old, resumeName: data.resumeName, resumeUrl: data.resumeUrl }
          : old
      );
      qc.invalidateQueries({ queryKey: queryKeys.profile.me });
    },
  });
}
