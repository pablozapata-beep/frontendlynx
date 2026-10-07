<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import FieldShell from '../FieldShell/FieldShell.vue'
import FormField from '../FormField/FormField.vue'
import { useUid } from '../FormField/useUid'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    modelValue?: string | null
    label?: string
    hint?: string
    error?: string
    placeholder?: string
    disabled?: boolean
    readonly?: boolean
    required?: boolean
    id?: string
    size?: 'sm' | 'md' | 'lg'
    rows?: number
    maxlength?: number
    /** Muestra el contador de caracteres (con maxlength: "12/200"). */
    showCount?: boolean
    resize?: 'none' | 'vertical'
  }>(),
  {
    modelValue: '',
    label: undefined,
    hint: undefined,
    error: undefined,
    placeholder: undefined,
    disabled: false,
    readonly: false,
    required: false,
    id: undefined,
    size: 'md',
    rows: 3,
    maxlength: undefined,
    showCount: false,
    resize: 'vertical',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const attrs = useAttrs()
const rootAttrs = computed(() => ({ class: attrs.class, style: attrs.style }))
const controlAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs
  return rest
})

const uid = useUid('ui-textarea')
const textareaId = computed(() => props.id ?? uid)

const length = computed(() => (props.modelValue ?? '').length)
const countText = computed(() => (props.maxlength ? `${length.value}/${props.maxlength}` : String(length.value)))

function onInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLTextAreaElement).value)
}
</script>

<template>
  <FormField
    v-bind="rootAttrs"
    :id="textareaId"
    :label="label"
    :hint="hint"
    :error="error"
    :required="required"
    :disabled="disabled"
    v-slot="{ describedby, invalid }"
  >
    <FieldShell :size="size" :invalid="invalid" :disabled="disabled" multiline>
      <textarea
        v-bind="controlAttrs"
        :id="textareaId"
        class="ui-textarea__control"
        :class="`ui-textarea__control--resize-${resize}`"
        :value="modelValue ?? ''"
        :rows="rows"
        :maxlength="maxlength"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :aria-invalid="invalid || undefined"
        :aria-describedby="describedby"
        @input="onInput"
      />
    </FieldShell>
    <p v-if="showCount" class="ui-textarea__count" aria-live="polite">{{ countText }}</p>
  </FormField>
</template>

<style scoped>
.ui-textarea__control {
  flex: 1;
  min-width: 0;
  padding: 0;
  border: none;
  outline: none;
  background: transparent;
  color: inherit;
  font: inherit;
  line-height: 1.45;
}
.ui-textarea__control::placeholder {
  color: var(--color-text);
  opacity: 0.45;
}
.ui-textarea__control:disabled {
  cursor: not-allowed;
}
.ui-textarea__control--resize-none {
  resize: none;
}
.ui-textarea__control--resize-vertical {
  resize: vertical;
}

.ui-textarea__count {
  margin: 0;
  text-align: right;
  font-size: 11px;
  opacity: 0.6;
}
</style>
