import { defineStore } from "pinia";

export const useEditedPastasStore = defineStore(
  "edited-pastas",
  () => {
    const isUserEditingPasta = ref(false);
    const currentEditedPastaPrimaryKey = ref<number | null>(null);
    const editedPastasStorage = ref<MegaPasta[]>([]);

    return {
      editedPastasStorage,
      isUserEditingPasta,
      currentEditedPastaPrimaryKey,
    };
  },
  {
    persist: { storage: persistedState.localStorage },
  },
);

type A = {
  isUserEditingPasta: true;
  currentEditedPastaPrimaryKey: number;
};

type B = {
  isUserEditingPasta: false;
  currentEditedPastaPrimaryKey: null;
};
