import { apiClient } from "@/lib/apiClient";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../queryKeys";
import { Race } from "@/types";

export const useRace = (raceId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.races, raceId],
    queryFn: async () => {
      const res = await apiClient.get<Race>(`/v1/races/${raceId}`);
      return res.data;
    },
  });
};
