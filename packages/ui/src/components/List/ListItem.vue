<script setup lang="ts">
defineSlots<{
  default(): unknown
  /** Icono propio a la izquierda (pensado para listas variant="none"; con icono el item deja de mostrar su marcador). */
  icon(): unknown
}>()
</script>

<template>
  <li class="ui-list-item" :class="{ 'ui-list-item--with-icon': $slots.icon }">
    <template v-if="$slots.icon">
      <span class="ui-list-item__icon"><slot name="icon" /></span>
      <span class="ui-list-item__content"><slot /></span>
    </template>
    <slot v-else />
  </li>
</template>

<style scoped>
.ui-list-item--with-icon {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  list-style: none;
}
.ui-list-item__icon {
  display: inline-flex;
  flex-shrink: 0;
}
</style>
