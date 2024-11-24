import { test, expect } from "vitest";
import { render, screen } from "@testing-library/vue";
import PastaTag from "./pasta-tag.vue";

test("pasta-tag", async () => {
  render(PastaTag, {
    props: {
      tag: "Pasta Tag 123",
    },
  });
  screen.getByTestId("pasta-tag");
  screen.getByText("Pasta Tag 123");
});

test("tagged has background class", () => {
  render(PastaTag, {
    props: {
      tag: "@geforsen",
    },
  });

  expect(screen.getByText("@geforsen").classList).toContain("bg-twitch-accent");
});
