<template>
  <header class="flex border-b-2 p-1 text-3xl font-bold">
    <h2 class="">Create pasta</h2>
    <div class="ml-2 flex flex-nowrap xl:ml-2">
      <div class="relative flex gap-1">
        <span class="h-min whitespace-nowrap">(◕‿◕)☞</span>
        <div class="relative">
          <img
            class="peer/jokerge h-8 w-8 translate-y-1"
            src="https://cdn.7tv.app/emote/6306876cbe8c19d70f9d6b22/1x.webp"
            alt="Jokerge emote"
            width="32"
            height="32"
            @mouseover="shouldShowDisgustingAlert = true"
            @mouseout="shouldShowDisgustingAlert = false"
            @click="emit('jokergeClicked')"
          />
          <img
            class="pointer-events-none absolute bottom-0 right-0 -translate-x-1 -translate-y-1 scale-[1.75] motion-reduce:hidden"
            v-show="shouldShowDisgustingAlert"
            src="https://cdn.7tv.app/emote/6216d2f73808dfe5c465bc4a/1x.webp"
            alt="Alert emote"
          />
          <div
            class="message absolute left-11 top-1 whitespace-nowrap rounded-full rounded-bl-none bg-gradient-to-r from-green-500 via-violet-600 to-green-500 p-1 pb-0.5 pr-1.5 text-xs peer-hover/jokerge:uppercase"
            v-if="props.jokergeSuggestionMessage?.length"
          >
            {{ props.jokergeSuggestionMessage }}
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
<script setup lang="ts">
const emit = defineEmits(["jokergeClicked"]);

const shouldShowDisgustingAlert = ref(true);

const props = defineProps<{
  jokergeSuggestionMessage?: string;
}>();

onMounted(() => {
  setTimeout(() => {
    shouldShowDisgustingAlert.value = false;
  }, 3_000);
});
</script>
<style>
.message::before {
  position: absolute;
  bottom: 0px;
  height: 0.75rem;
  width: 0.75rem;
  background: theme("colors.green.500");
  content: "";
  mask-size: contain;
  mask-repeat: no-repeat;
  mask-position: center;
  left: -0.75rem;
  content: "";
  mask-image: url("data:image/svg+xml,%3csvg width='3' height='3' xmlns='http://www.w3.org/2000/svg'%3e%3cpath fill='black' d='m 0 3 L 3 3 L 3 0 C 3 1 1 3 0 3'/%3e%3c/svg%3e");
}
</style>
