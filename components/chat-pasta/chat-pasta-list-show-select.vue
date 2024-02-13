<template>
  <div class="flex items-baseline justify-between">
    <label for="show-pastas" class="label font-bold">
      {{ t(s + "label") }}
    </label>
    <select
      id="show-pastas"
      v-model="selectedShowStrategy"
      name="show-pastas"
      class="select select-secondary select-sm w-1/2"
    >
      <option
        v-for="[showStrategy, translatedText] of Object.entries(showOptions)"
        :key="showStrategy"
        :value="showStrategy"
      >
        {{ translatedText }}
      </option>
    </select>
  </div>
</template>
<script lang="ts" setup>
import { l } from "~/components/chat-pasta/chat-pasta-list.vue";

const selectedShowStrategy = defineModel<PastaShowStrategy>({ required: true });

const props = defineProps<{
  selectedLogin: Lowercase<string> | "";
}>();

const s = l + "show.";
const so = l + "show.options.";
const { t, locale } = useI18n();
const tOptions = reactive({
  login: computed(() => props.selectedLogin),
});

const showOptions = computedWithControl(
  [locale, () => tOptions.login],
  () =>
    ({
      all: t(so + "all"),
      "selected-user": t(so + "selected-user", tOptions),
      "only-selected-user": t(so + "only-selected-user", tOptions),
      "except-selected-user": t(so + "except-selected-user", tOptions),
      "all-selectable-users": t(so + "all-selectable-users"),
      "all-without-selectable-users": t(so + "all-without-selectable-users"),
    }) satisfies Record<PastaShowStrategy, string>,
);
</script>
