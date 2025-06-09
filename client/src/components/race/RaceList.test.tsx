import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { RaceList } from "./RaceList";
import { useRaces } from "@/hooks/api/useRaces";
import userEvent from "@testing-library/user-event";

jest.mock("../../hooks/api/useRaces", () => ({
  useRaces: jest.fn(),
}));

describe("RaceList component", () => {
  const onRaceSelectMock = jest.fn();

  it("should display the list of races", async () => {
    // Arrange
    (useRaces as jest.Mock).mockReturnValue({
      isLoading: false,
      isError: false,
      data: MOCK_RACES,
    });

    // Act
    render(<RaceList onRaceSelect={onRaceSelectMock} />);

    // Assert
    expect(screen.getByText("100m Sprint")).toBeInTheDocument();
    expect(screen.getByText("400m Dash")).toBeInTheDocument();

    expect(screen.getByText("Completed")).toBeInTheDocument();
    expect(screen.getByText("Awaiting Results")).toBeInTheDocument();
    expect(screen.getAllByText("2 participants")).toHaveLength(2);
  });

  it("should pass the correct raceId when a race is selected", async () => {
    // Arrange
    (useRaces as jest.Mock).mockReturnValue({
      isLoading: false,
      isError: false,
      data: MOCK_RACES,
    });

    // Act
    render(<RaceList onRaceSelect={onRaceSelectMock} />);
    const buttons = screen.getAllByRole("button");
    await userEvent.click(buttons[0]);

    // Assert
    expect(onRaceSelectMock).toHaveBeenCalledWith("a1b2c3d4-1000-4000-8000-abcde1234567");
  });

  it("should render the loading state", () => {
    // Arrange
    (useRaces as jest.Mock).mockReturnValue({
      isLoading: true,
      isError: false,
      data: null,
    });

    // Act
    render(<RaceList onRaceSelect={onRaceSelectMock} />);

    // Assert
    const loadingSpinner = screen.getByLabelText(/loading/i);
    expect(loadingSpinner).toBeInTheDocument();
  });

  it("should render the error state", () => {
    // Arrange
    (useRaces as jest.Mock).mockReturnValue({
      isLoading: false,
      isError: true,
      data: null,
    });

    // Act
    render(<RaceList onRaceSelect={onRaceSelectMock} />);

    // Assert
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });
});

const MOCK_RACES = [
  {
    id: "a1b2c3d4-1000-4000-8000-abcde1234567",
    name: "100m Sprint",
    isCompleted: false,
    participants: [
      {
        student: {
          id: "11111111-aaaa-bbbb-cccc-1234567890ab",
          name: "Eli Thompson",
        },
        lane: 4,
        position: null,
      },
      {
        student: {
          id: "22222222-bbbb-cccc-dddd-2345678901bc",
          name: "Jordan Wright",
        },
        lane: 5,
        position: null,
      },
    ],
  },
  {
    id: "b2c3d4e5-2000-5000-9000-bcdef2345678",
    name: "400m Dash",
    isCompleted: true,
    participants: [
      {
        student: {
          id: "33333333-cccc-dddd-eeee-3456789012cd",
          name: "Maya Chen",
        },
        lane: 2,
        position: 1,
      },
      {
        student: {
          id: "44444444-dddd-eeee-ffff-4567890123de",
          name: "Liam Patel",
        },
        lane: 3,
        position: 2,
      },
    ],
  },
];
