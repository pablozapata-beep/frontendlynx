<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    min: number
    max: number
    modelValue: number[]
    maxSelected?: number
    disabledNumbers?: number[]
    columns?: number
    ariaLabel?: string
  }>(),
  {
    disabledNumbers: () => [],
    columns: 10,
    ariaLabel: 'Selección de números',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: number[]]
}>()

const numbers = computed(() => {
  const list: number[] = []
  for (let n = props.min; n <= props.max; n++) list.push(n)
  return list
})

function isSelected(n: number) {
  return props.modelValue.includes(n)
}

function isDisabled(n: number) {
  if (props.disabledNumbers.includes(n)) return true
  if (isSelected(n)) return false
  return props.maxSelected !== undefined && props.modelValue.length >= props.maxSelected
}

function toggle(n: number) {
  if (isDisabled(n)) return
  const next = isSelected(n)
    ? props.modelValue.filter((v) => v !== n)
    : [...props.modelValue, n]
  emit('update:modelValue', next)
}
</script>

<template>
  <div
    class="ui-number-grid"
    role="group"
    :aria-label="ariaLabel"
    :style="{ '--ui-number-grid-columns': columns }"
  >
    <button
      v-for="n in numbers"
      :key="n"
      type="button"
      class="ui-number-grid__cell"
      :class="{ 'ui-number-grid__cell--selected': isSelected(n) }"
      :disabled="isDisabled(n)"
      :aria-pressed="isSelected(n)"
      @click="toggle(n)"
    >
      {{ n }}
    </button>
  </div>
</template>

<style scoped>
.ui-number-grid {
  display: grid;
  grid-template-columns: repeat(var(--ui-number-grid-columns), 1fr);
  gap: var(--spacing-sm);
}

.ui-number-grid__cell {
  aspect-ratio: 1;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text);
  font-family: var(--font-family-body);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.15s, border-color 0.15s, color 0.15s;
}

.ui-number-grid__cell:hover:not(:disabled):not(.ui-number-grid__cell--selected) {
  border-color: var(--color-primary);
}

.ui-number-grid__cell--selected {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

.ui-number-grid__cell:disabled:not(.ui-number-grid__cell--selected) {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
