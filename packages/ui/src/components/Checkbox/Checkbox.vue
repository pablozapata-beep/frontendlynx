<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { useUid } from '../FormField/useUid'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    /** boolean, o un array de valores seleccionados (en ese caso `value` es obligatorio). */
    modelValue?: boolean | unknown[]
    value?: unknown
    label?: string
    hint?: string
    disabled?: boolean
    /** Estado "mixto" (ej. un "seleccionar todo" con seleccion parcial). Se quita al clickear. */
    indeterminate?: boolean
    id?: string
  }>(),
  {
    modelValue: false,
    value: undefined,
    label: undefined,
    hint: undefined,
    disabled: false,
    indeterminate: false,
    id: undefined,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean | unknown[]]
}>()

const attrs = useAttrs()
const rootAttrs = computed(() => ({ class: attrs.class, style: attrs.style }))
const inputAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs
  return rest
})

const uid = useUid('ui-checkbox')
const inputId = computed(() => props.id ?? uid)

const isChecked = computed(() =>
  Array.isArray(props.modelValue) ? props.modelValue.includes(props.value) : !!props.modelValue,
)

function onChange(event: Event) {
  const checked = (event.target as HTMLInputElement).checked
  if (Array.isArray(props.modelValue)) {
    const without = props.modelValue.filter((item) => item !== props.value)
    emit('update:modelValue', checked ? [...without, props.value] : without)
  } else {
    emit('update:modelValue', checked)
  }
}
</script>

<template>
  <label
    class="ui-checkbox"
    :class="{ 'ui-checkbox--disabled': disabled }"
    :for="inputId"
    v-bind="rootAttrs"
  >
    <input
      v-bind="inputAttrs"
      :id="inputId"
      class="ui-checkbox__input"
      type="checkbox"
      :checked="isChecked"
      :indeterminate="indeterminate"
      :disabled="disabled"
      :aria-checked="indeterminate ? 'mixed' : undefined"
      @change="onChange"
    />
    <span class="ui-checkbox__box" aria-hidden="true">
      <svg class="ui-checkbox__icon ui-checkbox__icon--check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="m5 12.5 4.5 4.5L19 7.5" />
      </svg>
      <svg class="ui-checkbox__icon ui-checkbox__icon--dash" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round">
        <path d="M6 12h12" />
      </svg>
    </span>
    <span v-if="label || $slots.default || hint" class="ui-checkbox__text">
      <span v-if="label || $slots.default" class="ui-checkbox__label"><slot>{{ label }}</slot></span>
      <span v-if="hint" class="ui-checkbox__hint">{{ hint }}</span>
    </span>
  </label>
</template>

<style scoped>
.ui-checkbox {
  display: inline-flex;
  align-items: flex-start;
  gap: 10px;
  font-family: var(--font-family-body);
  font-size: 14px;
  line-height: 1.35;
  color: var(--color-text);
  cursor: pointer;
}
.ui-checkbox--disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

/* Visualmente oculto pero accesible: teclado, foco y lectores de pantalla usan el <input> nativo. */
.ui-checkbox__input {
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

.ui-checkbox__box {
  position: relative;
  flex-shrink: 0;
  width: 1.25rem;
  height: 1.25rem;
  margin-top: 1px;
  box-sizing: border-box;
  border: 1.5px solid color-mix(in srgb, var(--color-text) 35%, var(--color-border));
  border-radius: calc(var(--radius-sm) + 1px);
  background: var(--color-background);
  color: var(--color-on-primary, white);
  transition: background-color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
}
.ui-checkbox:hover:not(.ui-checkbox--disabled) .ui-checkbox__box {
  border-color: var(--color-primary);
}

.ui-checkbox__icon {
  position: absolute;
  inset: 1px;
  width: calc(100% - 2px);
  height: calc(100% - 2px);
  opacity: 0;
  transform: scale(0.6);
  transition: opacity 0.12s ease, transform 0.12s ease;
}

.ui-checkbox__input:checked + .ui-checkbox__box,
.ui-checkbox__input:indeterminate + .ui-checkbox__box {
  background: var(--color-primary);
  border-color: var(--color-primary);
}
.ui-checkbox__input:checked + .ui-checkbox__box .ui-checkbox__icon--check {
  opacity: 1;
  transform: scale(1);
}
.ui-checkbox__input:indeterminate + .ui-checkbox__box .ui-checkbox__icon--check {
  opacity: 0;
}
.ui-checkbox__input:indeterminate + .ui-checkbox__box .ui-checkbox__icon--dash {
  opacity: 1;
  transform: scale(1);
}

.ui-checkbox__input:focus-visible + .ui-checkbox__box {
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 35%, transparent);
}

.ui-checkbox__text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.ui-checkbox__hint {
  font-size: 12px;
  opacity: 0.65;
}

@media (prefers-reduced-motion: reduce) {
  .ui-checkbox__box,
  .ui-checkbox__icon {
    transition: none;
  }
}
</style>
