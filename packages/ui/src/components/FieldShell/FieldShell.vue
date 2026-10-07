<script setup lang="ts">
withDefaults(
  defineProps<{
    size?: 'sm' | 'md' | 'lg'
    invalid?: boolean
    disabled?: boolean
    /** Para textarea: el contenedor crece con su contenido en vez de tener alto fijo. */
    multiline?: boolean
  }>(),
  {
    size: 'md',
    invalid: false,
    disabled: false,
    multiline: false,
  },
)
</script>

<template>
  <div
    class="ui-field-shell"
    :class="[
      `ui-field-shell--${size}`,
      {
        'ui-field-shell--invalid': invalid,
        'ui-field-shell--disabled': disabled,
        'ui-field-shell--multiline': multiline,
      },
    ]"
  >
    <slot />
  </div>
</template>

<style scoped>
/* Contenedor visual compartido por TextInput, SearchInput, Textarea y Select:
   borde + foco + estados. El control interno solo se encarga de su contenido. */
.ui-field-shell {
  display: flex;
  align-items: center;
  gap: 8px;
  box-sizing: border-box;
  width: 100%;
  padding: 0 14px;
  font-family: var(--font-family-body);
  color: var(--color-text);
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  transition: border-color 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease;
}

.ui-field-shell--sm {
  min-height: 2.25rem;
  font-size: 13px;
}
.ui-field-shell--md {
  min-height: 2.75rem;
  font-size: 15px;
}
.ui-field-shell--lg {
  min-height: 3.25rem;
  font-size: 16px;
}

.ui-field-shell--multiline {
  align-items: flex-start;
  padding-top: 10px;
  padding-bottom: 10px;
}

.ui-field-shell:hover:not(.ui-field-shell--disabled):not(:focus-within) {
  border-color: color-mix(in srgb, var(--color-text) 35%, var(--color-border));
}

.ui-field-shell:focus-within {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 25%, transparent);
}

.ui-field-shell--invalid {
  border-color: var(--color-danger);
}
.ui-field-shell--invalid:focus-within {
  border-color: var(--color-danger);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-danger) 22%, transparent);
}

.ui-field-shell--disabled {
  background: var(--color-surface);
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
