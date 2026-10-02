<script setup lang="ts">
import BalancePill from '../BalancePill/BalancePill.vue'
import SegmentedToggle from '../SegmentedToggle/SegmentedToggle.vue'

type Mode = 'demo' | 'real'

const props = withDefaults(
  defineProps<{
    mode: Mode
    favorite?: boolean
    favoriteCount?: number
    fullscreen?: boolean
    floating?: boolean
    /** Saldo del usuario. Si no se pasa, no se muestra el pill de saldo. */
    balance?: number
    currency?: string
    /** Con saldo menor o igual a este valor el pill pasa a estado "bajo" (rojo). */
    lowBalanceThreshold?: number
    balanceLabel?: string
    lowBalanceLabel?: string
    noBalanceLabel?: string
    addBalanceLabel?: string
    demoLabel?: string
    realLabel?: string
    favoriteLabel?: string
    fullscreenLabel?: string
    floatingLabel?: string
  }>(),
  {
    favorite: false,
    favoriteCount: undefined,
    fullscreen: false,
    floating: false,
    balance: undefined,
    currency: '$',
    lowBalanceThreshold: 200,
    balanceLabel: 'Saldo disponible',
    lowBalanceLabel: 'Saldo bajo',
    noBalanceLabel: 'Sin saldo',
    addBalanceLabel: 'Agregar saldo',
    demoLabel: 'Demo',
    realLabel: 'Jugar',
    favoriteLabel: 'Favorito',
    fullscreenLabel: 'Pantalla completa',
    floatingLabel: 'Ventana flotante',
  },
)

const emit = defineEmits<{
  'update:mode': [mode: Mode]
  'update:favorite': [value: boolean]
  'update:fullscreen': [value: boolean]
  'update:floating': [value: boolean]
  addBalance: []
}>()

const modeOptions = [
  { value: 'demo', label: props.demoLabel },
  { value: 'real', label: props.realLabel },
]
</script>

<template>
  <div class="ui-game-player-toolbar">
    <div class="ui-game-player-toolbar-wrap">
      <div class="ui-game-player-toolbar__icons">
        <button type="button" class="ui-game-player-toolbar__icon-btn"
          :class="{ 'ui-game-player-toolbar__icon-btn--active': fullscreen }" :aria-label="fullscreenLabel"
          :data-tooltip="fullscreenLabel" :aria-pressed="fullscreen" @click="emit('update:fullscreen', !fullscreen)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 9V5a1 1 0 0 1 1-1h4M20 9V5a1 1 0 0 0-1-1h-4M4 15v4a1 1 0 0 0 1 1h4M20 15v4a1 1 0 0 1-1 1h-4" />
          </svg>
        </button>

        <button type="button" class="ui-game-player-toolbar__icon-btn" :class="[
          'ui-game-player-toolbar__icon-btn--desktop-only',
          { 'ui-game-player-toolbar__icon-btn--active': favorite },
        ]" :aria-label="favoriteLabel" :data-tooltip="favoriteLabel" :aria-pressed="favorite"
          @click="emit('update:favorite', !favorite)">
          <svg width="18" height="18" viewBox="0 0 24 24" :fill="favorite ? 'currentColor' : 'none'"
            stroke="currentColor" stroke-width="2" stroke-linejoin="round">
            <path d="M12 2.5l2.9 6.1 6.6.7-4.9 4.6 1.3 6.6-5.9-3.3-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.7L12 2.5Z" />
          </svg>
          <span v-if="favoriteCount !== undefined" class="ui-game-player-toolbar__favorite-count">{{ favoriteCount
            }}</span>
        </button>

        <button type="button" class="ui-game-player-toolbar__icon-btn" :class="[
          'ui-game-player-toolbar__icon-btn--desktop-only',
          { 'ui-game-player-toolbar__icon-btn--active': floating },
        ]" :aria-label="floatingLabel" :data-tooltip="floatingLabel" :aria-pressed="floating"
          @click="emit('update:floating', !floating)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="14" rx="2" />
            <rect x="12" y="11" width="7" height="5" rx="1" fill="currentColor" stroke="none" />
          </svg>
        </button>
      </div>

      <BalancePill v-if="balance !== undefined" :balance="balance" :currency="currency"
        :low-threshold="lowBalanceThreshold" :label="balanceLabel" :low-label="lowBalanceLabel"
        :empty-label="noBalanceLabel" :add-label="addBalanceLabel" @add="emit('addBalance')" />

    </div>
    <div class="ui-game-player-toolbar-wrap">
      <SegmentedToggle class="ui-game-player-toolbar__mode" :options="modeOptions" :model-value="mode"
      @update:model-value="emit('update:mode', $event as Mode)" />
    </div>
    
  </div>
</template>

<style scoped>
.ui-game-player-toolbar,
.ui-game-player-toolbar-wrap {
  display: flex;
  align-items: center;
  flex-wrap: wrap;

}

.ui-game-player-toolbar {
  justify-content: space-between;
  gap: var(--spacing-md);
  font-family: var(--font-family-body);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-surface-dark);
  border-top: 1px solid var(--color-border);
  @media only screen and (max-width:580px){
    padding:10px;
    gap:10px;
  }
  @media only screen and (max-width:390px){
    flex-direction: column;
    justify-content: center;
  }
}

.ui-game-player-toolbar-wrap {
   gap: var(--spacing-sm);
   @media only screen and (max-width:390px){
    justify-content: center;
  }
}

.ui-game-player-toolbar__mode {
  margin-left: auto;
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
  @media only screen and (max-width:580px){
     width: 2rem;
    height: 2rem;
  }
}

.ui-game-player-toolbar__icon-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-surface-dark-text-secondary);
}

.ui-game-player-toolbar__icon-btn--active {
  background: var(--color-secondary-active-surface);
  border-color: var(--color-primary);
  color: white;
}

.ui-game-player-toolbar__icon-btn[data-tooltip]::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translate(-50%, 4px);
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  background: var(--color-surface-dark-light);
  border: 1px solid var(--color-surface-dark-text-primary);
  color: var(--color-surface-dark-text-secondary);
  font-size: 11px;
  font-weight: 600;
  line-height: 1.2;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.15s ease, transform 0.15s ease;
  z-index: 10;
}

.ui-game-player-toolbar__icon-btn[data-tooltip]:hover::after,
.ui-game-player-toolbar__icon-btn[data-tooltip]:focus-visible::after {
  opacity: 1;
  transform: translate(-50%, 0);
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

/* Mobile: se ocultan favorito y ventana flotante para dar espacio. */
@media (max-width: 640px) {
  .ui-game-player-toolbar__icon-btn--desktop-only {
    display: none;
  }
}
</style>
