<script setup lang="ts">
import { computed } from 'vue'
import Card from '../Card/Card.vue'
import Countdown from '../Countdown/Countdown.vue'
import LotteryBallBadge from '../LotteryBallBadge/LotteryBallBadge.vue'
import Pill from '../Pill/Pill.vue'
import Button from '../Button/Button.vue'
import type { JackpotGame } from './types'

const props = withDefaults(
  defineProps<{
    game: JackpotGame
    jackpotLabel?: string
    jackpotNote?: string
    hotBadgeLabel?: string
    ctaLabel?: string
    priceUnitLabel?: string
    drawPrefixLabel?: string
    countdownDayLabel?: string
    countdownHourLabel?: string
    countdownMinuteLabel?: string
    countdownSecondLabel?: string
  }>(),
  {
    jackpotLabel: 'Bote actual',
    jackpotNote: 'Sube en cada sorteo sin ganador',
    hotBadgeLabel: '🔥 Pozo alto',
    ctaLabel: 'Jugar ahora',
    priceUnitLabel: undefined,
    drawPrefixLabel: 'Sorteo',
    countdownDayLabel: 'días',
    countdownHourLabel: 'hs',
    countdownMinuteLabel: 'min',
    countdownSecondLabel: 'seg',
  },
)

const emit = defineEmits<{
  play: [game: JackpotGame]
  expire: []
}>()

const currency = computed(() => props.game.currency ?? '$')
const effectivePriceUnitLabel = computed(
  () => props.priceUnitLabel ?? (props.game.config.kind === 'fixed' ? 'por décimo' : 'por línea'),
)

function formatAmount(amount: number) {
  if (amount >= 1_000_000) return `${currency.value}${Math.round(amount / 1_000_000)} millones`
  return `${currency.value}${amount.toLocaleString('es-ES')}`
}
</script>

<template>
  <Card variant="elevated" class="ui-jackpot-card">
    <div class="ui-jackpot-card__top">
      <div class="ui-jackpot-card__info">
        <p class="ui-jackpot-card__name">{{ game.name }}</p>
        <p class="ui-jackpot-card__region">{{ game.region }}</p>
      </div>
      <div class="ui-jackpot-card__balls">
        <LotteryBallBadge v-for="ball in game.balls" :key="ball.id" v-bind="ball" />
      </div>
    </div>

    <div v-if="game.hot || game.discountLabel" class="ui-jackpot-card__badges">
      <Pill v-if="game.hot" variant="danger" size="sm">{{ hotBadgeLabel }}</Pill>
      <Pill v-if="game.discountLabel" variant="success" size="sm">{{ game.discountLabel }}</Pill>
    </div>

    <div class="ui-jackpot-card__jackpot">
      <span class="ui-jackpot-card__jackpot-label">{{ jackpotLabel }}</span>
      <p class="ui-jackpot-card__jackpot-amount">{{ formatAmount(game.jackpotAmount) }}</p>
      <p class="ui-jackpot-card__jackpot-note">{{ jackpotNote }}</p>
    </div>

    <Countdown
      variant="framed"
      :target="game.closesAt"
      :day-label="countdownDayLabel"
      :hour-label="countdownHourLabel"
      :minute-label="countdownMinuteLabel"
      :second-label="countdownSecondLabel"
      @expire="emit('expire')"
    />

    <div class="ui-jackpot-card__price-row">
      <span class="ui-jackpot-card__price">{{ currency }}{{ game.price.toFixed(2) }}</span>
      <span v-if="game.oldPrice" class="ui-jackpot-card__old-price">
        {{ currency }}{{ game.oldPrice.toFixed(2) }}
      </span>
      <span class="ui-jackpot-card__price-unit">{{ effectivePriceUnitLabel }}</span>
    </div>

    <Button variant="primary" @click="emit('play', game)">{{ ctaLabel }}</Button>

    <p class="ui-jackpot-card__next-draw">{{ drawPrefixLabel }}: {{ game.drawLabel }}</p>
  </Card>
</template>

<style scoped>
.ui-jackpot-card :deep(.ui-card__body) {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.ui-jackpot-card :deep(.ui-button) {
  width: 100%;
}

.ui-jackpot-card__top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.ui-jackpot-card__info {
  min-width: 0;
}

.ui-jackpot-card__name {
  font-family: var(--font-family-heading);
  font-weight: 700;
  font-size: 20px;
  margin: 0;
  color: var(--color-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ui-jackpot-card__region {
  font-size: 12px;
  opacity: 0.6;
  margin: 2px 0 0;
  color: var(--color-text);
}

.ui-jackpot-card__balls {
  display: flex;
}
.ui-jackpot-card__balls > * + * {
  margin-left: -8px;
}

.ui-jackpot-card__badges {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.ui-jackpot-card__jackpot-label {
  display: block;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  opacity: 0.6;
  margin-bottom: 4px;
  color: var(--color-text);
}

.ui-jackpot-card__jackpot-amount {
  font-family: var(--font-family-heading);
  font-weight: 800;
  font-size: 32px;
  line-height: 1;
  margin: 0;
  color: var(--color-primary);
}

.ui-jackpot-card__jackpot-note {
  font-size: 11.5px;
  opacity: 0.6;
  margin: 4px 0 0;
  color: var(--color-text);
}

.ui-jackpot-card__price-row {
  display: flex;
  align-items: baseline;
  gap: var(--spacing-sm);
}

.ui-jackpot-card__price {
  font-family: var(--font-family-heading);
  font-weight: 800;
  font-size: 22px;
  color: var(--color-text);
}

.ui-jackpot-card__old-price {
  font-size: 13px;
  opacity: 0.5;
  text-decoration: line-through;
  color: var(--color-text);
}

.ui-jackpot-card__price-unit {
  font-size: 11.5px;
  opacity: 0.6;
  color: var(--color-text);
}

.ui-jackpot-card__next-draw {
  text-align: center;
  font-size: 11px;
  opacity: 0.6;
  margin: 0;
  color: var(--color-text);
}
</style>
