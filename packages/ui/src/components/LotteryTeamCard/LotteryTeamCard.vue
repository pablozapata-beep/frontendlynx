<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Card from '../Card/Card.vue'
import LotteryBallBadge from '../LotteryBallBadge/LotteryBallBadge.vue'
import PillToggleGroup from '../PillToggleGroup/PillToggleGroup.vue'
import ProgressMeter from '../ProgressMeter/ProgressMeter.vue'
import Pill from '../Pill/Pill.vue'
import Button from '../Button/Button.vue'
import Countdown from '../Countdown/Countdown.vue'
import type { LotteryGroup } from './types'

const props = withDefaults(
  defineProps<{
    group: LotteryGroup
    /** Senal externa (no se deriva de las fechas): el grupo esta por cerrar. */
    isClosingSoon?: boolean
    totalParticipationsLabel?: string
    chancesLabel?: string
    closesInPrefixLabel?: string
    closedLabel?: string
    ticketsPrefixLabel?: string
    pricePerParticipationLabel?: string
    soldSuffixLabel?: string
    minLabel?: string
    minReachedLabel?: string
    minPendingPrefixLabel?: string
    minPendingSuffixLabel?: string
    closingSoonPrefixLabel?: string
    closingSoonSuffixLabel?: string
    nextDrawPrefixLabel?: string
    moreInfoLabel?: string
    ctaLabel?: string
  }>(),
  {
    isClosingSoon: false,
    totalParticipationsLabel: 'participaciones totales',
    chancesLabel: 'chances de ganar',
    closesInPrefixLabel: 'Cierra en',
    closedLabel: 'Grupo Cerrado',
    ticketsPrefixLabel: 'Se juegan',
    pricePerParticipationLabel: 'por participación',
    soldSuffixLabel: 'participaciones',
    minLabel: 'Mínimo',
    minReachedLabel: 'Listo para jugar',
    minPendingPrefixLabel: 'Faltan',
    minPendingSuffixLabel: 'para que juegue',
    closingSoonPrefixLabel: 'Cierra pronto – quedan',
    closingSoonSuffixLabel: 'participaciones',
    nextDrawPrefixLabel: 'Sortea',
    moreInfoLabel: 'Más información del Grupo',
    ctaLabel: 'Sumarme al grupo',
  },
)

const emit = defineEmits<{
  join: [payload: { group: LotteryGroup; optionIndex: number }]
  moreInfo: [group: LotteryGroup]
}>()

const selectedOptionIndex = ref(0)
const activeOption = computed(() => props.group.options[selectedOptionIndex.value])

const durationOptions = computed(() =>
  props.group.options.map((option, index) => ({ value: String(index), label: option.label })),
)

function onDurationChange(value: string) {
  selectedOptionIndex.value = Number(value)
}

const isLocked = computed(() => activeOption.value.sold >= activeOption.value.min)

const currency = computed(() => props.group.currency ?? 'USD')
const jackpotAmount = computed(() =>
  props.group.jackpotAmount !== undefined
    ? props.group.jackpotAmount >= 1_000_000
      ? Math.round(props.group.jackpotAmount / 1_000_000)
      : props.group.jackpotAmount
    : undefined,
)
const showMillionWord = computed(
  () => props.group.jackpotAmount !== undefined && props.group.jackpotAmount > 999_999,
)

const statusText = computed(() => {
  if (props.isClosingSoon) {
    const remaining = props.group.total - activeOption.value.sold
    return `${props.closingSoonPrefixLabel} ${remaining} ${props.closingSoonSuffixLabel}`
  }
  if (isLocked.value) return props.minReachedLabel
  const missing = activeOption.value.min - activeOption.value.sold
  return `${props.minPendingPrefixLabel} ${missing} ${props.minPendingSuffixLabel}`
})

const statusVariant = computed(() => {
  if (props.isClosingSoon) return 'danger'
  return isLocked.value ? 'success' : 'info'
})

