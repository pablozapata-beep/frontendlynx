<script setup lang="ts">
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
    <span class="ui-quantity-stepper__value">{{ modelValue }}</span>
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
  transition: border-color 0.15s, color 0.15s;
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
  text-align: center;
  font-weight: 700;
  color: var(--color-text);
}
</style>
