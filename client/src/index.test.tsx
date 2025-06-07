import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Home from "./pages";

describe("Home page", () => {
  it("renders the home page with hello world", async () => {
    // Arrange
    render(<Home />);

    // Assert
    expect(screen.getByRole("heading")).toHaveTextContent("Hello world");
  });
});
