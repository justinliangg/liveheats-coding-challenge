import { renderHook } from "@testing-library/react";
import { useRaces } from "./useRaces";
import { apiClient } from "@/lib/apiClient";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

jest.mock("../../../lib/apiClient");

describe("useRaces", () => {
  it("calls the correct API endpoint", async () => {
    // Arrange
    (apiClient.get as jest.Mock).mockResolvedValue({
      data: [],
    });

    // Act
    const queryClient = new QueryClient();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
    renderHook(() => useRaces(), { wrapper });

    // Assert
    expect(apiClient.get).toHaveBeenCalledWith("/v1/races");
  });
});
