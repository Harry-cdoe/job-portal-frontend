import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "../api/profile.api";
import type { ProfileDto, UpdateProfileRequestDto } from "../types";
import { queryKeys } from "@/shared/api/query-keys";

export function useUpdateProfile() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProfileRequestDto) => updateProfile(payload),
    onMutate: async (payload) => {
      await qc.cancelQueries({ queryKey: queryKeys.profile.me });

      const previous = qc.getQueryData<ProfileDto>(queryKeys.profile.me);
      if (previous) {
        qc.setQueryData<ProfileDto>(queryKeys.profile.me, { ...previous, ...payload });
      }

      return { previous };
    },
    onError: (_, __, context: { previous?: ProfileDto } | undefined) => {
      if (context?.previous) {
        qc.setQueryData(queryKeys.profile.me, context.previous);
      }
    },
    onSuccess: (data) => {
      qc.setQueryData<ProfileDto>(queryKeys.profile.me, data);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: queryKeys.profile.me });
    },
  });
}
