<template>
  <h1>{{ msg }}</h1>
  <div class="flex flex-col items-center">
    <!-- eslint-disable tailwindcss/no-custom-classname -->
    <button
      type="button"
      class="btn-2 btn btn-primary btn-xs w-fit bg-gradient-to-b px-4 py-2"
      @click="count++"
    >
      Pastbl
    </button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>
  <p>
    Install
    <a
      href="https://github.com/vuejs/language-tools"
      target="_blank"
    >Volar</a>
    in your IDE for a better DX
  </p>
  <p class="read-the-docs">
    Click on the WXT and Vue logos to learn more
  </p>
</template>
<script lang="ts" setup>
import { ref } from "vue";

defineProps<{
  msg: string;
}>();

const count = ref(0);
</script>
<style scoped>
.read-the-docs {
  color: #888;
}

.btn-2 {
  background: rgb(145,71,255);
  background: radial-gradient(circle, rgba(249,115,22,0.7) 70%, rgba(145,71,255,1) 95%);
}
</style>
