import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { RaceResultForm } from "./RaceResultForm";
import React from "react";

jest.mock("../../hooks/api/races/useUpdateRaceResult", () => ({
  useUpdateRaceResult: jest.fn(),
}));

import { useUpdateRaceResult } from "@/hooks/api/races/useUpdateRaceResult";

const mockRace = {
  id: "63f85f8d-ad19-49d7-a332-f1b0149247e8",
  name: "100m Sprint",
  isCompleted: false,
  participants: [
    {
      student: {
        id: "04b92e8f-8876-4909-9f42-7498d4831744",
        name: "Alice",
      },
      lane: 1,
      position: null,
    },
    {
      student: {
        id: "3dfbdef4-1bf1-4900-abaa-717a0938af5c",
        name: "Bob",
      },
      lane: 2,
      position: null,
    },
    {
      student: {
        id: "f11f9612-b780-4fdc-8953-95c5895c66e9",
        name: "Charlie",
      },
      lane: 3,
      position: null,
    },
    {
      student: {
        id: "b21aaa06-a633-4e32-843a-d2dd6f393fb7",
        name: "John",
      },
      lane: 4,
      position: null,
    },
  ],
};

describe("RaceResultForm", () => {
  const mutateMock = jest.fn();

  beforeEach(() => {
    mutateMock.mockReset();
    (useUpdateRaceResult as jest.Mock).mockReturnValue({
      mutate: mutateMock,
      isPending: false,
    });
  });

  it("should render all participants", () => {
    // Act
    render(<RaceResultForm race={mockRace} />);

    // Assert
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("Charlie")).toBeInTheDocument();
    expect(screen.getByText("John")).toBeInTheDocument();
  });

  it("should submit valid race results", async () => {
    // Arrange
    render(<RaceResultForm race={mockRace} />);

    // Act
    fireEvent.change(screen.getByTestId("position-input-04b92e8f-8876-4909-9f42-7498d4831744"), {
      target: { value: "1" },
    });
    fireEvent.change(screen.getByTestId("position-input-3dfbdef4-1bf1-4900-abaa-717a0938af5c"), {
      target: { value: "2" },
    });
    fireEvent.change(screen.getByTestId("position-input-f11f9612-b780-4fdc-8953-95c5895c66e9"), {
      target: { value: "3" },
    });
    fireEvent.change(screen.getByTestId("position-input-b21aaa06-a633-4e32-843a-d2dd6f393fb7"), {
      target: { value: "4" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Submit Results" }));

    // Assert
    await waitFor(() => {
      expect(mutateMock).toHaveBeenCalledWith(
        {
          results: [
            {
              studentId: "04b92e8f-8876-4909-9f42-7498d4831744",
              position: 1,
            },
            {
              studentId: "3dfbdef4-1bf1-4900-abaa-717a0938af5c",
              position: 2,
            },
            {
              studentId: "f11f9612-b780-4fdc-8953-95c5895c66e9",
              position: 3,
            },
            {
              studentId: "b21aaa06-a633-4e32-843a-d2dd6f393fb7",
              position: 4,
            },
          ],
        },
        {
          onSuccess: expect.any(Function),
          onError: expect.any(Function),
        }
      );
    });
  });

  it("should submit results if a tie is correctly handled", async () => {
    // Arrange
    render(<RaceResultForm race={mockRace} />);

    // Act
    fireEvent.change(screen.getByTestId("position-input-04b92e8f-8876-4909-9f42-7498d4831744"), {
      target: { value: "1" },
    });
    fireEvent.change(screen.getByTestId("position-input-3dfbdef4-1bf1-4900-abaa-717a0938af5c"), {
      target: { value: "1" },
    });
    fireEvent.change(screen.getByTestId("position-input-f11f9612-b780-4fdc-8953-95c5895c66e9"), {
      target: { value: "3" },
    });
    fireEvent.change(screen.getByTestId("position-input-b21aaa06-a633-4e32-843a-d2dd6f393fb7"), {
      target: { value: "4" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Submit Results" }));

    // Assert
    await waitFor(() => {
      expect(mutateMock).toHaveBeenCalledWith(
        {
          results: [
            {
              studentId: "04b92e8f-8876-4909-9f42-7498d4831744",
              position: 1,
            },
            {
              studentId: "3dfbdef4-1bf1-4900-abaa-717a0938af5c",
              position: 1,
            },
            {
              studentId: "f11f9612-b780-4fdc-8953-95c5895c66e9",
              position: 3,
            },
            {
              studentId: "b21aaa06-a633-4e32-843a-d2dd6f393fb7",
              position: 4,
            },
          ],
        },
        {
          onSuccess: expect.any(Function),
          onError: expect.any(Function),
        }
      );
    });
  });

  it("should display error if there are missing positions", async () => {
    // Arrange
    render(<RaceResultForm race={mockRace} />);

    // Act
    fireEvent.change(screen.getByTestId("position-input-04b92e8f-8876-4909-9f42-7498d4831744"), {
      target: { value: "1" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Submit Results" }));

    // Assert
    expect(await screen.findByText("All students must have a position assigned")).toBeInTheDocument();
    expect(mutateMock).not.toHaveBeenCalled();
  });

  it("should display error if there is a gap in the positioning", async () => {
    // Arrange
    render(<RaceResultForm race={mockRace} />);

    // Act
    fireEvent.change(screen.getByTestId("position-input-04b92e8f-8876-4909-9f42-7498d4831744"), {
      target: { value: "1" },
    });
    fireEvent.change(screen.getByTestId("position-input-3dfbdef4-1bf1-4900-abaa-717a0938af5c"), {
      target: { value: "3" },
    });
    fireEvent.change(screen.getByTestId("position-input-f11f9612-b780-4fdc-8953-95c5895c66e9"), {
      target: { value: "4" },
    });
    fireEvent.change(screen.getByTestId("position-input-b21aaa06-a633-4e32-843a-d2dd6f393fb7"), {
      target: { value: "5" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Submit Results" }));

    // Assert
    expect(await screen.findByText(/Invalid position sequence/)).toBeInTheDocument();
    expect(mutateMock).not.toHaveBeenCalled();
  });

  it("should display error if there is a tie is incorrectly handled", async () => {
    // Arrange
    render(<RaceResultForm race={mockRace} />);

    // Act
    fireEvent.change(screen.getByTestId("position-input-04b92e8f-8876-4909-9f42-7498d4831744"), {
      target: { value: "1" },
    });
    fireEvent.change(screen.getByTestId("position-input-3dfbdef4-1bf1-4900-abaa-717a0938af5c"), {
      target: { value: "1" },
    });
    fireEvent.change(screen.getByTestId("position-input-f11f9612-b780-4fdc-8953-95c5895c66e9"), {
      target: { value: "2" },
    });
    fireEvent.change(screen.getByTestId("position-input-b21aaa06-a633-4e32-843a-d2dd6f393fb7"), {
      target: { value: "3" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Submit Results" }));

    // Assert
    expect(await screen.findByText(/Invalid position sequence/)).toBeInTheDocument();
    expect(mutateMock).not.toHaveBeenCalled();
  });
});
