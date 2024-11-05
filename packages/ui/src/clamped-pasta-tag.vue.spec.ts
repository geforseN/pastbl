import { test } from "vitest";
import { render, screen } from "@testing-library/vue";
import ClampedPastaTag from "./clamped-pasta-tag.vue";

test("clamped-pasta-tag", async () => {
  render(ClampedPastaTag, {
    props: {
      tag: "Clamped Pasta Tag 456",
    },
  });
  screen.getByTestId("clamped-pasta-tag");
  screen.getByText("Clamped Pasta Tag 456");
});
