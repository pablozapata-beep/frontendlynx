<script setup lang="ts">
import type { NotificationVariant } from './useNotifications'

withDefaults(
  defineProps<{
    variant?: NotificationVariant
    title?: string
    dismissible?: boolean
  }>(),
  {
    variant: 'info',
    dismissible: true,
  },
)

const emit = defineEmits<{
  dismiss: []
}>()

const ICONS: Record<NotificationVariant, string> = {
  success: '✓',
  danger: '✕',
  warning: '!',
  info: 'i',
}
</script>

<template>
  <div class="ui-notification" :class="`ui-notification--${variant}`" role="status">
    <span class="ui-notification__icon" aria-hidden="true">{{ ICONS[variant] }}</span>
    <div class="ui-notification__content">
      <p v-if="title" class="ui-notification__title">{{ title }}</p>
      <div class="ui-notification__message">
        <slot />
      </div>
    </div>
    <button
      v-if="dismissible"
      type="button"
      class="ui-notification__dismiss"
      aria-label="Cerrar"
      @click="emit('dismiss')"
    >
      ×
    </button>
  </div>
</template>

<style scoped>
.ui-notification {
  position:relative;
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  background: var(--color-background);
  border-left: 4px solid var(--color-success);
  box-shadow: var(--shadow-sm);
  font-family: var(--font-family-body);
  color: var(--color-text);
  max-width: 24rem;
}

.ui-notification--success {
  border-left-color: var(--color-success);
}
.ui-notification--danger {
  border-left-color: var(--color-danger);
}
.ui-notification--warning {
  border-left-color: var(--color-warning);
}
.ui-notification--info {
  border-left-color: var(--color-success);
}

.ui-notification__icon {
  flex-shrink: 0;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  color: white;
  background: var(--color-success);
}
.ui-notification--success .ui-notification__icon {
  background: var(--color-success);
}
.ui-notification--danger .ui-notification__icon {
  background: var(--color-danger);
}
.ui-notification--warning .ui-notification__icon {
  background: var(--color-warning);
}

.ui-notification__content {
  flex: 1;
}
.ui-notification__title {
  margin: 0 0 0.25rem;
  font-family: var(--font-family-heading);
  font-weight: 700;
  font-size: 14px;
}
.ui-notification__message {
  font-size: 14px;
}

.ui-notification__dismiss {
  position:absolute;
  top:.25rem;
  right:.25rem;
  border: none;
  background: transparent;
  color: var(--color-text);
  opacity: 0.5;
  cursor: pointer;
  font-size: 1.1rem;
  line-height: 1;
  padding: 0;
}
.ui-notification__dismiss:hover {
  opacity: 1;
}
</style>
