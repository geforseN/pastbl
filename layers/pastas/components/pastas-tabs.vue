<template>
  <chat-pasta-list-hints>
    <client-only>
      <el-tabs
        v-model="userStore.selectedTabName"
        v-on-mouseover="showEmoteCard"
        class="scrollbar-gutter-stable border-base-content !space-y-0 border"
      >
        <el-tab-pane
          :label="$t('local')"
          name="local"
        >
          <local-pastas-list
            v-if="pastasStore.canShowPastas"
            :items="pastasStore.pastasToShow"
            @remove-pasta="pastasStore.removePasta"
          />
        </el-tab-pane>
        <el-tab-pane
          :label="$t('remote')"
          name="remote"
        >
          <remote-pastas-list v-if="userStore.pastasWorkMode.canBeRemote" />
          <remote-pastas-unavailable-hint v-else />
        </el-tab-pane>
      </el-tabs>
    </client-only>
  </chat-pasta-list-hints>
</template>
<script setup lang="ts">
const userStore = useUserStore();
const pastasStore = usePastasStore();

const emoteOnHover = injectEmoteOnHover();

const showEmoteCard = () =>
  useThrottleFn(emoteOnHover.allEmotesHandler, 100, true);
</script>
<style scoped>
:deep(.el-tabs__nav) {
  width: 100%;
}

:deep(.el-tabs__item) {
  width: 50%;
  color: theme(colors.base-content);
}

:deep(.el-tabs__item.is-active) {
  color: theme(colors.secondary);
}

:deep(.el-tabs__item:hover:not(.is-active)) {
  color: theme(colors.info);
}

:deep(.el-tabs__active-bar) {
  background-color: theme(colors.secondary);
}
</style>
