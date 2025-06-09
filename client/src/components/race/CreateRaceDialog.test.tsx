import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import userEvent from "@testing-library/user-event";
import { CreateRaceDialog } from "./CreateRaceDialog";
import { useStudents } from "@/hooks/api/students/useStudents";
import { useCreateRace } from "@/hooks/api/races/useCreateRace";

jest.mock("../../hooks/api/students/useStudents");
jest.mock("../../hooks/api/races/useCreateRace", () => ({
  useCreateRace: jest.fn(),
}));

const mockStudents = [
  { id: "04b92e8f-8876-4909-9f42-7498d4831744", name: "Alice" },
  { id: "3dfbdef4-1bf1-4900-abaa-717a0938af5c", name: "Bob" },
  { id: "f11f9612-b780-4fdc-8953-95c5895c66e9", name: "Charlie" },
];

const renderDialog = () => {
  const queryClient = new QueryClient();

  (useStudents as jest.Mock).mockReturnValue({
    data: mockStudents,
  });

  render(
    <QueryClientProvider client={queryClient}>
      <CreateRaceDialog isOpen={true} onClose={jest.fn()} />
    </QueryClientProvider>
  );
};

describe("CreateRaceDialog", () => {
  const mutateMock = jest.fn();

  beforeEach(() => {
    mutateMock.mockReset();
    (useCreateRace as jest.Mock).mockReturnValue({
      mutate: mutateMock,
      isPending: false,
    });
  });

  it("renders dialog with initial form state", () => {
    // Arrange
    renderDialog();

    // Assert
    expect(screen.getByText("Create New Race")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter race name (e.g., 100m Sprint)")).toBeInTheDocument();
    expect(screen.getAllByText(/Lane \d/).length).toBe(2); // Should render 2 lanes
  });

  it("submits the form when valid data is provided", async () => {
    renderDialog();

    fireEvent.change(screen.getByPlaceholderText("Enter race name (e.g., 100m Sprint)"), {
      target: { value: "100m Sprint" },
    });

    const comboboxes = screen.getAllByRole("combobox");
    fireEvent.click(comboboxes[0]);
    fireEvent.click(screen.getByText("Alice"));

    fireEvent.click(comboboxes[1]);
    fireEvent.click(screen.getByText("Bob"));

    userEvent.click(screen.getByRole("button", { name: "Create Race" }));

    await waitFor(() => {
      expect(mutateMock).toHaveBeenCalledWith(
        {
          name: "100m Sprint",
          participants: [
            { studentId: "04b92e8f-8876-4909-9f42-7498d4831744", lane: 1 },
            { studentId: "3dfbdef4-1bf1-4900-abaa-717a0938af5c", lane: 2 },
          ],
        },
        {
          onSuccess: expect.any(Function),
          onError: expect.any(Function),
        }
      );
    });
  });
  
  it("validates and shows error when race name is missing", async () => {
    // Arrange
    renderDialog();

    // Act
    userEvent.click(screen.getByRole("button", { name: "Create Race" }));

    // Assert
    expect(await screen.findByText("Race name is required")).toBeInTheDocument();
    expect(mutateMock).not.toHaveBeenCalled();
  });

  it("validates and shows error when students are not selected for lanes", async () => {
    // Arrange
    renderDialog();

    // Act
    fireEvent.change(screen.getByPlaceholderText("Enter race name (e.g., 100m Sprint)"), {
      target: { value: "Test Race" },
    });
    userEvent.click(screen.getByRole("button", { name: "Create Race" }));

    // Assert
    expect(await screen.findByText("All lanes must have a student assigned")).toBeInTheDocument();
    expect(mutateMock).not.toHaveBeenCalled();
  });

  it("should not render already selected students for the student dropdown", async () => {
    // Arrange
    renderDialog();

    // Act
    fireEvent.change(screen.getByPlaceholderText("Enter race name (e.g., 100m Sprint)"), {
      target: { value: "100m Sprint" },
    });

    const comboboxes = screen.getAllByRole("combobox");

    fireEvent.click(comboboxes[0]);
    fireEvent.click(screen.getByText("Charlie"));

    // Only Alice and Bob should be available for the second dropdown
    fireEvent.click(comboboxes[1]);
    const listbox = screen.getByRole("listbox"); // Currently open dropdown
    const options = within(listbox).getAllByRole("option");

    expect(options).toHaveLength(2);
    expect(within(listbox).queryByText("Charlie")).not.toBeInTheDocument();
  });
});
