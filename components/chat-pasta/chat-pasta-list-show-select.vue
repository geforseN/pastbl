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
        v-for="[showStrategy, translated] of showEntries"
        :key="showStrategy"
        :value="showStrategy"
        :disabled="!selectedLogin && translated.mustHaveUserCollection"
        :title="
          !selectedLogin && translated.mustHaveUserCollection
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
  selectedLogin: SelectedLogin;
}>();

const s = l + "show.";
const so = l + "show.options.";
const { t, locale } = useI18n();

const selectedLogin = computed(() => props.selectedLogin);
const tOptions = reactive({
  login: computed(() => selectedLogin.value || "username"),
});

const showEntries = computedWithControl(
  [locale, () => tOptions.login],
  () =>
    [
      [
        "all",
        {
          text: t(so + "all"),
          mustHaveUserCollection: false,
        },
      ],
      [
        "selected-user",
        {
          text: t(so + "selected-user", tOptions),
          mustHaveUserCollection: true,
        },
      ],
      [
        "only-selected-user",
        {
          text: t(so + "only-selected-user", tOptions),
          mustHaveUserCollection: true,
        },
      ],
      [
        "except-selected-user",
        {
          text: t(so + "except-selected-user", tOptions),
          mustHaveUserCollection: true,
        },
      ],
      [
        "all-selectable-users",
        {
          text: t(so + "all-selectable-users"),
          mustHaveUserCollection: false,
        },
      ],
      [
        "all-without-selectable-users",
        {
          text: t(so + "all-without-selectable-users"),
          mustHaveUserCollection: false,
        },
      ],
      [
        "none",
        {
          text: t(so + "none"),
          mustHaveUserCollection: false,
        },
      ],
    ] as const satisfies [
      PastaShowStrategy,
      {
        text: string;
        mustHaveUserCollection: boolean;
      },
    ][],
);
</script>
