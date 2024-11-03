export type IAppTab = {
  key: string;
  label: string;
  disabled?: boolean;
};

const createTabs = () => [
  { key: "create", label: "Create", disabled: true },
  { key: "list", label: "List" },
] as const satisfies IAppTab [];

type TabKey = ReturnType<typeof createTabs>[number]["key"];

export function useAppTabs() {
  const tabs = ref(createTabs());

  const selectedTagKey = ref<TabKey>("list");

  return {
    tabs,
    selectedTagKey,
  };
}
