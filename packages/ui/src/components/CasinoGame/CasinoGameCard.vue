<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    image: string
    title: string
    /** Solo afecta el footer: 'overlay' no muestra subtitle de fallback, 'badge' si. El play siempre aparece al hover en ambas. */
    variant?: 'overlay' | 'badge'
    jackpotAmount?: number
    currency?: string
    playLabel?: string
    playersOnline?: number
    /** Solo se usa en variant="badge" cuando no se pasa provider. */
    subtitle?: string
    /** Nombre de la desarrolladora, siempre visible bajo el titulo en cualquier variante; tiene prioridad sobre subtitle. */
    provider?: string
  }>(),
  {
    variant: 'overlay',
    jackpotAmount: undefined,
    currency: 'us$',
    playLabel: 'Jugar',
    playersOnline: undefined,
    subtitle: 'Juego original',
    provider: undefined,
  },
)

const emit = defineEmits<{
  play: []
}>()

const formattedJackpot = computed(() => {
  if (props.jackpotAmount === undefined) return null
  return props.jackpotAmount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
})

const formattedPlayers = computed(() => {
  if (props.playersOnline === undefined) return null
  if (props.playersOnline >= 1000) {
    return `${(props.playersOnline / 1000).toFixed(1).replace(/\.0$/, '')}K`
  }
  return String(props.playersOnline)
})
</script>

<template>
  <div 
   class="ui-casino-game-card"
   :class="[`ui-casino-game-card--${variant}`, { 'ui-casino-game-card--with-jackpot': formattedJackpot }]">
    <span v-if="formattedJackpot" class="ui-casino-game-card__jackpot">{{ currency }} {{ formattedJackpot }}</span>

    <img :src="image" :alt="title" class="ui-casino-game-card__image" loading="lazy" />

    <span v-if="formattedPlayers" class="ui-casino-game-card__players">
      <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8Z" />
      </svg>
      {{ formattedPlayers }}
    </span>

    <div class="ui-casino-game-card__overlay">
      <span class="ui-casino-game-card__play-icon" aria-hidden="true">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M6 4l14 8-14 8V4Z" fill="currentColor" />
        </svg>
      </span>
    </div>

    <div class="ui-casino-game-card__footer">
      <h3 class="ui-casino-game-card__title">{{ title }}</h3>
      <p v-if="provider" class="ui-casino-game-card__provider">{{ provider }}</p>
      <p v-else-if="variant === 'badge'" class="ui-casino-game-card__subtitle">{{ subtitle }}</p>
    </div>
    <a 
    class="ui-casino-game-card__full-cover-link"
    href="javascript:void(0)" 
    @click="emit('play')" 
    :aria-label="`${playLabel}: 
    ${title}`" aria-hidden="true" 
    role="button"></a>
  </div>
  
</template>

<style scoped>
.ui-casino-game-card {
  position: relative;
  display: block;
  width: 100%;
  aspect-ratio: 2 / 3;
  padding: 0;
  border: none;
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--color-surface);
  cursor: pointer;
  transition: transform 0.15s ease;
}
.ui-casino-game-card--with-jackpot {
  /* La pill sobresale hacia arriba (ver .ui-casino-game-card__jackpot) — se
     resuelve dejando overflow visible, nunca corriendo la card con margin:
     eso la desalinearia respecto a sus hermanas sin jackpot en un grid/fila.
     El espacio para que la pill no quede pegada al elemento de arriba lo
     tiene que dar el layout que arma el grid (gap o padding-top), no la card. */
  overflow: visible;
  .ui-casino-game-card__image {
    border-radius:var(--radius-md);
  }
  .ui-casino-game-card__footer {
    border-radius:0 0 var(--radius-md) var(--radius-md);
  }
}
.ui-casino-game-card,
.ui-casino-game-card--badge {
  &:hover {
     transform: translateY(-3px);
  }
}
.ui-casino-game-card--badge:hover {
  transform: translateY(-3px);
}

.ui-casino-game-card__image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: inherit;
}

.ui-casino-game-card__jackpot {
  position: absolute;
  top: calc(-1 * var(--spacing-md));
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  background: var(--color-background);
  border: 1.5px solid var(--color-primary);
  color: var(--color-primary);
  font-family: var(--font-family-heading);
  font-weight: 800;
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 999px;
  white-space: nowrap;
}

.ui-casino-game-card__overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  background: rgba(10, 10, 12, 0.6);
  border-radius: inherit;
  opacity: 0;
  transition: opacity 0.2s ease;
}
.ui-casino-game-card:hover .ui-casino-game-card__overlay,
.ui-casino-game-card:focus-visible .ui-casino-game-card__overlay {
  opacity: 1;
}

.ui-casino-game-card__play-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: var(--color-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: scale(0.75);
  transition: transform 0.2s ease;
}
.ui-casino-game-card:hover .ui-casino-game-card__play-icon,
.ui-casino-game-card:focus-visible .ui-casino-game-card__play-icon {
  transform: scale(1);
}

.ui-casino-game-card__title {
  margin: 0;
  color: white;
  font-family: var(--font-family-heading);
  font-weight: 800;
  font-size: 16px;
  line-height: 1.2;
  text-align: center;
  text-transform: uppercase;
}

.ui-casino-game-card__players {
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-sm);
  z-index: 2;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: rgba(0, 0, 0, 0.45);
  color: white;
  font-family: var(--font-family-body);
  font-size: 11px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 999px;
}

/* Titulo (+ desarrolladora, o subtitulo como fallback en "badge") siempre
   visible, pegado abajo con un scrim para que se lea encima de cualquier imagen. */
.ui-casino-game-card__footer {
  position: absolute;
  inset: auto 0 0 0;
  padding: var(--spacing-lg) var(--spacing-sm) var(--spacing-sm);
  background: linear-gradient(to top, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0.35) 60%, transparent 100%);
  text-align: center;
}
.ui-casino-game-card__subtitle {
  margin: 2px 0 0;
  font-family: var(--font-family-body);
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: rgba(255, 255, 255, 0.75);
}
.ui-casino-game-card__provider {
  margin: 2px 0 0;
  font-family: var(--font-family-body);
  font-size: 11px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.65);
}

.ui-casino-game-card__full-cover-link {
  position: absolute;
  top:0;
  left:0;
  width:100%;
  height:100%;
  display: inline-block;
}
</style>
