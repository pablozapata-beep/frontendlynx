<script setup lang="ts">
import Notification from './Notification.vue'
import { useNotifications } from './useNotifications'

const { items, dismiss } = useNotifications()
</script>

<template>
  <div class="ui-notifications-container">
    <Notification
      v-for="item in items"
      :key="item.id"
      :variant="item.variant"
      :title="item.title"
      @dismiss="dismiss(item.id)"
    >
      {{ item.message }}
    </Notification>
  </div>
</template>

<style scoped>
.ui-notifications-container {
  position: fixed;
  top: var(--spacing-lg);
  right: var(--spacing-lg);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  pointer-events: none;
}
.ui-notifications-container > * {
  pointer-events: auto;
}
</style>
