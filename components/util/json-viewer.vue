<template>
  <div class="json-viewer">
    <div v-for="(value, key) in jsonData" :key="key" class="json-item">
      <b class="json-item-key"> {{ key }}: </b>
      <div class="json-item-value">
        <div v-if="typeof value === 'object'">
          <json-viewer :json-data="value"></json-viewer>
        </div>
        <div v-else>
          {{ value }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { jsonData } = defineProps<{ jsonData: object }>();
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
