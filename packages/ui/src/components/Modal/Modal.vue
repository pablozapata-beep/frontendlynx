<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    open: boolean
    closeLabel?: string
    closeOnBackdrop?: boolean
    closeOnEscape?: boolean
    bottomSheetOnMobile?: boolean
  }>(),
  {
    closeLabel: 'Cerrar',
    closeOnBackdrop: true,
    closeOnEscape: true,
    bottomSheetOnMobile: true,
  },
)

const emit = defineEmits<{
  close: []
  afterOpen: []
}>()

const closeButtonRef = ref<HTMLButtonElement | null>(null)
let lastFocused: HTMLElement | null = null

function requestClose() {
  emit('close')
}

function onBackdropClick(event: MouseEvent) {
  if (props.closeOnBackdrop && event.target === event.currentTarget) requestClose()
}

function onKeydown(event: KeyboardEvent) {
  if (props.closeOnEscape && event.key === 'Escape') requestClose()
}

// flush: 'post' asegura que el DOM del modal ya este montado (o desmontado)
// antes de que corra este callback, asi closeButtonRef ya esta disponible sin
// tener que esperar un tick extra a mano.
watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      lastFocused = document.activeElement as HTMLElement | null
      document.addEventListener('keydown', onKeydown)
      closeButtonRef.value?.focus()
      emit('afterOpen')
    } else {
      document.removeEventListener('keydown', onKeydown)
      lastFocused?.focus()
    }
  },
  { immediate: true, flush: 'post' },
)

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="ui-modal-backdrop"
      :class="{ 'ui-modal-backdrop--sheet': bottomSheetOnMobile }"
      @click="onBackdropClick"
    >
      <div class="ui-modal-sheet" role="dialog" aria-modal="true">
        <button
          ref="closeButtonRef"
          type="button"
          class="ui-modal-close"
          :aria-label="closeLabel"
          @click="requestClose"
        >
          ×
        </button>
        <div v-if="$slots.header" class="ui-modal-header">
          <slot name="header" />
        </div>
        <div class="ui-modal-body">
          <slot />
        </div>
        <div v-if="$slots.footer" class="ui-modal-footer">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.ui-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-lg);
}

.ui-modal-sheet {
  position: relative;
  background: var(--color-background);
  border-radius: var(--radius-lg);
  width: 32rem;
  max-width: 100%;
  max-height: 88vh;
  overflow-y: auto;
  padding: var(--spacing-lg);
  font-family: var(--font-family-body);
  color: var(--color-text);
}

.ui-modal-close {
  position: absolute;
  top: var(--spacing-md);
  right: var(--spacing-md);
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text);
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.ui-modal-close:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.ui-modal-header {
  padding-right: 2.5rem;
  margin-bottom: var(--spacing-md);
}

.ui-modal-footer {
  margin-top: var(--spacing-lg);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--color-border);
}

@media (max-width: 640px) {
  .ui-modal-backdrop--sheet {
    align-items: flex-end;
    padding: 0;
  }
  .ui-modal-backdrop--sheet .ui-modal-sheet {
    width: 100%;
    max-width: 100%;
    max-height: 92vh;
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  }
}
</style>
