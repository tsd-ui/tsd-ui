import { describe, it, expect } from "vitest";
import { placeholder } from "./index";

describe("forms", () => {
  it("exports placeholder returning package name", () => {
    expect(placeholder()).toBe("@tsd-ui/forms");
  });
});
