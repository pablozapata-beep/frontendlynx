<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import FieldShell from '../FieldShell/FieldShell.vue'
import FormField from '../FormField/FormField.vue'
import { useUid } from '../FormField/useUid'

export interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
}

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    modelValue?: string | number | null
    options: SelectOption[]
    label?: string
    hint?: string
    error?: string
    /** Opcion inicial deshabilitada que se muestra mientras no hay valor elegido. */
    placeholder?: string
    disabled?: boolean
    required?: boolean
    id?: string
    size?: 'sm' | 'md' | 'lg'
  }>(),
  {
    modelValue: '',
    label: undefined,
    hint: undefined,
    error: undefined,
    placeholder: undefined,
    disabled: false,
    required: false,
    id: undefined,
    size: 'md',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const attrs = useAttrs()
const rootAttrs = computed(() => ({ class: attrs.class, style: attrs.style }))
const selectAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs
  return rest
})

const uid = useUid('ui-select')
const selectId = computed(() => props.id ?? uid)

const hasValue = computed(() => props.modelValue !== undefined && props.modelValue !== null && String(props.modelValue) !== '')

// Se emite el value original de la opcion (numero o string), no el string del DOM.
function onChange(event: Event) {
  const select = event.target as HTMLSelectElement
  const index = select.selectedIndex - (props.placeholder ? 1 : 0)
  const option = props.options[index]
  if (option) emit('update:modelValue', option.value)
}
</script>

<template>
  <FormField
    v-bind="rootAttrs"
    :id="selectId"
    :label="label"
    :hint="hint"
    :error="error"
    :required="required"
    :disabled="disabled"
    v-slot="{ describedby, invalid }"
  >
    <FieldShell :size="size" :invalid="invalid" :disabled="disabled">
      <select
        v-bind="selectAttrs"
        :id="selectId"
        class="ui-select__control"
        :class="{ 'ui-select__control--placeholder': !hasValue }"
        :value="hasValue ? String(modelValue) : ''"
        :disabled="disabled"
        :required="required"
        :aria-invalid="invalid || undefined"
        :aria-describedby="describedby"
        @change="onChange"
      >
        <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
        <option v-for="option in options" :key="option.value" :value="String(option.value)" :disabled="option.disabled">
          {{ option.label }}
        </option>
      </select>
      <svg class="ui-select__chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="m6 9 6 6 6-6" />
      </svg>
    </FieldShell>
  </FormField>
</template>

<style scoped>
.ui-select__control {
  flex: 1;
  min-width: 0;
  padding: 0;
  border: none;
  outline: none;
  background: transparent;
  color: inherit;
  font: inherit;
  appearance: none;
  cursor: pointer;
}
.ui-select__control:disabled {
  cursor: not-allowed;
}
.ui-select__control--placeholder {
  color: color-mix(in srgb, var(--color-text) 45%, transparent);
}
.ui-select__control option {
  color: var(--color-text);
}

.ui-select__chevron {
  flex-shrink: 0;
  opacity: 0.6;
  pointer-events: none;
}
</style>
