import { describe, it, expect, expectTypeOf } from "vitest";
import type { IFormGroupWrapperProps, IFormPersistenceOptions } from "./index";
import type { IPersistenceOptions } from "@tsd-ui/core";

describe("forms wrapper types", () => {
  describe("IFormGroupWrapperProps", () => {
    it("accepts minimal props", () => {
      const props: IFormGroupWrapperProps = { name: "email" };
      expect(props.name).toBe("email");
      expect(props.isRequired).toBeUndefined();
    });

    it("accepts full props", () => {
      const props: IFormGroupWrapperProps = {
        name: "email",
        label: "Email Address",
        helperText: "Enter your email",
        isRequired: true,
        errorMessage: "Required",
      };
      expect(props.label).toBe("Email Address");
    });
  });

  describe("IFormPersistenceOptions", () => {
    it("extends core IPersistenceOptions", () => {
      const opts: IFormPersistenceOptions = {
        persistTo: "localStorage",
        prefix: "myForm",
        restoreOnMount: true,
      };
      expectTypeOf(opts).toMatchTypeOf<IPersistenceOptions>();
      expect(opts.restoreOnMount).toBe(true);
    });
  });
});
