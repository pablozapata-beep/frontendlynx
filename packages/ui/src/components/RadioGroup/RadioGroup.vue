<script setup lang="ts">
import { computed, provide, toRef } from 'vue'
import Radio from '../Radio/Radio.vue'
import { useUid } from '../FormField/useUid'
import { radioGroupKey } from './context'

export interface RadioGroupOption {
  value: string | number
  label: string
  hint?: string
  disabled?: boolean
}

const props = withDefaults(
  defineProps<{
    modelValue?: unknown
    /** Atajo: renderiza un Radio por opcion. Alternativa: poner <Radio> a mano en el slot. */
    options?: RadioGroupOption[]
    name?: string
    legend?: string
    hint?: string
    error?: string
    disabled?: boolean
    orientation?: 'vertical' | 'horizontal'
  }>(),
  {
    modelValue: undefined,
    options: undefined,
    name: undefined,
    legend: undefined,
    hint: undefined,
    error: undefined,
    disabled: false,
    orientation: 'vertical',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: unknown]
}>()

const uid = useUid('ui-radio-group')
const groupName = computed(() => props.name ?? uid)

provide(radioGroupKey, {
  name: groupName,
  modelValue: toRef(props, 'modelValue'),
  disabled: toRef(props, 'disabled'),
  select: (value) => emit('update:modelValue', value),
})
</script>

<template>
  <fieldset
    class="ui-radio-group"
    role="radiogroup"
    :disabled="disabled"
    :aria-invalid="error ? true : undefined"
  >
    <legend v-if="legend" class="ui-radio-group__legend">{{ legend }}</legend>
    <div class="ui-radio-group__options" :class="`ui-radio-group__options--${orientation}`">
      <slot>
        <Radio
          v-for="option in options"
          :key="option.value"
          :value="option.value"
          :label="option.label"
          :hint="option.hint"
          :disabled="option.disabled"
        />
      </slot>
    </div>
    <p v-if="error" class="ui-radio-group__message ui-radio-group__message--error" role="alert">{{ error }}</p>
    <p v-else-if="hint" class="ui-radio-group__message">{{ hint }}</p>
  </fieldset>
</template>

<style scoped>
.ui-radio-group {
  min-width: 0;
  margin: 0;
  padding: 0;
  border: none;
  font-family: var(--font-family-body);
  color: var(--color-text);
}

.ui-radio-group__legend {
  padding: 0;
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: 600;
}

.ui-radio-group__options {
  display: flex;
  gap: 10px 20px;
}
.ui-radio-group__options--vertical {
  flex-direction: column;
}
.ui-radio-group__options--horizontal {
  flex-direction: row;
  flex-wrap: wrap;
}

.ui-radio-group__message {
  margin: 8px 0 0;
  font-size: 12px;
  opacity: 0.7;
}
.ui-radio-group__message--error {
  color: var(--color-danger);
  opacity: 1;
}
</style>
