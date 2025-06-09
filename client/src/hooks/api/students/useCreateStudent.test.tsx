import { renderHook, waitFor } from "@testing-library/react";
import { useCreateStudent } from "./useCreateStudent";
import { apiClient } from "@/lib/apiClient";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

jest.mock("../../../lib/apiClient", () => ({
  apiClient: {
    post: jest.fn(),
  },
}));

describe("useCreateStudent", () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => {
    const queryClient = new QueryClient();
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };

  it("calls apiClient.post with correct URL and payload", async () => {
    // Arrange
    const { result } = renderHook(() => useCreateStudent(), { wrapper });

    // Act
    result.current.mutate({
      name: "John Doe",
    });

    // Assert
    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledWith(`/v1/students`, {
        name: "John Doe",
      });
    });
  });
});
