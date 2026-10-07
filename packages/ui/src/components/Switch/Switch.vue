<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { useUid } from '../FormField/useUid'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    label?: string
    hint?: string
    disabled?: boolean
    id?: string
  }>(),
  {
    modelValue: false,
    label: undefined,
    hint: undefined,
    disabled: false,
    id: undefined,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const attrs = useAttrs()
const rootAttrs = computed(() => ({ class: attrs.class, style: attrs.style }))
const inputAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs
  return rest
})

const uid = useUid('ui-switch')
const inputId = computed(() => props.id ?? uid)

function onChange(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).checked)
}
</script>

<template>
  <label
    class="ui-switch"
    :class="{ 'ui-switch--disabled': disabled }"
    :for="inputId"
    v-bind="rootAttrs"
  >
    <input
      v-bind="inputAttrs"
      :id="inputId"
      class="ui-switch__input"
      type="checkbox"
      role="switch"
      :checked="modelValue"
      :disabled="disabled"
      @change="onChange"
    />
    <span class="ui-switch__track" aria-hidden="true">
      <span class="ui-switch__thumb" />
    </span>
    <span v-if="label || $slots.default || hint" class="ui-switch__text">
      <span v-if="label || $slots.default" class="ui-switch__label"><slot>{{ label }}</slot></span>
      <span v-if="hint" class="ui-switch__hint">{{ hint }}</span>
    </span>
  </label>
</template>

<style scoped>
.ui-switch {
  display: inline-flex;
  align-items: flex-start;
  gap: 10px;
  font-family: var(--font-family-body);
  font-size: 14px;
  line-height: 1.35;
  color: var(--color-text);
  cursor: pointer;
}
.ui-switch--disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.ui-switch__input {
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

.ui-switch__track {
  position: relative;
  flex-shrink: 0;
  width: 2.5rem;
  height: 1.5rem;
  box-sizing: border-box;
  border-radius: 999px;
  background: color-mix(in srgb, var(--color-text) 22%, var(--color-border));
  transition: background-color 0.2s ease, box-shadow 0.15s ease;
}
.ui-switch__thumb {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 1.125rem;
  height: 1.125rem;
  border-radius: 50%;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s ease;
}

.ui-switch__input:checked + .ui-switch__track {
  background: var(--color-primary);
}
.ui-switch__input:checked + .ui-switch__track .ui-switch__thumb {
  transform: translateX(1rem);
}
.ui-switch__input:focus-visible + .ui-switch__track {
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 35%, transparent);
}

.ui-switch__text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding-top: 2px;
}
.ui-switch__hint {
  font-size: 12px;
  opacity: 0.65;
}

@media (prefers-reduced-motion: reduce) {
  .ui-switch__track,
  .ui-switch__thumb {
    transition: none;
  }
}
</style>
