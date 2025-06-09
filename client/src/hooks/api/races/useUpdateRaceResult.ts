import { apiClient } from "@/lib/apiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../queryKeys";

interface UpdateRaceResult {
  results: {
    studentId: string;
    position: number;
  }[];
}

export const useUpdateRaceResult = (raceId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateRaceResult) => {
      await apiClient.patch<void>(`/v1/races/${raceId}/results`, data);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.races, raceId],
      });
    },
  });
};
