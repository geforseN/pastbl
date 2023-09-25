<template>
  <li class="bg-slate-400 border w-80">
    <div class>
      <div v-for="tag of tags" class="badge secondary">{{ tag }}</div>
    </div>
    {{ text }}
  </li>
</template>
<script lang="ts" setup>
import { Pasta } from "@/store/pastas.store";
const { text, tags } = defineProps<Pasta>();
</script>
