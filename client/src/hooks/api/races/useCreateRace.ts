import { apiClient } from "@/lib/apiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../queryKeys";

interface CreateRace {
  name: string;
  participants: {
    lane: number;
    studentId: string;
  }[];
}

export const useCreateRace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateRace) => {
      await apiClient.post<void>(`/v1/races`, data);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.races],
      });
    },
  });
};
