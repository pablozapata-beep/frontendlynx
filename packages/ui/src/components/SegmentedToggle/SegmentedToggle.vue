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
  <div class="ui-segmented-toggle" role="radiogroup">
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      class="ui-segmented-toggle__option"
      :class="{ 'ui-segmented-toggle__option--active': option.value === modelValue }"
      role="radio"
      :aria-checked="option.value === modelValue"
      @click="emit('update:modelValue', option.value)"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<style scoped>
.ui-segmented-toggle {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 3px;
  background: var(--color-surface-dark-light);
  border-radius: 999px;
}

.ui-segmented-toggle__option {
  font-family: var(--font-family-body);
  font-size: 13px;
  font-weight: 600;
  padding: 6px 14px;
  border: none;
  border-radius: 999px;
  background: transparent;
  color: var(--color-surface-dark-text-primary);
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.ui-segmented-toggle__option:hover:not(.ui-segmented-toggle__option--active) {
  color: var(--color-surface-dark-text-secondary);
}

.ui-segmented-toggle__option--active {
  background: var(--color-surface-dark);
  color: white;
  font-weight: 700;
}
</style>
