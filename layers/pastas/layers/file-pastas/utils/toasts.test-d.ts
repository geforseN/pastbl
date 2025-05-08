import { useLoadPastasFromFileToast } from "./toasts";

describe("file-pastas toasts", () => {
  test.todo("types", () => {
    const toast = useLoadPastasFromFileToast();
    const reason = new Error("Error");
    const unknown: unknown = 1;

    it.todo("must be no typescript errors", () => {
      toast.panic("incorrectFileContent");
      toast.panic(reason);
      toast.panic(unknown);
    });
  });
});
