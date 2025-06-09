import { renderHook } from "@testing-library/react";
import { apiClient } from "@/lib/apiClient";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRace } from "./useRace";

jest.mock("../../../lib/apiClient");

describe("useRace", () => {
  it("calls the correct API endpoint", async () => {
    // Arrange
    (apiClient.get as jest.Mock).mockResolvedValue({
      data: {},
    });

    // Act
    const queryClient = new QueryClient();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
    renderHook(() => useRace("dc14b319-8abf-487e-868d-f19c43d1ca64"), { wrapper });

    // Assert
    expect(apiClient.get).toHaveBeenCalledWith("/v1/races/dc14b319-8abf-487e-868d-f19c43d1ca64");
  });
});
