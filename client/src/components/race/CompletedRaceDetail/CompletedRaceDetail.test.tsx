import React from "react";
import { render, screen } from "@testing-library/react";
import { CompletedRaceDetail } from "./index";
import { Race } from "@/types";

const mockRace: Race = {
  id: "63f85f8d-ad19-49d7-a332-f1b0149247e8",
  name: "100m Sprint",
  isCompleted: true,
  participants: [
    {
      student: { id: "04b92e8f-8876-4909-9f42-7498d4831744", name: "Alice" },
      lane: 1,
      position: 2,
    },
    {
      student: { id: "3dfbdef4-1bf1-4900-abaa-717a0938af5c", name: "Bob" },
      lane: 2,
      position: 1,
    },
    {
      student: { id: "f11f9612-b780-4fdc-8953-95c5895c66e9", name: "Charlie" },
      lane: 3,
      position: 3,
    },
    {
      student: { id: "8049e513-ae47-4c94-9f75-1fdfc59c292b", name: "David" },
      lane: 4,
      position: 4,
    },
  ],
};

describe("CompletedRaceDetail", () => {
  it("renders race title", () => {
    // Arrange
    render(<CompletedRaceDetail race={mockRace} />);

    // Assert
    expect(screen.getByText("Race Results")).toBeInTheDocument();
  });

  it("renders participants sorted by position", () => {
    // Arrange
    render(<CompletedRaceDetail race={mockRace} />);

    // Assert
    const badges = screen.getAllByText(/Lane/);
    expect(badges[0]).toHaveTextContent("Lane 2"); // Bob - 1st
    expect(badges[1]).toHaveTextContent("Lane 1"); // Alice - 2nd
    expect(badges[2]).toHaveTextContent("Lane 3"); // Charlie - 3rd
    expect(badges[3]).toHaveTextContent("Lane 4"); // David - 4th
  });

  it("displays correct suffix for positions", () => {
    // Arrange
    render(<CompletedRaceDetail race={mockRace} />);

    // Assert
    expect(screen.getByText("1st")).toBeInTheDocument();
    expect(screen.getByText("2nd")).toBeInTheDocument();
    expect(screen.getByText("3rd")).toBeInTheDocument();
    expect(screen.getByText("4th")).toBeInTheDocument();
  });

  it("displays medal badges for top 3", () => {
    // Arrange
    render(<CompletedRaceDetail race={mockRace} />);

    // Assert
    expect(screen.getByText("🥇 Gold Medal")).toBeInTheDocument();
    expect(screen.getByText("🥈 Silver Medal")).toBeInTheDocument();
    expect(screen.getByText("🥉 Bronze Medal")).toBeInTheDocument();
  });

  it("does not display medal badge for 4th and beyond", () => {
    // Arrange
    render(<CompletedRaceDetail race={mockRace} />);

    // Assert
    expect(screen.queryByText("4th Medal")).not.toBeInTheDocument();
  });
});
