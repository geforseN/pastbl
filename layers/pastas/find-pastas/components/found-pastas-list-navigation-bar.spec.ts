import { describe, suite, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import foundPastasListNavigationBar from "./found-pastas-list-navigation-bar.vue";

const isParentComponentRefactoredOrPiniaMocked = false;

describe("<found-pastas-list-navigation-bar />", () => {
  describe("<input />", () => {
    suite("some cool suite", { sequential: true }, () => {
      const wrapper = mount(foundPastasListNavigationBar, {
        props: {
          pastasCount: 10,
          selectedNumber: 1,
        },
      });
      const input = wrapper.find<HTMLInputElement>(
        "[data-test='found-pastas:selected-number']",
      );
      it("is defined in template", () => {
        expect(input.exists()).toBe(true);
      });

      it("is input element", () => {
        expect(input.element).instanceOf(HTMLInputElement);
      });

      it("has provided value", () => {
        expect(input.element.value).toBe(String(1));
      });

      it("will update value to value bigger than pastasCount", () => {
        input.setValue(30);
        expect(input.element.value).toBe(String(30));
      });

      it.runIf(isParentComponentRefactoredOrPiniaMocked)(
        "will update value to when pastasCount is changed to lower pastasCount value",
        async () => {
          // await wrapper.setProps({ pastasCount: 0 });
          await nextTick();
          expect(input.element.value).not.toBe(String(30));
        },
      );
    });
  });
});
