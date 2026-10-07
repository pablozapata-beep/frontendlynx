<script setup lang="ts">
import TextInput from '../TextInput/TextInput.vue'

withDefaults(
  defineProps<{
    modelValue?: string
    placeholder?: string
    size?: 'sm' | 'md' | 'lg'
    disabled?: boolean
    clearLabel?: string
    /** aria-label del <input> (un buscador normalmente no lleva label visible). */
    searchLabel?: string
  }>(),
  {
    modelValue: '',
    placeholder: 'Buscar',
    size: 'md',
    disabled: false,
    clearLabel: 'Limpiar búsqueda',
    searchLabel: 'Buscar',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  /** Enter dentro del campo. */
  search: [value: string]
  clear: []
}>()

function onEnter(event: KeyboardEvent) {
  emit('search', (event.target as HTMLInputElement).value)
}
</script>

<template>
  <TextInput
    class="ui-search-input"
    type="search"
    clearable
    :model-value="modelValue"
    :placeholder="placeholder"
    :size="size"
    :disabled="disabled"
    :clear-label="clearLabel"
    :aria-label="searchLabel"
    enterkeyhint="search"
    autocomplete="off"
    @update:model-value="emit('update:modelValue', String($event))"
    @clear="emit('clear')"
    @keydown.enter="onEnter"
  >
    <template #prefix>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <path d="M20 20l-3.5-3.5" />
      </svg>
    </template>
  </TextInput>
</template>
