<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Modal from '../Modal/Modal.vue'
import Button from '../Button/Button.vue'
import LotteryBallBadge from '../LotteryBallBadge/LotteryBallBadge.vue'
import QuantityStepper from '../QuantityStepper/QuantityStepper.vue'
import Countdown from '../Countdown/Countdown.vue'
import type { LotteryGroup } from './types'

const props = withDefaults(
  defineProps<{
    open: boolean
    group?: LotteryGroup
    optionIndex?: number
    closesInPrefixLabel?: string
    closedLabel?: string
    chancesLabel?: string
    ticketsPrefixLabel?: string
    stepperLabel?: string
    maxAvailableLabel?: (max: number) => string
    totalLabel?: string
    addLabel?: string
    addedLabel?: string
  }>(),
  {
    group: undefined,
    optionIndex: 0,
    closesInPrefixLabel: 'Cierra en',
    closedLabel: 'Grupo Cerrado',
    chancesLabel: 'chances de ganar',
    ticketsPrefixLabel: 'Se juegan',
    stepperLabel: 'Participaciones',
    maxAvailableLabel: (max: number) => `Hasta ${max} participaciones disponibles`,
    totalLabel: 'Total',
    addLabel: 'Agregar al carrito',
    addedLabel: '✓ Agregado',
  },
)

const emit = defineEmits<{
  close: []
  addToCart: [payload: { group: LotteryGroup; optionIndex: number; quantity: number }]
}>()

const option = computed(() => props.group?.options[props.optionIndex])

const isDrawExpired = ref(false)
watch(
  () => option.value?.nextDrawDate,
  () => {
    isDrawExpired.value = false
  },
)

const maxQuantity = computed(() => {
  if (!props.group || !option.value) return 10
  const available = props.group.total - option.value.sold
  return Math.min(10, available > 0 ? available : 10)
})

const quantity = ref(1)
const addedToCart = ref(false)
let closeTimeoutId: ReturnType<typeof setTimeout> | undefined

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      quantity.value = 1
      addedToCart.value = false
    } else if (closeTimeoutId) {
      clearTimeout(closeTimeoutId)
      closeTimeoutId = undefined
    }
  },
)

const total = computed(() => (option.value ? quantity.value * option.value.price : 0))

function confirmAddToCart() {
  if (addedToCart.value || !props.group || !option.value) return
  addedToCart.value = true
  emit('addToCart', { group: props.group, optionIndex: props.optionIndex, quantity: quantity.value })
  closeTimeoutId = setTimeout(() => emit('close'), 900)
}
</script>

<template>
  <Modal :open="open" sheet-class="ui-lottery-team-picker-modal" @close="emit('close')">
    <template v-if="group && option" #header>
      <div class="ui-lottery-team-picker-modal__header">
        <div class="ui-lottery-team-picker-modal__title-wrap">
          <h3 class="ui-lottery-team-picker-modal__title">{{ group.name }}</h3>
          <p class="ui-lottery-team-picker-modal__subtitle">{{ option.label }} · {{ option.sorteosLabel }}</p>
        </div>
        <div class="ui-lottery-team-picker-modal__balls">
          <LotteryBallBadge v-for="ball in group.balls" :key="ball.id" v-bind="ball" size="md" />
        </div>
      </div>

      <div class="ui-lottery-team-picker-modal__meta-row">
        <p v-if="group.jackpotAmount" class="ui-lottery-team-picker-modal__jackpot">
          <span class="ui-lottery-team-picker-modal__jackpot-currency">{{ group.currency ?? 'USD' }}</span>
          <strong class="ui-lottery-team-picker-modal__jackpot-amount">{{ Math.round(group.jackpotAmount / 1_000_000) }} <span>millones</span></strong>
        </p>
       
        
      </div>
      <div class="ui-lottery-team-picker-modal__meta-row meta-row-space-between">
         <p class="ui-lottery-team-picker-modal__chances">
          <strong>{{ group.total }}</strong> {{ chancesLabel }}
        </p>
        <div v-if="option.nextDrawDate && !isDrawExpired" class="ui-lottery-team-picker-modal__countdown">
          <p>{{ closesInPrefixLabel }}</p>
          <Countdown
            :key="String(option.nextDrawDate)"
            variant="minimal"
            :target="option.nextDrawDate"
            @expire="isDrawExpired = true"
          />
        </div>
        <span v-else-if="option.nextDrawDate" class="ui-lottery-team-picker-modal__countdown ui-lottery-team-picker-modal__countdown--closed">
          {{ closedLabel }}
        </span>
      </div>
    </template>

    <template v-if="group">
      <p class="ui-lottery-team-picker-modal__tickets">
        <span>{{ ticketsPrefixLabel }}</span>
        <strong>{{ group.ticketsLabel }}</strong>
      </p>

      <div class="ui-lottery-team-picker-modal__stepper-row">
        <p class="ui-lottery-team-picker-modal__stepper-label">{{ stepperLabel }}</p>
        <QuantityStepper v-model="quantity" :min="1" :max="maxQuantity" :aria-label="stepperLabel" />
      </div>
      <p class="ui-lottery-team-picker-modal__max-available">{{ maxAvailableLabel(maxQuantity) }}</p>
    </template>

    <template v-if="option" #footer>
      <div class="ui-lottery-team-picker-modal__footer">
        <p class="ui-lottery-team-picker-modal__total-row">
          <span>{{ totalLabel }}</span>
          <span class="ui-lottery-team-picker-modal__total-amount">${{ total }}</span>
        </p>
        <Button variant="primary" :disabled="addedToCart" @click="confirmAddToCart">
          {{ addedToCart ? addedLabel : addLabel }}
        </Button>
      </div>
    </template>
  </Modal>
