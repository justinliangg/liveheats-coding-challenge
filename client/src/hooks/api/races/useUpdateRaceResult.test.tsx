import { renderHook, waitFor } from "@testing-library/react";
import { useUpdateRaceResult } from "./useUpdateRaceResult";
import { apiClient } from "@/lib/apiClient";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

jest.mock("../../../lib/apiClient", () => ({
  apiClient: {
    patch: jest.fn(),
  },
}));

describe("useUpdateRaceResult", () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => {
    const queryClient = new QueryClient();
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };

  const raceId = "63f85f8d-ad19-49d7-a332-f1b0149247e8";

  it("calls apiClient.patch with correct URL and payload", async () => {
    const { result } = renderHook(() => useUpdateRaceResult(raceId), { wrapper });

    const mockData = {
      results: [
        { studentId: "04b92e8f-8876-4909-9f42-7498d4831744", position: 1 },
        { studentId: "3dfbdef4-1bf1-4900-abaa-717a0938af5c", position: 2 },
      ],
    };

    result.current.mutate(mockData);

    await waitFor(() => {
      expect(apiClient.patch).toHaveBeenCalledWith(`/v1/races/${raceId}/results`, mockData);
    });
  });
});
