<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string
    background: string
    color?: string
    size?: 'sm' | 'md'
  }>(),
  {
    color: '#FFFFFF',
    size: 'md',
  },
)
</script>

<template>
  <span class="ui-lottery-ball" :class="`ui-lottery-ball--${size}`" :style="{ background, color }">
    {{ label }}
  </span>
</template>

<style scoped>
.ui-lottery-ball {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-family: var(--font-family-body);
  font-weight: 700;
  line-height: 1;
  flex-shrink: 0;
}

.ui-lottery-ball--sm {
  width: 1.5rem;
  height: 1.5rem;
  font-size: 9px;
}
.ui-lottery-ball--md {
  width: 2rem;
  height: 2rem;
  font-size: 11px;
}
</style>
