import { render, screen, waitFor } from "@testing-library/react";
import { QuickCreateStudentForm } from "./QuickCreateStudentForm";
import { useCreateStudent } from "@/hooks/api/students/useCreateStudent";
import userEvent from "@testing-library/user-event";
import React from "react";

jest.mock("../../hooks/api/students/useCreateStudent");

describe("QuickCreateStudentForm", () => {
  const mockMutateAsync = jest.fn();

  beforeEach(() => {
    (useCreateStudent as jest.Mock).mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
    });
    mockMutateAsync.mockReset();
  });

  it("should update the input value", async () => {
    // Arrange
    render(<QuickCreateStudentForm />);

    // Act
    const input = screen.getByPlaceholderText("Add new student...");
    await userEvent.type(input, "Alice");

    // Assert
    expect((input as HTMLInputElement).value).toBe("Alice");
  });

  it("should not call createStudent if input is empty", async () => {
    // Arrange
    render(<QuickCreateStudentForm />);

    // Act
    const button = screen.getByRole("button", { name: /add/i });
    await userEvent.click(button);

    // Assert
    expect(mockMutateAsync).not.toHaveBeenCalled();
  });

  it("should call createStudent with correct data", async () => {
    // Arrange
    render(<QuickCreateStudentForm />);

    // Act
    const input = screen.getByPlaceholderText("Add new student...");
    const button = screen.getByRole("button", { name: /add/i });

    await userEvent.type(input, " Bob ");
    await userEvent.click(button);

    // Assert
    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({ name: "Bob" });
    });
  });

  it("should clear input after successful submission", async () => {
    // Arrange
    render(<QuickCreateStudentForm />);

    // Act
    const input = screen.getByPlaceholderText("Add new student...");
    const button = screen.getByRole("button", { name: /add/i });

    await userEvent.type(input, "Charlie");
    await userEvent.click(button);

    // Assert
    await waitFor(() => {
      expect((input as HTMLInputElement).value).toBe("");
    });
  });
});
