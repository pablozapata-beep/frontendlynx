<script setup lang="ts">
import { ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    label: string
    background: string
    color?: string
    size?: 'sm' | 'md'
    /** URL del logo real de la loteria. Si no se pasa o falla al cargar, se usa label+background. */
    logoUrl?: string
  }>(),
  {
    color: '#FFFFFF',
    size: 'md',
    logoUrl: undefined,
  },
)

const logoFailed = ref(false)

watch(
  () => props.logoUrl,
  () => {
    logoFailed.value = false
  },
)
</script>

<template>
  <span class="ui-lottery-ball" :class="`ui-lottery-ball--${size}`" :style="{ background, color }">
    <img
      v-if="logoUrl && !logoFailed"
      class="ui-lottery-ball__logo"
      :src="logoUrl"
      :alt="label"
      @error="logoFailed = true"
    />
    <template v-else>{{ label }}</template>
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
  overflow: hidden;
}

.ui-lottery-ball--sm {
  width: 1.5rem;
  height: 1.5rem;
  font-size: 9px;
}
.ui-lottery-ball--md {
  width: 1.8rem;
  height: 1.8rem;
  font-size: 11px;
}

.ui-lottery-ball__logo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
