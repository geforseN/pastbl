import { it, expect } from "vitest";
import { methodsToTransform } from "./methods-to-transform";

it.skip("will throw if 'methods' is not an object", () => {
  const fn = () => {};
  expect(() => {
    methodsToTransform.define("failures", fn);
  }).toThrow();
});

it.skip("will not throw if 'methods' is an object empty object", () => {
  expect(() => {
    methodsToTransform.define("failures", {});
  }).not.toThrow();
});

describe.skip("after successful define", () => {
  const toastMaker = methodsToTransform.define("failures", {
    foo() {
      return {
        description: this.i18n.t("foo"),
      };
    },
  });

  it("will throw if methodName is not methods", () => {
    expect(() => {
      // @ts-expect-error bar is not in methods
      toastMaker("bar");
    }).toThrow();
  });

  it("will not throw if methodName in methods", () => {
    expect(() => {
      toastMaker("foo");
    }).not.toThrow();
  });
});
