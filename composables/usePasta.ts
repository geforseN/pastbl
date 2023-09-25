import { Pasta } from "~/store/pastas.store";

export default function usePasta() {
  const tag = ref<Pasta["tags"][0]>("");
  const tags = ref<Pasta["tags"]>([]);
  const text = ref<Pasta["text"]>("");

  function onCreationError(
    error: unknown,
    event: PointerEvent,
    notificationsRef: Ref,
    toast: ReturnType<typeof useToast>
  ) {
    if (!(error instanceof ExtendedError)) {
      return;
    }
    notificationsRef.value.$el.style.position = "absolute";
    notificationsRef.value.$el.style.right = "auto";
    notificationsRef.value.$el.style.bottom = "auto";
    notificationsRef.value.$el.style.left = `${event.clientX + 20}px`;
    notificationsRef.value.$el.style.top = `${event.clientY + 20}px`;
    toast.add({
      ...error,
      callback: function setDefaultNotificationStyles() {
        if (!notificationsRef.value.$el) {
          return console.error("NO notificationsRef.$el", notificationsRef);
        }
        notificationsRef.value.$el.style.position = "fixed";
        notificationsRef.value.$el.style.left = "auto";
        notificationsRef.value.$el.style.top = "auto";
        notificationsRef.value.$el.style.right = "0px";
        notificationsRef.value.$el.style.bottom = "0px";
      },
    });
  }

  return {
    tag,
    tags,
    text,
    onCreationError,
  };
}
