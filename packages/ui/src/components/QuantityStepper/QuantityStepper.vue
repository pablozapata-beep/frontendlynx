<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue: number
    min?: number
    max?: number
    step?: number
    ariaLabel?: string
    disabled?: boolean
  }>(),
  {
    min: 1,
    max: 99,
    step: 1,
    ariaLabel: 'Cantidad',
    disabled: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const clamp = (value: number) => Math.min(props.max, Math.max(props.min, value))

// Mientras se tipea se edita un borrador de texto; el valor real solo se
// emite (ya acotado a min/max) al confirmar con Enter o al perder el foco.
const draft = ref(String(props.modelValue))
watch(
  () => props.modelValue,
  (value) => {
    draft.value = String(value)
  },
)

const inputWidth = computed(() => `${Math.max(draft.value.length, 1) + 1}ch`)

function onInput(event: Event) {
  const allowNegative = props.min < 0
  const raw = (event.target as HTMLInputElement).value
  const sanitized = raw.replace(allowNegative ? /[^\d-]/g : /[^\d]/g, '')
  draft.value = sanitized
  ;(event.target as HTMLInputElement).value = sanitized
}

function commit() {
  const parsed = Number.parseInt(draft.value, 10)
  if (props.disabled || Number.isNaN(parsed)) {
    draft.value = String(props.modelValue)
    return
  }
  const next = clamp(parsed)
  draft.value = String(next)
  if (next !== props.modelValue) emit('update:modelValue', next)
}

function decrement() {
  if (props.disabled) return
  emit('update:modelValue', Math.max(props.min, props.modelValue - props.step))
}

function increment() {
  if (props.disabled) return
  emit('update:modelValue', Math.min(props.max, props.modelValue + props.step))
}
</script>

<template>
  <div class="ui-quantity-stepper" role="group" :aria-label="ariaLabel">
    <button
      type="button"
      class="ui-quantity-stepper__btn"
      :disabled="disabled || modelValue <= min"
      aria-label="Restar"
      @click="decrement"
    >
      −
    </button>
    <input
      class="ui-quantity-stepper__value"
      type="text"
      inputmode="numeric"
      autocomplete="off"
      :value="draft"
      :style="{ width: inputWidth }"
      :disabled="disabled"
      :aria-label="ariaLabel"
      @input="onInput"
      @focus="($event.target as HTMLInputElement).select()"
      @blur="commit"
      @keydown.enter="commit"
    />
    <button
      type="button"
      class="ui-quantity-stepper__btn"
      :disabled="disabled || modelValue >= max"
      aria-label="Sumar"
      @click="increment"
    >
      +
    </button>
  </div>
</template>

<style scoped>
.ui-quantity-stepper {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-family: var(--font-family-body);
}

.ui-quantity-stepper__btn {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  border: 1px solid var(--color-border);
  background: var(--color-background);
  color: var(--color-text);
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  transition: .35s ease-in-out;
}
.ui-quantity-stepper__btn:hover:not(:disabled) {
  border-color: var(--color-primary);
  color: var(--color-primary);
}
.ui-quantity-stepper__btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.ui-quantity-stepper__value {
  min-width: 1.5rem;
  padding: 0;
  border: none;
  background: transparent;
  text-align: center;
  font: inherit;
  font-weight: 700;
  color: var(--color-text);
  border-radius: var(--radius-sm);
}
</style>
