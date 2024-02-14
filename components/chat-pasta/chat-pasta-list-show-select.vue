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
        v-for="[showStrategy, translated] of Object.entries(showOptions)"
        :key="showStrategy"
        :value="showStrategy"
        :disabled="!login && translated.mustHaveLogin"
        :title="
          !login && translated.mustHaveLogin
            ? $t(s + 'requestForSelect')
            : undefined
        "
      >
        {{ translated.text }}
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

const login = computed(() => props.selectedLogin);
const tOptions = reactive({ login });

const showOptions = computedWithControl(
  [locale, () => tOptions.login],
  () =>
    ({
      all: {
        text: t(so + "all"),
        mustHaveLogin: false,
      },
      "selected-user": {
        text: t(so + "selected-user", tOptions),
        mustHaveLogin: true,
      },
      "only-selected-user": {
        text: t(so + "only-selected-user", tOptions),
        mustHaveLogin: true,
      },
      "except-selected-user": {
        text: t(so + "except-selected-user", tOptions),
        mustHaveLogin: true,
      },
      "all-selectable-users": {
        text: t(so + "all-selectable-users"),
        mustHaveLogin: false,
      },
      "all-without-selectable-users": {
        text: t(so + "all-without-selectable-users"),
        mustHaveLogin: false,
      },
    }) satisfies Record<
      PastaShowStrategy,
      {
        text: string;
        mustHaveLogin: boolean;
      }
    >,
);
</script>