const footerText = computed(() => {
  if (isLocked.value) return `${props.nextDrawPrefixLabel} ${activeOption.value.nextDrawLabel}`
  const missing = activeOption.value.min - activeOption.value.sold
  return `${props.minPendingPrefixLabel} ${missing} ${props.minPendingSuffixLabel}`
})

const isDrawExpired = ref(false)
watch(
  () => activeOption.value.nextDrawDate,
  () => {
    isDrawExpired.value = false
  },
)

function onJoinClick() {
  emit('join', { group: props.group, optionIndex: selectedOptionIndex.value })
}

function onMoreInfoClick() {
  emit('moreInfo', props.group)
}
</script>

<template>
  <Card variant="elevated" class="ui-lottery-team-card">
    <div class="ui-lottery-team-card__top">
      <div>
        <p class="ui-lottery-team-card__name">{{ group.name }}</p>
        <p class="ui-lottery-team-card__sub">{{ group.total }} {{ totalParticipationsLabel }}</p>
      </div>
      <div class="ui-lottery-team-card__balls">
        <LotteryBallBadge v-for="ball in group.balls" :key="ball.id" v-bind="ball" />
      </div>
    </div>

    <p v-if="jackpotAmount !== undefined" class="ui-lottery-team-card__jackpot">
      <span class="ui-lottery-team-card__jackpot-currency">{{ currency }}</span>
      <span class="ui-lottery-team-card__jackpot-amount">{{ jackpotAmount }}</span>
      <span v-if="showMillionWord" class="ui-lottery-team-card__jackpot-word">millones</span>
    </p>

    <div class="ui-lottery-team-card__meta-strip">
      <span class="ui-lottery-team-card__chances">
        <strong>{{ group.total }}</strong> {{ chancesLabel }}
      </span>
      <span v-if="activeOption.nextDrawDate && !isDrawExpired" class="ui-lottery-team-card__countdown">
        {{ closesInPrefixLabel }}
        <Countdown
          :key="String(activeOption.nextDrawDate)"
          variant="minimal"
          :target="activeOption.nextDrawDate"
          @expire="isDrawExpired = true"
        />
      </span>
      <span v-else-if="activeOption.nextDrawDate" class="ui-lottery-team-card__countdown ui-lottery-team-card__countdown--closed">
        {{ closedLabel }}
      </span>
    </div>

    <PillToggleGroup
      v-if="group.options.length > 1"
      class="ui-lottery-team-card__durations"
      :options="durationOptions"
      :model-value="String(selectedOptionIndex)"
      @update:model-value="onDurationChange"
    />

    <div class="ui-lottery-team-card__price-row">
      <p class="ui-lottery-team-card__price">${{ activeOption.price }}</p>
      <p class="ui-lottery-team-card__price-unit">
        {{ pricePerParticipationLabel }} · {{ activeOption.sorteosLabel }}
      </p>
    </div>

    <p class="ui-lottery-team-card__tickets">
      <span>{{ ticketsPrefixLabel }}</span>
      <strong>{{ group.ticketsLabel }}</strong>
    </p>

    <div class="ui-lottery-team-card__meter-block">
      <ProgressMeter
        :value="activeOption.sold"
        :max="group.total"
        :min="activeOption.min"
        :closing="isClosingSoon"
        :min-label="minLabel"
      />
      <div class="ui-lottery-team-card__meter-status">
        <p class="ui-lottery-team-card__sold">
          {{ activeOption.sold }} / {{ group.total }} {{ soldSuffixLabel }}
        </p>
        <Pill :variant="statusVariant" size="sm">{{ statusText }}</Pill>
      </div>
    </div>

    <Button variant="primary" @click="onJoinClick">{{ ctaLabel }}</Button>

    <p class="ui-lottery-team-card__footer-text" :class="{ 'ui-lottery-team-card__footer-text--muted': !isLocked }">
      {{ footerText }}
    </p>

    <a
      v-if="group.partialPath"
      href="javascript:void(0)"
      class="ui-lottery-team-card__more-info"
      @click="onMoreInfoClick"
    >
      {{ moreInfoLabel }}
    </a>
  </Card>
