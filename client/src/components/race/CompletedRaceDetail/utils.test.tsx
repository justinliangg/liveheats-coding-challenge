import { render } from "@testing-library/react";
import { getMedalColor, getPositionSuffix, getMedalIcon } from "./utils";

describe("getMedalColor", () => {
  it("returns correct color for 1st place", () => {
    expect(getMedalColor(1)).toBe("bg-yellow-500 text-white");
  });

  it("returns correct color for 2nd place", () => {
    expect(getMedalColor(2)).toBe("bg-gray-400 text-white");
  });

  it("returns correct color for 3rd place", () => {
    expect(getMedalColor(3)).toBe("bg-amber-600 text-white");
  });

  it("returns default color for other positions", () => {
    expect(getMedalColor(4)).toBe("bg-gray-200 text-gray-800");
    expect(getMedalColor(0)).toBe("bg-gray-200 text-gray-800");
  });
});

describe("getPositionSuffix", () => {
  it("returns 'st' for 1st", () => {
    expect(getPositionSuffix(1)).toBe("st");
    expect(getPositionSuffix(21)).toBe("st");
  });

  it("returns 'nd' for 2nd", () => {
    expect(getPositionSuffix(2)).toBe("nd");
    expect(getPositionSuffix(22)).toBe("nd");
  });

  it("returns 'rd' for 3rd", () => {
    expect(getPositionSuffix(3)).toBe("rd");
    expect(getPositionSuffix(23)).toBe("rd");
  });

  it("returns 'th' for numbers ending in 4–9 or 0", () => {
    expect(getPositionSuffix(4)).toBe("th");
    expect(getPositionSuffix(10)).toBe("th");
    expect(getPositionSuffix(100)).toBe("th");
  });

  it("returns 'th' for 11th, 12th, 13th", () => {
    expect(getPositionSuffix(11)).toBe("th");
    expect(getPositionSuffix(12)).toBe("th");
    expect(getPositionSuffix(13)).toBe("th");
  });
});

describe("getMedalIcon", () => {
  it("returns Trophy icon for 1st place", () => {
    const { container } = render(getMedalIcon(1)!);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("returns Medal icon for 2nd place", () => {
    const { container } = render(getMedalIcon(2)!);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("returns Award icon for 3rd place", () => {
    const { container } = render(getMedalIcon(3)!);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("returns null for 4th or other positions", () => {
    expect(getMedalIcon(4)).toBeNull();
    expect(getMedalIcon(10)).toBeNull();
  });
});
