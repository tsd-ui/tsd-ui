import { describe, it, expect } from "vitest";
import { noop } from "./index";

describe("core", () => {
  it("exports noop without throwing", () => {
    expect(noop()).toBeUndefined();
  });
});
