import { apiClient } from "@/lib/apiClient";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { QUERY_KEYS } from "../queryKeys";

interface UpdateRaceResult {
  results: {
    studentId: string;
    position: number;
  }[];
}

export const useUpdateRaceResult = (raceId: string) => {
  const queryClient = new QueryClient();

  return useMutation({
    mutationFn: async (data: UpdateRaceResult) => {
      await apiClient.patch<void>(`/v1/races/${raceId}/results`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.races, raceId],
      });
    },
  });
};