</template>

<style scoped>
.ui-lottery-team-card :deep(.ui-card__body) {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.ui-lottery-team-card :deep(.ui-button) {
  width: 100%;
}

.ui-lottery-team-card__top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.ui-lottery-team-card__name {
  font-family: var(--font-family-heading);
  font-weight: 700;
  font-size: 20px;
  margin: 0;
  color: var(--color-text);
}

.ui-lottery-team-card__sub {
  font-size: 12px;
  opacity: 0.6;
  margin: 2px 0 0;
  color: var(--color-text);
}

.ui-lottery-team-card__balls {
  display: flex;
}
.ui-lottery-team-card__balls > * + * {
  margin-left: -8px;
}

.ui-lottery-team-card__jackpot {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin: 0;
}
.ui-lottery-team-card__jackpot-currency,
.ui-lottery-team-card__jackpot-word {
  font-family: var(--font-family-heading);
  font-weight: 600;
  font-size: 14px;
  color: var(--color-text);
  opacity: 0.6;
  text-transform: lowercase;
}
.ui-lottery-team-card__jackpot-amount {
  font-family: var(--font-family-heading);
  font-weight: 800;
  font-size: 32px;
  line-height: 1;
  color: var(--color-primary);
}

.ui-lottery-team-card__meta-strip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-sm);
}
.ui-lottery-team-card__chances,
.ui-lottery-team-card__countdown {
  font-size: 11.5px;
  color: var(--color-text);
  opacity: 0.6;
}
.ui-lottery-team-card__chances strong {
  opacity: 1;
  font-weight: 700;
}
.ui-lottery-team-card__countdown {
  display: inline-flex;
  align-items: baseline;
  gap: 4px;
  white-space: nowrap;
  opacity: 1;
  color: var(--color-primary);
}
.ui-lottery-team-card__countdown :deep(.ui-countdown__value) {
  font-size: inherit;
  font-weight: 700;
  color: inherit;
}
.ui-lottery-team-card__countdown--closed {
  color: var(--color-text);
  opacity: 0.6;
}

.ui-lottery-team-card__price-row {
  display: flex;
  align-items: baseline;
  gap: var(--spacing-sm);
  margin: 0;
}
.ui-lottery-team-card__price {
  font-family: var(--font-family-heading);
  font-weight: 800;
  font-size: 22px;
  margin: 0;
  color: var(--color-text);
}
.ui-lottery-team-card__price-unit {
  font-size: 11.5px;
  opacity: 0.6;
  margin: 0;
  color: var(--color-text);
}

.ui-lottery-team-card__tickets {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 0;
  padding-top: var(--spacing-md);
  border-top: 1px dashed var(--color-border);
  font-size: 11.5px;
  color: var(--color-text);
}
.ui-lottery-team-card__tickets span {
  opacity: 0.6;
}
.ui-lottery-team-card__tickets strong {
  font-weight: 600;
}

.ui-lottery-team-card__meter-block {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.ui-lottery-team-card__meter-status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}
.ui-lottery-team-card__sold {
  font-size: 12px;
  opacity: 0.6;
  margin: 0;
  color: var(--color-text);
}

.ui-lottery-team-card__footer-text {
  text-align: center;
  font-size: 11.5px;
  margin: 0;
  color: var(--color-primary);
}
.ui-lottery-team-card__footer-text--muted {
  color: var(--color-text);
  opacity: 0.6;
}

.ui-lottery-team-card__more-info {
  display: block;
  text-align: center;
  font-size: 11px;
  color: var(--color-text);
  opacity: 0.6;
  text-decoration: underline;
}
.ui-lottery-team-card__more-info:hover {
  opacity: 1;
  text-decoration: none;
}
</style>
