import { fireEvent, render, screen } from "@testing-library/react";
import { StudentDropdown } from "./StudentDropdown";
import { useStudents } from "@/hooks/api/students/useStudents";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

jest.mock("../../hooks/api/students/useStudents");

const mockStudents = [
  { id: "04b92e8f-8876-4909-9f42-7498d4831744", name: "Alice" },
  { id: "3dfbdef4-1bf1-4900-abaa-717a0938af5c", name: "Bob" },
  { id: "f11f9612-b780-4fdc-8953-95c5895c66e9", name: "Charlie" },
];

describe("StudentDropdown", () => {
  const queryClient = new QueryClient();

  beforeEach(() => {
    (useStudents as jest.Mock).mockReturnValue({
      data: mockStudents,
    });
  });

  it("renders and shows selected value if provided", async () => {
    // Arrange
    render(
      <QueryClientProvider client={queryClient}>
        <StudentDropdown value="04b92e8f-8876-4909-9f42-7498d4831744" />{" "}
      </QueryClientProvider>
    );

    // Assert
    expect(screen.getByText("Alice")).toBeInTheDocument();
  });

  it("shows all students except excluded ones", async () => {
    // Arrange
    render(
      <QueryClientProvider client={queryClient}>
        <StudentDropdown value="" excludeValues={["3dfbdef4-1bf1-4900-abaa-717a0938af5c"]} />
      </QueryClientProvider>
    );

    // Act
    fireEvent.click(screen.getByRole("combobox"));

    // Assert
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.queryByText("Bob")).not.toBeInTheDocument();
    expect(screen.getByText("Charlie")).toBeInTheDocument();
  });

  it("calls onValueChange when an option is selected", async () => {
    // Arrange
    const onValueChange = jest.fn();
    render(
      <QueryClientProvider client={queryClient}>
        <StudentDropdown value="" onValueChange={onValueChange} />
      </QueryClientProvider>
    );

    // Act
    fireEvent.click(screen.getByRole("combobox"));
    fireEvent.click(screen.getByText("Bob"));

    // Assert
    expect(onValueChange).toHaveBeenCalledWith("3dfbdef4-1bf1-4900-abaa-717a0938af5c");
  });
});
