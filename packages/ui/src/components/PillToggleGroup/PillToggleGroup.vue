<script setup lang="ts">
defineProps<{
  options: Array<{ value: string; label: string }>
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div class="ui-pill-toggle-group" role="radiogroup">
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      class="ui-pill-toggle-group__pill"
      :class="{ 'ui-pill-toggle-group__pill--active': option.value === modelValue }"
      role="radio"
      :aria-checked="option.value === modelValue"
      @click="emit('update:modelValue', option.value)"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<style scoped>
.ui-pill-toggle-group {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.ui-pill-toggle-group__pill {
  font-family: var(--font-family-body);
  font-size: 13px;
  font-weight: 600;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text);
  cursor: pointer;
  transition: background-color 0.15s, border-color 0.15s, color 0.15s;
}

.ui-pill-toggle-group__pill:hover:not(.ui-pill-toggle-group__pill--active) {
  border-color: var(--color-primary);
}

.ui-pill-toggle-group__pill--active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

.ui-pill-toggle-group__pill:hover:not(.ui-pill-toggle-group__pill--active) {  
  border-color: #686D6E; 
}
</style>
