import { renderHook, waitFor } from "@testing-library/react";
import { apiClient } from "@/lib/apiClient";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCreateRace } from "./useCreateRace";

jest.mock("../../../lib/apiClient", () => ({
  apiClient: {
    post: jest.fn(),
  },
}));

describe("useCreateRace", () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => {
    const queryClient = new QueryClient();
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };

  it("calls apiClient.post with correct URL and payload", async () => {
    // Arrange
    const { result } = renderHook(() => useCreateRace(), { wrapper });
    const mockData = {
      name: "Test race",
      participants: [
        { studentId: "04b92e8f-8876-4909-9f42-7498d4831744", lane: 1 },
        { studentId: "3dfbdef4-1bf1-4900-abaa-717a0938af5c", lane: 2 },
      ],
    };

    // Act
    result.current.mutate(mockData);

    // Assert
    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledWith(`/v1/races`, mockData);
    });
  });
});
