<template>
  <div>
    <fieldset class="rounded border-2 border-base-content p-2">
      <legend class="-ml-1 -translate-x-1 pl-2 text-xl font-bold">
        Show alert on:
      </legend>
      <article
        class="flex items-center justify-between rounded border-2 border-base-content px-2"
      >
        <label
          for="must-show-alert-pasta-copied"
          class="label cursor-pointer text-xl font-medium"
        >
          <h3>Pasta Copied</h3>
        </label>
        <input
          id="must-show-alert-pasta-copied"
          v-model="pastaCopied"
          class="toggle toggle-secondary"
          name="must-show-alert-pasta-copied"
          type="checkbox"
          label="Pasta Created"
        />
      </article>
    </fieldset>
  </div>
</template>
<script lang="ts" setup>
const pastaCopied = defineModel("pastaCopied", {
  required: true,
  type: Boolean,
});
</script>
