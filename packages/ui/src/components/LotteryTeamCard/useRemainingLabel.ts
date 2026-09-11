import { computed, onBeforeUnmount, onMounted, ref, type Ref } from 'vue'

/** Texto compacto de tiempo restante (ej. "2d 4h", "45m 12s"), recalculado cada segundo. */
export function useRemainingLabel(target: Ref<Date | number | string | undefined>) {
  const now = ref(Date.now())
  let intervalId: ReturnType<typeof setInterval> | undefined

  onMounted(() => {
    intervalId = setInterval(() => {
      now.value = Date.now()
    }, 1000)
  })
  onBeforeUnmount(() => {
    if (intervalId) clearInterval(intervalId)
  })

  return computed(() => {
    if (!target.value) return null
    const diff = new Date(target.value).getTime() - now.value
    if (diff <= 0) return null

    const days = Math.floor(diff / 86_400_000)
    const hours = Math.floor((diff % 86_400_000) / 3_600_000)
    const minutes = Math.floor((diff % 3_600_000) / 60_000)
    const seconds = Math.floor((diff % 60_000) / 1000)

    if (days > 0) return `${days}d ${hours}h`
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m ${seconds}s`
  })
}
