import { computed, ref, type ComputedRef, type Ref } from 'vue'
import type { FixedGameConfig, JackpotGame, RangeGameConfig } from '../JackpotCard/types'
import type {
  DrawDurationOption,
  FixedFlowOptionId,
  MagicBet,
  PickerMode,
  Ticket,
  TicketLine,
} from './types'

let uid = 0
function nextId(prefix: string) {
  uid += 1
  return `${prefix}-${uid}`
}

function range(min: number, max: number): number[] {
  const list: number[] = []
  for (let n = min; n <= max; n++) list.push(n)
  return list
}

function pickRandom(min: number, max: number, count: number): number[] {
  const pool = range(min, max)
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j]!, pool[i]!]
  }
  return pool.slice(0, count).sort((a, b) => a - b)
}

function generateRandomLine(config: RangeGameConfig): TicketLine {
  return {
    id: nextId('line'),
    main: pickRandom(config.mainMin, config.mainMax, config.mainCount),
    bonus: pickRandom(config.bonusMin, config.bonusMax, config.bonusCount),
  }
}

export interface FixedOptionTotal {
  totalDecimos: number
  total: number
  effectiveUnitPrice: number
}

/**
 * Los decimos por debajo de volumeThreshold pagan precio completo; a partir de ahi,
 * los primeros volumeMax decimos reciben volumeDiscount cada uno (el resto, si supera
 * volumeMax, vuelve a pagar precio completo). Verificado contra el calcOptionTotal
 * original: es la misma formula para "diferentes"/"mismo numero"/"entero" — "entero"
 * solo entra con un unitPrice mas bajo y decimosPerUnit = enteroDecimos.
 */
export function calcFixedTotal(
  quantity: number,
  unitPrice: number,
  decimosPerUnit: number,
  fixedConfig: FixedGameConfig,
): FixedOptionTotal {
  const totalDecimos = quantity * decimosPerUnit
  const applies = totalDecimos >= fixedConfig.volumeThreshold
  const discountedDecimos = applies ? Math.min(totalDecimos, fixedConfig.volumeMax) : 0
  const total = totalDecimos * unitPrice - discountedDecimos * fixedConfig.volumeDiscount
  const effectiveUnitPrice = quantity > 0 ? total / quantity : unitPrice
  return { totalDecimos, total, effectiveUnitPrice }
}

interface FixedOptionDefinition {
  id: FixedFlowOptionId
  unitPrice: number
  decimosPerUnit: number
}

function fixedOptionDefinitions(game: JackpotGame, config: FixedGameConfig): FixedOptionDefinition[] {
  return [
    { id: 'different', unitPrice: game.price, decimosPerUnit: 1 },
    { id: 'same', unitPrice: game.price, decimosPerUnit: 1 },
    {
      id: 'entero',
      unitPrice: game.price - config.enteroDiscount,
      decimosPerUnit: config.enteroDecimos,
    },
  ]
}

