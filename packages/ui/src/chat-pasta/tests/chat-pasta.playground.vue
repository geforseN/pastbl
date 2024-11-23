<template>
  <div
    class="flex flex-col items-center bg-base-100"
    style="gap: 3rem;"
  >
    <div>
      <h2>Compact</h2>
      <chat-pasta
        class="w-[420px] border"
        text="hello world"
        compact
        :time="{ label: 'Created', value: Date.now() }"
        :chatter
      />
    </div>
    <div>
      <h2>Compact with tags</h2>
      <chat-pasta
        class="w-[420px] border"
        text="hello world"
        compact
        :time="{ label: 'Created', value: Date.now() }"
        :tags="['tag1', 'tag2']"
        :chatter
      />
    </div>
    <div>
      <h2>Not Compact</h2>
      <chat-pasta
        class="w-[420px] border"
        text="hello world"
        :time="{ label: 'Created', value: Date.now() }"
        :chatter
      />
    </div>
    <div>
      <h2>Not Compact with tags</h2>
      <chat-pasta
        class="w-[420px] border"
        text="hello world"
        :time="{ label: 'Created', value: Date.now() }"
        :tags="['tag1', 'tag2']"
        :chatter
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import ChatPasta from "../chat-pasta.vue";

const chatter = {
  badges: 1,
  nickname: "geforsen",
  nicknameColor: "red",
};
</script>
