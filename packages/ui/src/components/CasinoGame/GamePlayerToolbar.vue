<script setup lang="ts">
import PillToggleGroup from '../PillToggleGroup/PillToggleGroup.vue'

type Mode = 'demo' | 'real'

const props = withDefaults(
  defineProps<{
    mode: Mode
    favorite?: boolean
    favoriteCount?: number
    fullscreen?: boolean
    floating?: boolean
    demoLabel?: string
    realLabel?: string
    screenshotLabel?: string
    favoriteLabel?: string
    refreshLabel?: string
    fullscreenLabel?: string
    floatingLabel?: string
  }>(),
  {
    favorite: false,
    favoriteCount: undefined,
    fullscreen: false,
    floating: false,
    demoLabel: 'Demo',
    realLabel: 'Juego Real',
    screenshotLabel: 'Capturar pantalla',
    favoriteLabel: 'Favorito',
    refreshLabel: 'Recargar',
    fullscreenLabel: 'Pantalla completa',
    floatingLabel: 'Ventana flotante',
  },
)

const emit = defineEmits<{
  'update:mode': [mode: Mode]
  'update:favorite': [value: boolean]
  'update:fullscreen': [value: boolean]
  'update:floating': [value: boolean]
  screenshot: []
  refresh: []
}>()

const modeOptions = [
  { value: 'demo', label: props.demoLabel },
  { value: 'real', label: props.realLabel },
]
</script>

<template>
  <div class="ui-game-player-toolbar">
    <div class="ui-game-player-toolbar__icons">
      <button type="button" class="ui-game-player-toolbar__icon-btn" :aria-label="screenshotLabel" @click="emit('screenshot')">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 7h3l1.5-2h7L17 7h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1Z" />
          <circle cx="12" cy="13" r="3.5" />
        </svg>
      </button>

      <button
        type="button"
        class="ui-game-player-toolbar__icon-btn"
        :class="{ 'ui-game-player-toolbar__icon-btn--active': fullscreen }"
        :aria-label="fullscreenLabel"
        :aria-pressed="fullscreen"
        @click="emit('update:fullscreen', !fullscreen)"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 9V5a1 1 0 0 1 1-1h4M20 9V5a1 1 0 0 0-1-1h-4M4 15v4a1 1 0 0 0 1 1h4M20 15v4a1 1 0 0 1-1 1h-4" />
        </svg>
      </button>

      <button
        type="button"
        class="ui-game-player-toolbar__icon-btn"
        :class="{ 'ui-game-player-toolbar__icon-btn--active': favorite }"
        :aria-label="favoriteLabel"
        :aria-pressed="favorite"
        @click="emit('update:favorite', !favorite)"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" :fill="favorite ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2" stroke-linejoin="round">
          <path d="M12 2.5l2.9 6.1 6.6.7-4.9 4.6 1.3 6.6-5.9-3.3-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.7L12 2.5Z" />
        </svg>
        <span v-if="favoriteCount !== undefined" class="ui-game-player-toolbar__favorite-count">{{ favoriteCount }}</span>
      </button>

      <button type="button" class="ui-game-player-toolbar__icon-btn" :aria-label="refreshLabel" @click="emit('refresh')">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 12a8 8 0 1 1-2.34-5.66" />
          <path d="M20 4v5h-5" />
        </svg>
      </button>

      <button
        type="button"
        class="ui-game-player-toolbar__icon-btn"
        :class="{ 'ui-game-player-toolbar__icon-btn--active': floating }"
        :aria-label="floatingLabel"
        :aria-pressed="floating"
        @click="emit('update:floating', !floating)"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round">
          <rect x="3" y="4" width="18" height="14" rx="2" />
          <rect x="12" y="11" width="7" height="5" rx="1" fill="currentColor" stroke="none" />
        </svg>
      </button>
    </div>

    <PillToggleGroup
      class="ui-game-player-toolbar__mode"
      :options="modeOptions"
      :model-value="mode"
      @update:model-value="emit('update:mode', $event as Mode)"
    />
  </div>
</template>

<style scoped>
.ui-game-player-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
  flex-wrap: wrap;
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-surface-dark);
  border-top: 1px solid var(--color-border);
}

.ui-game-player-toolbar__icons {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.ui-game-player-toolbar__icon-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 2.25rem;
  height: 2.25rem;
  border: 1px solid var(--color-surface-dark);
  border-radius: var(--radius-sm);
  background: var(--color-surface-dark-light);
  color: var(--color-surface-dark-text-primary);
  cursor: pointer;
  transition: border-color 0.15s ease, color 0.15s ease, background-color 0.15s ease;
}
.ui-game-player-toolbar__icon-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-surface-dark-text-secondary);
}
.ui-game-player-toolbar__icon-btn--active {
  background: #506f2f;
  border-color: var(--color-primary);
  color: white;
}

.ui-game-player-toolbar__favorite-count {
  position: absolute;
  bottom: -6px;
  right: -6px;
  font-size: 10px;
  font-weight: 700;
  line-height: 1;
  padding: 2px 4px;
  border-radius: 999px;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  color: var(--color-text);
}
</style>