export function createTicketPickerState(
  game: Ref<JackpotGame> | ComputedRef<JackpotGame>,
  drawDurationOptions: Ref<DrawDurationOption[]> | ComputedRef<DrawDurationOption[]>,
) {
  const mode = ref<PickerMode>('manual')
  const numPlays = ref(1)
  const mainPicks = ref<number[]>([])
  const bonusPicks = ref<number[]>([])
  const lines = ref<TicketLine[]>([])
  const drawDurationIndex = ref(0)
  const magicPanelOpen = ref(false)
  const magicPicks = ref<number[]>([])
  const magicBets = ref<MagicBet[]>([])
  const fixedQuantities = ref<Record<FixedFlowOptionId, number>>({
    different: 1,
    same: 1,
    entero: 1,
  })
  const selectedFixedOption = ref<FixedFlowOptionId>('different')

  const rangeConfig = computed<RangeGameConfig | null>(() =>
    game.value.config.kind === 'range' ? game.value.config : null,
  )
  const fixedConfig = computed<FixedGameConfig | null>(() =>
    game.value.config.kind === 'fixed' ? game.value.config : null,
  )

  const canAddLine = computed(() => {
    const config = rangeConfig.value
    if (!config) return false
    return (
      mainPicks.value.length === config.mainCount && bonusPicks.value.length === config.bonusCount
    )
  })

  const selectedDrawDuration = computed(
    () => drawDurationOptions.value[drawDurationIndex.value] ?? drawDurationOptions.value[0]!,
  )

  const linesSubtotal = computed(
    () => lines.value.length * game.value.price * selectedDrawDuration.value.draws,
  )
  const linesTotal = computed(() => linesSubtotal.value * (1 - selectedDrawDuration.value.discount))
  const magicTotal = computed(() => magicBets.value.reduce((sum, bet) => sum + bet.stake, 0))

  const fixedOptionTotals = computed(() => {
    const config = fixedConfig.value
    const totals = {} as Record<FixedFlowOptionId, FixedOptionTotal>
    if (!config) return totals
    for (const def of fixedOptionDefinitions(game.value, config)) {
      totals[def.id] = calcFixedTotal(fixedQuantities.value[def.id], def.unitPrice, def.decimosPerUnit, config)
    }
    return totals
  })

  const grandTotal = computed(() => {
    if (game.value.config.kind === 'fixed') {
      return fixedOptionTotals.value[selectedFixedOption.value]?.total ?? 0
    }
    return linesTotal.value + magicTotal.value
  })

  const canSubmit = computed(() => {
    if (game.value.config.kind === 'fixed') {
      return (fixedOptionTotals.value[selectedFixedOption.value]?.totalDecimos ?? 0) > 0
    }
    return lines.value.length > 0 || magicBets.value.length > 0
  })

  function setMode(next: PickerMode) {
    mode.value = next
  }

  function clearCurrentPicks() {
    mainPicks.value = []
    bonusPicks.value = []
  }

  function addLine() {
    if (!rangeConfig.value || !canAddLine.value) return
    lines.value.push({
      id: nextId('line'),
      main: [...mainPicks.value].sort((a, b) => a - b),
      bonus: [...bonusPicks.value].sort((a, b) => a - b),
    })
    clearCurrentPicks()
  }

  function removeLine(id: string) {
    lines.value = lines.value.filter((line) => line.id !== id)
  }

  function generateRandomLines(count: number) {
    const config = rangeConfig.value
    if (!config) return
    for (let i = 0; i < count; i++) lines.value.push(generateRandomLine(config))
  }

  function setDrawDurationIndex(index: number) {
    drawDurationIndex.value = index
  }

  function toggleMagicPanel() {
    magicPanelOpen.value = !magicPanelOpen.value
  }

  function addMagicBets() {
    const config = rangeConfig.value?.magicNumber
    if (!config) return
    for (const number of magicPicks.value) {
      if (magicBets.value.some((bet) => bet.number === number)) continue
      magicBets.value.push({ id: nextId('magic'), number, stake: config.betMin })
    }
    magicPicks.value = []
  }

  function updateMagicStake(id: string, stake: number) {
    const bet = magicBets.value.find((b) => b.id === id)
    if (bet) bet.stake = stake
  }

  function removeMagicBet(id: string) {
    magicBets.value = magicBets.value.filter((bet) => bet.id !== id)
  }

  function setFixedOption(id: FixedFlowOptionId) {
    selectedFixedOption.value = id
  }

  function setFixedQuantity(id: FixedFlowOptionId, quantity: number) {
    fixedQuantities.value = { ...fixedQuantities.value, [id]: quantity }
  }

  function buildTicket(): Ticket {
    const currentGame = game.value

    if (currentGame.config.kind === 'fixed') {
      const totals = fixedOptionTotals.value[selectedFixedOption.value]!
      return {
        gameId: currentGame.id,
        gameName: currentGame.name,
        currency: currentGame.currency ?? '$',
        total: totals.total,
        payload: {
          kind: 'fixed',
          option: selectedFixedOption.value,
          quantity: fixedQuantities.value[selectedFixedOption.value],
          unitPrice: totals.effectiveUnitPrice,
          total: totals.total,
        },
      }
    }

    return {
      gameId: currentGame.id,
      gameName: currentGame.name,
      currency: currentGame.currency ?? '$',
      total: grandTotal.value,
      payload: {
        kind: 'range',
        lines: lines.value.map((line) => ({ main: line.main, bonus: line.bonus })),
        drawDuration: selectedDrawDuration.value.draws,
        drawDiscount: selectedDrawDuration.value.discount,
        magicBets: magicBets.value.map((bet) => ({ number: bet.number, stake: bet.stake })),
        linesSubtotal: linesSubtotal.value,
        linesTotal: linesTotal.value,
        magicTotal: magicTotal.value,
      },
    }
  }

  function reset() {
    mode.value = 'manual'
    numPlays.value = rangeConfig.value?.defaultPlays ?? 1
    mainPicks.value = []
    bonusPicks.value = []
    lines.value = []
    drawDurationIndex.value = 0
    magicPanelOpen.value = false
    magicPicks.value = []
    magicBets.value = []
    fixedQuantities.value = { different: 1, same: 1, entero: 1 }
    selectedFixedOption.value = 'different'
  }

  reset()

  return {
    game,
    drawDurationOptions,
    mode,
    numPlays,
    mainPicks,
    bonusPicks,
    lines,
    drawDurationIndex,
    magicPanelOpen,
    magicPicks,
    magicBets,
    fixedQuantities,
    selectedFixedOption,
    rangeConfig,
    fixedConfig,
    canAddLine,
    selectedDrawDuration,
    linesSubtotal,
    linesTotal,
    magicTotal,
    fixedOptionTotals,
    grandTotal,
    canSubmit,
    setMode,
    clearCurrentPicks,
    addLine,
    removeLine,
    generateRandomLines,
    setDrawDurationIndex,
    toggleMagicPanel,
    addMagicBets,
    updateMagicStake,
    removeMagicBet,
    setFixedOption,
    setFixedQuantity,
    buildTicket,
    reset,
  }
}

export type TicketPickerState = ReturnType<typeof createTicketPickerState>
