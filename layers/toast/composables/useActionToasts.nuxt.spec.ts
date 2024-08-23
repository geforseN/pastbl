import { useActionToasts } from "./useActionToasts";

function makeActionToastsOptions() {
  const state = ref<Partial<Notification>[]>([]);

  const i18nLocale = ref("en");

  const options = {
    i18n: reactive({
      locale: computed({
        get() {
          return i18nLocale.value;
        },
        set(value) {
          i18nLocale.value = value;
        },
      }),
      t(string: string) {
        return this.locale + string;
      },
    }),
    state,
    toast: {
      add(notification: Partial<Notification>) {
        state.value.push(notification);
      },
    },
  };

  return options;
}

describe("useActionToasts", () => {
  suite("return value", () => {
    test("has success method", { concurrent: true }, ({ expect }) => {
      const options = makeActionToastsOptions();
      const actionsToast = useActionToasts(
        {
          action: { name: "test" },
          success() {
            return { description: "COOL!" };
          },
        },
        options,
      );
      expect(actionsToast.success).toBeTypeOf("function");
    });
  });

  suite("failure notification", ({ expect }) => {
    const options = makeActionToastsOptions();
    const actionsToast = useActionToasts(
      {
        action: { name: "test" },
        failures: {
          bad() {
            return { description: "BAD!" };
          },
        },
      },
      options,
    );
    test("has failure method", { concurrent: true }, ({ expect }) => {
      expect(actionsToast.failure).toBeTypeOf("function");
    });
    test(
      "returned notification from method has default color property",
      { concurrent: true },
      () => {
        expect(actionsToast.failure("bad")).toEqual({
          description: "BAD!",
          color: ACTION_TOASTS_NOTIFICATION_TYPE_COLORS.failure,
        });
      },
    );
  });

  suite("i18n locale change", () => {
    test("notifications are not same", ({ expect }) => {
      const options = makeActionToastsOptions();
      const actionsToast = useActionToasts(
        {
          action: { name: "test" },
          success() {
            return { description: this.i18n.t("test") };
          },
        },
        options,
      );
      const notification = actionsToast.success();
      options.i18n.locale = "ru";
      const notification2 = actionsToast.success();
      expect(notification).not.toEqual(notification2);
    });
  });
});
