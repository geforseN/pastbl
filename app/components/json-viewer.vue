<template>
  <div class="json-viewer">
    <div v-for="(value, key) in data" :key="key" class="json-item">
      <b class="json-item-key"> {{ key }}: </b>
      <div class="json-item-value">
        <div v-if="value !== null && typeof value === 'object'">
          <json-viewer :data="value" />
        </div>
        <div v-else>
          {{ value }}
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
defineProps<{
  data: object;
}>();
</script>
<style scoped>
.json-viewer {
  display: flex;
  flex-direction: column;
}

.json-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 0;
  margin-left: 0;
}

.json-item-key {
  margin-right: 5px;
  color: yellowgreen;
}

.json-item-value {
  margin-left: 10px;
}
</style>
