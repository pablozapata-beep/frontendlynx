<script setup lang="ts">
import { computed, inject, useAttrs } from 'vue'
import { useUid } from '../FormField/useUid'
import { radioGroupKey } from '../RadioGroup/context'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    /** Valor seleccionado (solo si el Radio se usa suelto, fuera de un RadioGroup). */
    modelValue?: unknown
    /** Valor que representa este radio. */
    value: unknown
    label?: string
    hint?: string
    disabled?: boolean
    name?: string
    id?: string
  }>(),
  {
    modelValue: undefined,
    label: undefined,
    hint: undefined,
    disabled: false,
    name: undefined,
    id: undefined,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: unknown]
}>()

const group = inject(radioGroupKey, null)

const attrs = useAttrs()
const rootAttrs = computed(() => ({ class: attrs.class, style: attrs.style }))
const inputAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs
  return rest
})

const uid = useUid('ui-radio')
const inputId = computed(() => props.id ?? uid)

const selected = computed(() => (group ? group.modelValue.value : props.modelValue))
const isChecked = computed(() => selected.value === props.value)
const isDisabled = computed(() => props.disabled || (group?.disabled.value ?? false))
const inputName = computed(() => group?.name.value ?? props.name)

function onChange() {
  if (group) group.select(props.value)
  else emit('update:modelValue', props.value)
}
</script>

<template>
  <label
    class="ui-radio"
    :class="{ 'ui-radio--disabled': isDisabled }"
    :for="inputId"
    v-bind="rootAttrs"
  >
    <input
      v-bind="inputAttrs"
      :id="inputId"
      class="ui-radio__input"
      type="radio"
      :name="inputName"
      :checked="isChecked"
      :disabled="isDisabled"
      @change="onChange"
    />
    <span class="ui-radio__circle" aria-hidden="true" />
    <span v-if="label || $slots.default || hint" class="ui-radio__text">
      <span v-if="label || $slots.default" class="ui-radio__label"><slot>{{ label }}</slot></span>
      <span v-if="hint" class="ui-radio__hint">{{ hint }}</span>
    </span>
  </label>
</template>

<style scoped>
.ui-radio {
  display: inline-flex;
  align-items: flex-start;
  gap: 10px;
  font-family: var(--font-family-body);
  font-size: 14px;
  line-height: 1.35;
  color: var(--color-text);
  cursor: pointer;
}
.ui-radio--disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

/* Visualmente oculto pero accesible: las flechas del teclado y el foco los maneja el <input> nativo. */
.ui-radio__input {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}

.ui-radio__circle {
  position: relative;
  flex-shrink: 0;
  width: 1.25rem;
  height: 1.25rem;
  margin-top: 1px;
  box-sizing: border-box;
  border: 1.5px solid color-mix(in srgb, var(--color-text) 35%, var(--color-border));
  border-radius: 50%;
  background: var(--color-background);
  transition: background-color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
}
.ui-radio__circle::after {
  content: '';
  position: absolute;
  inset: 4px;
  border-radius: 50%;
  background: var(--color-on-primary, white);
  opacity: 0;
  transform: scale(0.4);
  transition: opacity 0.12s ease, transform 0.12s ease;
}
.ui-radio:hover:not(.ui-radio--disabled) .ui-radio__circle {
  border-color: var(--color-primary);
}

.ui-radio__input:checked + .ui-radio__circle {
  background: var(--color-primary);
  border-color: var(--color-primary);
}
.ui-radio__input:checked + .ui-radio__circle::after {
  opacity: 1;
  transform: scale(1);
}

.ui-radio__input:focus-visible + .ui-radio__circle {
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 35%, transparent);
}

.ui-radio__text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.ui-radio__hint {
  font-size: 12px;
  opacity: 0.65;
}

@media (prefers-reduced-motion: reduce) {
  .ui-radio__circle,
  .ui-radio__circle::after {
    transition: none;
  }
}
</style>
