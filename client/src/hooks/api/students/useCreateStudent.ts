import { apiClient } from "@/lib/apiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../queryKeys";
import { Student } from "@/types";
import { toast } from "sonner";

interface CreateStudent {
  name: string;
}

export const useCreateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateStudent) => {
      const res = await apiClient.post<Student>(`/v1/students`, data);
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.students],
      });
    },
    onError: () => {
      toast.error("Failed to create student");
    },
  });
};
