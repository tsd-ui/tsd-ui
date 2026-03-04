import { describe, it, expect } from "vitest";
import { placeholder } from "./index";

describe("table-controls", () => {
  it("exports placeholder returning package name", () => {
    expect(placeholder()).toBe("@tsd-ui/table-controls");
  });
});
