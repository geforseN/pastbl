<template>
  <article class="mt-2 rounded-box border p-4">
    <h3 class="text-xl font-bold">Preview</h3>
    <div class="flex w-[340px] flex-col">
      <span class="block grow border border-secondary">
        <span class="block w-full px-[10px] py-[5px]">
          <chat-pasta-creator-data
            :badges-count="userStore.user.badges.count.state"
            :nickname="userStore.user.nickname.text.state"
            :nickname-color="userStore.user.nickname.color.state"
          />
          <span aria-hidden="true">:&nbsp;</span>
          <span
            ref="pastaTextContainerRef"
            class="twitch-text p-0 text-[13px]/[18px]"
          >
            {{ text }}
          </span>
        </span>
      </span>
      <dev-only>
        <button
          class="btn btn-primary btn-md text-lg"
          @click="userStore.copyText(text)"
        >
          COPY PREVIEW PASTA
        </button>
      </dev-only>
    </div>
  </article>
</template>

<script lang="ts" setup>
const pastaTextContainerRef = ref();
const isMounted = useMounted();

const { isFormCollapseOpen } = defineProps<{
  isFormCollapseOpen: boolean;
}>();

const userStore = useUserStore();
const pastaStore = usePastaStore();
const emotesStore = useEmotesStore();

const text = computed(() => pastaStore.pasta.text);

async function doMagic() {
  await Promise.all([
    until(() => pastaStore.text.isRestored).toBeTruthy({ timeout: 3_000 }),
    until(() => emotesStore.isInitialUserEmotesReady).toBeTruthy(),
  ]);
  const { validTokens } = createMegaPasta(text.value, []);
  populatePasta(pastaTextContainerRef.value, { validTokens }, emotesStore);
}

watch(
  () => text.value,
  async () => {
    if (!isMounted.value) {
      return console.log("not mounted");
    }
    console.log({ "pasta text changed": pastaStore.text.state });
    await doMagic();
  },
);

// watchOnce(
//   () => isFormCollapseOpen,
//   async () => {
//     console.log({ isFormCollapseOpen });
//     if (!isFormCollapseOpen) {
//       console.log("lets GO", { isMounted: isMounted.value });
//       await until(() => isMounted.value).toBeTruthy();
//       console.log("GO", { isMounted: isMounted.value });
//       console.log({
//         v: pastaTextContainerRef.value,
//         t: pastaTextContainerRef.value.innerHTML,
//       });
//       await nextTick();
//       console.log({
//         v2: pastaTextContainerRef.value,
//         t: pastaTextContainerRef.value.innerHTML,
//       });
//       assert.ok(pastaTextContainerRef.value, "asdadsasdasda");
//       await nextTick();
//       pastaTextContainerRef.value.innerHTML = "MUGA";
//       console.log({
//         v3: pastaTextContainerRef.value,
//         t: pastaTextContainerRef.value.innerHTML,
//       });
//       await nextTick();
//       console.log({
//         v4: pastaTextContainerRef.value,
//         t: pastaTextContainerRef.value.innerHTML,
//       });
//     }
//   },
//   { immediate: true, flush: "post" },
// );
</script>
