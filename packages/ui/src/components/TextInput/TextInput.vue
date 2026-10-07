<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue'
import FieldShell from '../FieldShell/FieldShell.vue'
import FormField from '../FormField/FormField.vue'
import { useUid } from '../FormField/useUid'

// class/style van al contenedor; el resto de los atributos (name, autocomplete, onKeydown...) al <input>.
defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    modelValue?: string | number | null
    type?: 'text' | 'email' | 'password' | 'search' | 'tel' | 'url' | 'number'
    label?: string
    hint?: string
    error?: string
    placeholder?: string
    disabled?: boolean
    readonly?: boolean
    required?: boolean
    id?: string
    size?: 'sm' | 'md' | 'lg'
    /** Muestra un boton para vaciar el campo cuando tiene contenido. */
    clearable?: boolean
    clearLabel?: string
    /** Solo type="password": textos del boton de mostrar/ocultar. */
    showPasswordLabel?: string
    hidePasswordLabel?: string
  }>(),
  {
    modelValue: '',
    type: 'text',
    label: undefined,
    hint: undefined,
    error: undefined,
    placeholder: undefined,
    disabled: false,
    readonly: false,
    required: false,
    id: undefined,
    size: 'md',
    clearable: false,
    clearLabel: 'Limpiar',
    showPasswordLabel: 'Mostrar contraseña',
    hidePasswordLabel: 'Ocultar contraseña',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  clear: []
}>()

const attrs = useAttrs()
const rootAttrs = computed(() => ({ class: attrs.class, style: attrs.style }))
const inputAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs
  return rest
})

const uid = useUid('ui-text-input')
const inputId = computed(() => props.id ?? uid)

const inputRef = ref<HTMLInputElement | null>(null)
const revealed = ref(false)

const isPassword = computed(() => props.type === 'password')
const nativeType = computed(() => (isPassword.value && revealed.value ? 'text' : props.type))
const hasValue = computed(
  () => props.modelValue !== undefined && props.modelValue !== null && String(props.modelValue) !== '',
)
const showClear = computed(() => props.clearable && hasValue.value && !props.disabled && !props.readonly)

function onInput(event: Event) {
  const raw = (event.target as HTMLInputElement).value
  emit('update:modelValue', props.type === 'number' && raw !== '' ? Number(raw) : raw)
}

function clear() {
  emit('update:modelValue', '')
  emit('clear')
  inputRef.value?.focus()
}

defineExpose({
  focus: () => inputRef.value?.focus(),
  blur: () => inputRef.value?.blur(),
  input: inputRef,
})
</script>

<template>
  <FormField
    v-bind="rootAttrs"
    :id="inputId"
    :label="label"
    :hint="hint"
    :error="error"
    :required="required"
    :disabled="disabled"
    v-slot="{ describedby, invalid }"
  >
    <FieldShell :size="size" :invalid="invalid" :disabled="disabled">
      <span v-if="$slots.prefix" class="ui-text-input__adornment">
        <slot name="prefix" />
      </span>

      <input
        v-bind="inputAttrs"
        :id="inputId"
        ref="inputRef"
        class="ui-text-input__control"
        :type="nativeType"
        :value="modelValue ?? ''"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :aria-invalid="invalid || undefined"
        :aria-describedby="describedby"
        @input="onInput"
      />

      <button
        v-if="showClear"
        type="button"
        class="ui-text-input__action"
        :aria-label="clearLabel"
        @click="clear"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>

      <button
        v-if="isPassword && !disabled"
        type="button"
        class="ui-text-input__action ui-text-input__toggle"
        :aria-label="revealed ? hidePasswordLabel : showPasswordLabel"
        :aria-pressed="revealed"
        @click="revealed = !revealed"
      >
        <svg v-if="!revealed" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M3 3l18 18M10.6 5.1A10.7 10.7 0 0 1 12 5c6.4 0 10 7 10 7a17.7 17.7 0 0 1-3.2 4.1M6.5 6.6A17.4 17.4 0 0 0 2 12s3.6 7 10 7a10 10 0 0 0 4.2-.9M9.9 9.9a3 3 0 0 0 4.2 4.2" />
        </svg>
      </button>

      <span v-if="$slots.suffix" class="ui-text-input__adornment">
        <slot name="suffix" />
      </span>
    </FieldShell>
  </FormField>
</template>

<style scoped>
.ui-text-input__control {
  flex: 1;
  min-width: 0;
  padding: 0;
  border: none;
  outline: none;
  background: transparent;
  color: inherit;
  font: inherit;
}
.ui-text-input__control::placeholder {
  color: var(--color-text);
  opacity: 0.45;
}
.ui-text-input__control:disabled {
  cursor: not-allowed;
}
/* Quita la "x" y los spinners nativos: el kit tiene sus propios controles. */
.ui-text-input__control::-webkit-search-cancel-button,
.ui-text-input__control::-webkit-search-decoration {
  appearance: none;
}
.ui-text-input__control[type='number'] {
  appearance: textfield;
}

.ui-text-input__adornment {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  opacity: 0.6;
}

.ui-text-input__action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 1.5rem;
  height: 1.5rem;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: inherit;
  opacity: 0.55;
  cursor: pointer;
  transition: opacity 0.15s ease, background-color 0.15s ease;
}
.ui-text-input__action:hover {
  opacity: 1;
  background: color-mix(in srgb, var(--color-text) 10%, transparent);
}
.ui-text-input__action:focus-visible {
  opacity: 1;
  outline: 2px solid var(--color-primary);
  outline-offset: 1px;
}
</style>
