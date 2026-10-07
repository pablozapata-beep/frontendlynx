<script setup lang="ts">
import Checkbox from '../Checkbox/Checkbox.vue'

export interface CheckboxGroupOption {
  value: string | number
  label: string
  hint?: string
  disabled?: boolean
}

withDefaults(
  defineProps<{
    modelValue?: Array<string | number>
    options: CheckboxGroupOption[]
    legend?: string
    hint?: string
    error?: string
    disabled?: boolean
    orientation?: 'vertical' | 'horizontal'
  }>(),
  {
    modelValue: () => [],
    legend: undefined,
    hint: undefined,
    error: undefined,
    disabled: false,
    orientation: 'vertical',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: Array<string | number>]
}>()
</script>

<template>
  <fieldset class="ui-checkbox-group" :disabled="disabled">
    <legend v-if="legend" class="ui-checkbox-group__legend">{{ legend }}</legend>
    <div class="ui-checkbox-group__options" :class="`ui-checkbox-group__options--${orientation}`">
      <Checkbox
        v-for="option in options"
        :key="option.value"
        :model-value="modelValue"
        :value="option.value"
        :label="option.label"
        :hint="option.hint"
        :disabled="disabled || option.disabled"
        @update:model-value="emit('update:modelValue', $event as Array<string | number>)"
      />
    </div>
    <p v-if="error" class="ui-checkbox-group__message ui-checkbox-group__message--error" role="alert">{{ error }}</p>
    <p v-else-if="hint" class="ui-checkbox-group__message">{{ hint }}</p>
  </fieldset>
</template>

<style scoped>
.ui-checkbox-group {
  min-width: 0;
  margin: 0;
  padding: 0;
  border: none;
  font-family: var(--font-family-body);
  color: var(--color-text);
}

.ui-checkbox-group__legend {
  padding: 0;
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: 600;
}

.ui-checkbox-group__options {
  display: flex;
  gap: 10px 20px;
}
.ui-checkbox-group__options--vertical {
  flex-direction: column;
}
.ui-checkbox-group__options--horizontal {
  flex-direction: row;
  flex-wrap: wrap;
}

.ui-checkbox-group__message {
  margin: 8px 0 0;
  font-size: 12px;
  opacity: 0.7;
}
.ui-checkbox-group__message--error {
  color: var(--color-danger);
  opacity: 1;
}
</style>
