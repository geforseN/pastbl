<template>
  <client-only>
    <div>
      sevenTvAccounts:
      <div class="">
        <div class="bg-slate-200" v-for="account of sevenTvAccounts">
          <img
            class="inline-block"
            :src="`https:${account.avatarUrl}`"
            :alt="account.displayName + 'avatar'"
            width="32"
            height="32"
          />
          <span class="text-black">{{ account.displayName }}: </span>
          <span class="text-gray-800/50">{{ account.id }}</span>
          <use-time-ago v-slot="{ timeAgo }" :time="account.fetchTime">
            <span class="text-black">Data was fetched {{ timeAgo }}</span>
          </use-time-ago>
          <button
            class="btn btn-xs"
            disabled
            title="not working, TODO functionality"
          >
            UPDATE
          </button>
          <div class="text-black">Sets:</div>
          <div class="flex text-black" v-for="set of account.emoteSets">
            <div class="w-60">{{ set.name }}</div>
            <div class="w-40">capacity: {{ set.capacity }}</div>
            <span class="text-gray-800/50">{{ set.id }}</span>
          </div>
        </div>
      </div>
    </div>
    <template #fallback>
      <div class="mt-4 flex w-full justify-center">LOADING DATA</div>
    </template>
  </client-only>
</template>
<script setup lang="ts">
import { UseTimeAgo } from "@vueuse/components";

const sevenTvAccounts = await import("~/utils/storage.client").then(
  (module) => {
    return module.sevenTvAccounts;
  },
);
</script>
