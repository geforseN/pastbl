<template>
  <div
    class="scrollbar-gutter-stable m-0 flex min-w-[352px] flex-col flex-wrap p-2 sm:min-w-[430px]"
  >
    <h3 class="text-xl">
      <strong>
        {{ $t("Fulfil_the_conditions") + ": " }}
      </strong>
    </h3>
    <ul class="ml-4 list-disc">
      <li
        v-if="
          userStore.pastasWorkMode.remoteBlockStatusIncludes('not-logged-in')
        "
      >
        <samp>
          <auth-twitch-login-link-button class="btn-xs w-full text-sm" />
        </samp>
      </li>
      <li v-if="userStore.pastasWorkMode.remoteBlockStatusIncludes('offline')">
        <samp>{{ $t("restore-internet-connection") }}</samp>
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
import { useUserStore } from "../../../../../app/stores/useUserStore";

const userStore = useUserStore();
</script>