</template>

<style scoped>

.ui-lottery-team-picker-modal__footer :deep(.ui-button) {
  width: 100%;
}

.ui-lottery-team-picker-modal__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--spacing-sm);
  padding:0 1.5rem 0 0;
}

.ui-lottery-team-picker-modal__title-wrap {
  min-width: 0;
}

.ui-lottery-team-picker-modal__title {
  font-family: var(--font-family-heading);
  font-weight: 700;
  font-size: clamp(1rem, 4vw, 1.25rem);
  margin: 0;
  padding:0 1rem 0 0;
  color: var(--color-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ui-lottery-team-picker-modal__subtitle {
  font-size: 12px;
  opacity: 0.6;
  margin: 2px 0 0;
  color: var(--color-text);
}

.ui-lottery-team-picker-modal__balls {
  display: flex;
  flex-shrink: 0;
}
.ui-lottery-team-picker-modal__balls > * + * {
  margin-left: -6px;
}

.ui-lottery-team-picker-modal__meta-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-sm);
  font-size: 11.5px;
  color: var(--color-text);
  &.meta-row-space-between {
    line-height: .5;
    justify-content: space-between;
    margin:0;
    padding:0;
  }
}
.ui-lottery-team-picker-modal__jackpot,
.ui-lottery-team-picker-modal__jackpot strong span{
  font-size: clamp(.9rem, 4vw, 1rem);
}

.ui-lottery-team-picker-modal__jackpot {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin: .8rem 0 0 0;
  font-family: var(--font-family-heading);
}

.ui-lottery-team-picker-modal__jackpot span {
  opacity: 0.6;
  text-transform: lowercase;
}
.ui-lottery-team-picker-modal__jackpot strong {
  font-size: clamp(1.3rem, 5vw, 2rem);
  color: var(--color-primary);
  font-weight: 800;
}

.ui-lottery-team-picker-modal__jackpot {
  .ui-lottery-team-picker-modal__jackpot-currency {
    font-weight: 600; 
  }
}
.ui-lottery-team-picker-modal__chances {
  opacity: 0.6;
}
.ui-lottery-team-picker-modal__chances strong {
  opacity: 1;
  font-weight: 700;
}
.ui-lottery-team-picker-modal__countdown {
  display: inline-flex;
  align-items: baseline;
  gap: 4px;
  color: var(--color-primary);
  white-space: nowrap;
}
.ui-lottery-team-picker-modal__countdown :deep(.ui-countdown__value) {
  font-size: inherit;
  font-weight: 700;
  color: inherit;
}
.ui-lottery-team-picker-modal__countdown--closed {
  color: var(--color-text);
  opacity: 0.6;
}

.ui-lottery-team-picker-modal__tickets,
.ui-lottery-team-picker-modal__stepper-label {
   font-size: clamp(.7rem, 4vw, .8rem);
}

.ui-lottery-team-picker-modal__tickets {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 0 0 var(--spacing-md);
  color: var(--color-text);
}
.ui-lottery-team-picker-modal__tickets span {
  opacity: 0.6;
}
.ui-lottery-team-picker-modal__tickets strong {
  font-weight: 600;
}

.ui-lottery-team-picker-modal__stepper-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-sm);
  background: rgba(0,0,0,.3);
  padding:.6rem;
  border-radius: var(--radius-sm);
}
.ui-lottery-team-picker-modal__stepper-label {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text);
}

.ui-lottery-team-picker-modal__max-available {
  font-size: 11px;
  opacity: 0.6;
  margin: var(--spacing-sm) 0 0;
  color: var(--color-text);
}

.ui-lottery-team-picker-modal__total-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin: 0 0 var(--spacing-md);
  font-family: var(--font-family-body);
  color: var(--color-text);
}
.ui-lottery-team-picker-modal__total-amount {
  font-family: var(--font-family-heading);
  font-weight: 800;
  font-size: 22px;
}
</style>
