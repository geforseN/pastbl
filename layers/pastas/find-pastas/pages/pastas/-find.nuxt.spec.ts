import { createPage, setup } from "@nuxt/test-utils/e2e";

describe.skip("pages/pastas/find", async () => {
  await setup();
  
  it("should render", async () => {
    const page = await createPage("/pastas/find");
    const heading = await page.getByRole("heading").innerText();
    expect(heading.length).toBeGreaterThan(0);
  });
});
