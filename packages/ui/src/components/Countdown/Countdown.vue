<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    target: Date | number | string
    /** 'tiles': el clasico con recuadros por unidad. 'minimal': una linea de texto tipo "2 Días 11:15:33". 'framed': fila de numero+label enmarcada con un borde punteado arriba/abajo, como en una card. */
    variant?: 'tiles' | 'minimal' | 'framed'
    label?: string
    dayLabel?: string
    hourLabel?: string
    minuteLabel?: string
    secondLabel?: string
    /** Solo variant="minimal": palabra "Día"/"Días" segun corresponda. */
    formatDays?: (days: number) => string
  }>(),
  {
    variant: 'tiles',
    label: undefined,
    dayLabel: 'd',
    hourLabel: 'h',
    minuteLabel: 'm',
    secondLabel: 's',
    formatDays: (days: number) => (days === 1 ? 'Día' : 'Días'),
  },
)

const emit = defineEmits<{
  expire: []
}>()

const targetTime = computed(() => new Date(props.target).getTime())
const remainingMs = ref(Math.max(0, targetTime.value - Date.now()))

const days = computed(() => Math.floor(remainingMs.value / 86_400_000))
const hours = computed(() => Math.floor((remainingMs.value % 86_400_000) / 3_600_000))
const minutes = computed(() => Math.floor((remainingMs.value % 3_600_000) / 60_000))
const seconds = computed(() => Math.floor((remainingMs.value % 60_000) / 1000))

const pad = (n: number) => String(n).padStart(2, '0')

const minimalText = computed(() => {
  const time = `${pad(hours.value)}:${pad(minutes.value)}:${pad(seconds.value)}`
  return days.value > 0 ? `${days.value} ${props.formatDays(days.value)} ${time}` : time
})

let intervalId: ReturnType<typeof setInterval> | undefined
let expired = false

function tick() {
  remainingMs.value = Math.max(0, targetTime.value - Date.now())

  if (remainingMs.value === 0) {
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = undefined
    }
    if (!expired) {
      expired = true
      emit('expire')
    }
  }
}

onMounted(() => {
  tick()
  if (remainingMs.value > 0) {
    intervalId = setInterval(tick, 1000)
  }
})

onBeforeUnmount(() => {
  if (intervalId) clearInterval(intervalId)
})
</script>

<template>
  <div class="ui-countdown" role="timer" aria-live="polite">
    <p v-if="label" class="ui-countdown__label">{{ label }}</p>

    <p v-if="variant === 'minimal'" class="ui-countdown__value">{{ minimalText }}</p>

    <div v-else-if="variant === 'framed'" class="ui-countdown__framed">
      <div class="ui-countdown__framed-box">
        <strong class="ui-countdown__framed-value">{{ pad(days) }}</strong>
        <span class="ui-countdown__framed-label">{{ dayLabel }}</span>
      </div>
      <div class="ui-countdown__framed-box">
        <strong class="ui-countdown__framed-value">{{ pad(hours) }}</strong>
        <span class="ui-countdown__framed-label">{{ hourLabel }}</span>
      </div>
      <div class="ui-countdown__framed-box">
        <strong class="ui-countdown__framed-value">{{ pad(minutes) }}</strong>
        <span class="ui-countdown__framed-label">{{ minuteLabel }}</span>
      </div>
      <div class="ui-countdown__framed-box">
        <strong class="ui-countdown__framed-value">{{ pad(seconds) }}</strong>
        <span class="ui-countdown__framed-label">{{ secondLabel }}</span>
      </div>
    </div>

    <div v-else class="ui-countdown__row">
      <div class="ui-countdown__group">
        <span :key="`d-${days}`" class="ui-countdown__tile">{{ pad(days) }}</span>
        <span class="ui-countdown__suffix">{{ dayLabel }}</span>
      </div>
      <div class="ui-countdown__group">
        <span :key="`h-${hours}`" class="ui-countdown__tile">{{ pad(hours) }}</span>
        <span class="ui-countdown__suffix">{{ hourLabel }}</span>
      </div>
      <div class="ui-countdown__group">
        <span :key="`m-${minutes}`" class="ui-countdown__tile">{{ pad(minutes) }}</span>
        <span class="ui-countdown__suffix">{{ minuteLabel }}</span>
      </div>
      <div class="ui-countdown__group">
        <span :key="`s-${seconds}`" class="ui-countdown__tile">{{ pad(seconds) }}</span>
        <span class="ui-countdown__suffix">{{ secondLabel }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ui-countdown {
  font-family: var(--font-family-body);
  color: var(--color-text);
}

.ui-countdown__label {
  font-size: 13px;
  opacity: 0.65;
  margin: 0 0 var(--spacing-sm);
}

.ui-countdown__value {
  margin: 0;
  font-variant-numeric: tabular-nums;
  font-weight: 700;
  font-size: 15px;
  color: var(--color-text);
}

.ui-countdown__row {
  display: flex;
  gap: var(--spacing-sm);
}

.ui-countdown__group {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.ui-countdown__tile {
  display: inline-block;
  font-variant-numeric: tabular-nums;
  font-weight: 700;
  font-size: 26px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-sm) var(--spacing-md);
  min-width: 2.5rem;
  text-align: center;
  animation: ui-countdown-flip 0.4s ease;
}

@keyframes ui-countdown-flip {
  0% {
    transform: scaleY(1);
  }
  45% {
    transform: scaleY(0.82);
  }
  100% {
    transform: scaleY(1);
  }
}

.ui-countdown__suffix {
  font-size: 12px;
  opacity: 0.65;
}

.ui-countdown__framed {
  display: flex;
  gap: var(--spacing-sm);
  border-top: 1px dashed var(--color-border);
  border-bottom: 1px dashed var(--color-border);
  padding: var(--spacing-sm) 0;
}

.ui-countdown__framed-box {
  flex: 1;
  text-align: center;
}

.ui-countdown__framed-value {
  display: block;
  font-variant-numeric: tabular-nums;
  font-weight: 700;
  font-size: 17px;
  color: var(--color-text);
}

.ui-countdown__framed-label {
  display: block;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text);
  opacity: 0.6;
}

@media (prefers-reduced-motion: reduce) {
  .ui-countdown__tile {
    animation: none;
  }
}
</style>
