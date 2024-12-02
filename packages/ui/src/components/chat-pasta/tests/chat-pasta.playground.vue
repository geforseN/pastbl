<template>
  <div>
    <chat-pasta
      v-bind="propsToTest_[1]"
    />
    <div class="my-2" />
    <chat-pasta
      v-bind="propsToTest_[19]"
    />
    <div
      class="grid grid-cols-3 items-center gap-12 bg-base-100"
    >
      <chat-pasta
        v-for="(props, i) of propsToTest_"
        :key="i"
        v-bind="props"
      />
    </div>
  </div>
</template>
<script lang="ts">
import type { ChatPastaProps } from "../chat-pasta.ts";
import ChatPasta from "../chat-pasta.vue";
import { creationTime, propsToTest, someChatter } from "./utils/chat-pasta";
</script>
<script setup lang="ts">
const propsToTest_ = propsToTest.map((props) => ({
  ...props,
  time: creationTime,
  chatter: someChatter,
}) satisfies ChatPastaProps);
</script>
