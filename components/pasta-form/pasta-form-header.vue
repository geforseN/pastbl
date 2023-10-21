<template>
  <header class="flex overflow-hidden border-b-2 p-1 text-3xl font-bold">
    <h2 class="">Create pasta</h2>
    <div class="ml-2 flex flex-nowrap xl:ml-2">
      <div class="relative flex gap-1">
        <span class="h-min whitespace-nowrap">
          (◕‿◕)
          <span v-if="whatToShow.includes('point')">☞</span>
          <img
            class="relative inline-block h-8 -translate-y-2"
            v-if="whatToShow === 'clap'"
            src="https://cdn.7tv.app/emote/62fc0a0c4a75fd54bd3520a9/1x.webp"
            alt="Clap emote"
            width="26"
            height="32"
          />
        </span>
        <div class="relative -left-1" v-if="whatToShow !== 'nothing'">
          <img
            class="h-8 w-8 translate-y-1"
            src="https://cdn.7tv.app/emote/6306876cbe8c19d70f9d6b22/1x.webp"
            alt="Jokerge emote"
            width="34"
            height="32"
            @mouseover="
              if (whatToShow === 'point') whatToShow = 'pointWithAlert';
            "
            @mouseout="
              if (whatToShow === 'pointWithAlert') whatToShow = 'point';
            "
            @click="
              () => {
                if (['nothing', 'clap'].includes(whatToShow)) {
                  return;
                }
                whatToShow = 'clap';
              }
            "
          />
          <img
            class="pointer-events-none absolute bottom-0 right-0 -translate-x-1 -translate-y-1 scale-[1.75] motion-reduce:hidden"
            v-show="whatToShow === 'pointWithAlert'"
            src="https://cdn.7tv.app/emote/6216d2f73808dfe5c465bc4a/1x.webp"
            alt="Alert emote"
            width="32"
            height="32"
          />
          <img
            class="absolute -right-7 bottom-2 h-8"
            v-if="whatToShow === 'clap'"
            src="https://cdn.7tv.app/emote/62fc0a0c4a75fd54bd3520a9/1x.webp"
            alt="Clap emote"
            width="26"
            height="32"
          />
        </div>
      </div>
    </div>
  </header>
</template>
<script setup lang="ts">
const emit = defineEmits(["requirePasta"]);

const whatToShow = ref<"clap" | "nothing" | "point" | "pointWithAlert">(
  "pointWithAlert",
);

whenever(
  () => whatToShow.value === "clap",
  () => {
    emit("requirePasta");
    setTimeout(() => (whatToShow.value = "nothing"), 5_000);
  },
);

onMounted(() => {
  setTimeout(() => {
    if (whatToShow.value === "pointWithAlert") {
      whatToShow.value = "point";
    }
  }, 3_000);
});
</script>
