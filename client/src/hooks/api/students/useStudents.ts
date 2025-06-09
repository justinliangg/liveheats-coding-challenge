import { apiClient } from "@/lib/apiClient";
import { Student } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../queryKeys";

export const useStudents = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.students],
    queryFn: async () => {
      const res = await apiClient.get<Student[]>("/v1/students");
      return res.data;
    },
  });
};
