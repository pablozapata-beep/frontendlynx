<script setup lang="ts">
import { computed } from 'vue'

export type HeadingSize =
  | 'main-title'
  | 'title'
  | 'md'
  | 'sm'
  | 'xsm'
  | 'xxsm'
  | 'subtitle'
  | 'subtitle-sm'
  | 'subtitle-xsm'

const DEFAULT_SIZE_BY_LEVEL: Record<number, HeadingSize> = {
  1: 'title',
  2: 'md',
  3: 'sm',
  4: 'xsm',
  5: 'xxsm',
  6: 'xxsm',
}

const props = withDefaults(
  defineProps<{
    /** Nivel semantico (h1-h6). No cambia el tamano: eso lo decide `size`. */
    level?: 1 | 2 | 3 | 4 | 5 | 6
    /** Tamano visual. Si no se pasa, se deriva del nivel (h1 'title', h2 'md', h3 'sm', h4 'xsm', h5/h6 'xxsm'). */
    size?: HeadingSize
    align?: 'left' | 'center' | 'right'
  }>(),
  {
    level: 2,
    size: undefined,
    align: undefined,
  },
)

defineSlots<{
  default(): unknown
  /** Icono a la izquierda del texto. */
  icon(): unknown
}>()

const resolvedSize = computed(() => props.size ?? DEFAULT_SIZE_BY_LEVEL[props.level])
</script>

<template>
  <component
    :is="`h${level}`"
    class="ui-heading"
    :class="[
      `ui-heading--${resolvedSize}`,
      { [`ui-heading--align-${align}`]: align, 'ui-heading--with-icon': $slots.icon },
    ]"
  >
    <span v-if="$slots.icon" class="ui-heading__icon"><slot name="icon" /></span>
    <slot />
  </component>
</template>

<style scoped>
.ui-heading {
  margin: 0 0 1.8rem;
  font-family: var(--font-family-heading);
  font-weight: 700;
  line-height: 1.1;
  color: var(--color-text);
}

.ui-heading--main-title {
  font-size: clamp(2.2rem, 5vw, 4rem);
}
.ui-heading--title {
  font-size: clamp(1.8rem, 5vw, 3rem);
}
.ui-heading--md {
  font-size: clamp(1.4rem, 5vw, 2.1rem);
  margin-bottom: 1rem;
}
.ui-heading--sm {
  font-size: clamp(1.2rem, 5vw, 1.8rem);
  margin-bottom: 1.2rem;
}
.ui-heading--xsm {
  font-size: clamp(0.8rem, 5vw, 1.5rem);
  margin-bottom: 1.2rem;
}
.ui-heading--xxsm {
  font-size: clamp(0.8rem, 5vw, 1.2rem);
  margin-bottom: 0.8rem;
}

.ui-heading--subtitle {
  font-size: clamp(1rem, 5vw, 1.6rem);
  font-weight: 600;
  margin-bottom: 1.2rem;
}
.ui-heading--subtitle-sm {
  font-size: clamp(0.8rem, 5vw, 1.4rem);
  font-weight: 600;
  margin-bottom: 1.2rem;
}
.ui-heading--subtitle-xsm {
  font-size: clamp(0.9rem, 4vw, 1.2rem);
  font-weight: 600;
  margin-bottom: 1.2rem;
}

.ui-heading--align-left {
  text-align: left;
}
.ui-heading--align-center {
  text-align: center;
}
.ui-heading--align-right {
  text-align: right;
}

.ui-heading--with-icon {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.ui-heading--align-center.ui-heading--with-icon {
  justify-content: center;
}
.ui-heading--align-right.ui-heading--with-icon {
  justify-content: flex-end;
}
.ui-heading__icon {
  display: inline-flex;
}
</style>
