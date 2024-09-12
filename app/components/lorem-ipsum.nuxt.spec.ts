import { mountSuspended } from "@nuxt/test-utils/runtime";
import { LoremIpsum } from "#build/components";

describe("<lorem-ipsum />", () => {
  it("has correct numbers inside text", async () => {
    const component = await mountSuspended(LoremIpsum, {
      props: {
        count: 3,
      },
    });
    const text = component.text();
    expect(text).toContain(1);
    expect(text).toContain(3);
    expect(text).not.toContain(4);
    expect(text).not.toContain(0);
  });
});
