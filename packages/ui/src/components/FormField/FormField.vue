<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  /** Id del control: enlaza el label (for) y los mensajes (aria-describedby). */
  id: string
  label?: string
  hint?: string
  error?: string
  required?: boolean
  disabled?: boolean
}>()

const describedby = computed(() => {
  if (props.error) return `${props.id}-error`
  if (props.hint) return `${props.id}-hint`
  return undefined
})
</script>

<template>
  <div
    class="ui-form-field"
    :class="{ 'ui-form-field--invalid': !!error, 'ui-form-field--disabled': disabled }"
  >
    <label v-if="label" class="ui-form-field__label" :for="id">
      {{ label }}<span v-if="required" class="ui-form-field__required" aria-hidden="true"> *</span>
    </label>

    <slot :describedby="describedby" :invalid="!!error" />

    <p v-if="error" :id="`${id}-error`" class="ui-form-field__message ui-form-field__message--error" role="alert">
      {{ error }}
    </p>
    <p v-else-if="hint" :id="`${id}-hint`" class="ui-form-field__message">{{ hint }}</p>
  </div>
</template>

<style scoped>
.ui-form-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-family: var(--font-family-body);
  color: var(--color-text);
}

.ui-form-field__label {
  font-size: 13px;
  font-weight: 600;
  line-height: 1.2;
}
.ui-form-field--disabled .ui-form-field__label {
  opacity: 0.6;
}
.ui-form-field__required {
  color: var(--color-danger);
}

.ui-form-field__message {
  margin: 0;
  font-size: 12px;
  line-height: 1.3;
  opacity: 0.7;
}
.ui-form-field__message--error {
  color: var(--color-danger);
  opacity: 1;
}
</style>
