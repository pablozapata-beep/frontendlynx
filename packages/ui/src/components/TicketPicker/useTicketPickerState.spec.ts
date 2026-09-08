import { describe, expect, it } from 'vitest'
import { computed, ref } from 'vue'
import type { FixedGameConfig, JackpotGame } from '../JackpotCard/types'
import { calcFixedTotal, createTicketPickerState } from './useTicketPickerState'
import { DEFAULT_DRAW_DURATION_OPTIONS } from './types'

const rangeGame: JackpotGame = {
  id: 'powerball',
  name: 'Powerball',
  region: 'Estados Unidos',
  balls: [{ id: 'pb', label: 'PB', background: '#E4002B' }],
  jackpotAmount: 350_000_000,
  hot: true,
  price: 3,
  drawLabel: 'Sábado 22:00',
  closesAt: Date.now() + 60_000,
  config: {
    kind: 'range',
    mainCount: 5,
    mainMin: 1,
    mainMax: 69,
    bonusCount: 1,
    bonusMin: 1,
    bonusMax: 26,
    bonusLabel: 'Powerball',
    defaultPlays: 2,
    magicNumber: { min: 1, max: 69, betMin: 1, betMax: 100, payout: 7 },
  },
}

const fixedGame: JackpotGame = {
  id: 'loteria-nacional',
  name: 'Lotería Nacional',
  region: 'España',
  balls: [{ id: 'ln', label: 'LN', background: '#8A6E2E' }],
  jackpotAmount: 300_000,
  price: 3,
  currency: '€',
  drawLabel: 'Jueves 21:15',
  closesAt: Date.now() + 60_000,
  config: {
    kind: 'fixed',
    digits: 5,
    volumeDiscount: 0.3,
    volumeThreshold: 3,
    volumeMax: 10,
    enteroDecimos: 10,
    enteroDiscount: 0.2,
  },
}

function setupRange() {
  const game = ref(rangeGame)
  const drawOptions = ref(DEFAULT_DRAW_DURATION_OPTIONS)
  return createTicketPickerState(game, drawOptions)
}

function setupFixed() {
  const game = ref(fixedGame)
  const drawOptions = ref(DEFAULT_DRAW_DURATION_OPTIONS)
  return createTicketPickerState(game, drawOptions)
}

describe('calcFixedTotal', () => {
  const config = fixedGame.config as FixedGameConfig

  it('no aplica descuento por debajo del umbral', () => {
    const result = calcFixedTotal(2, 3, 1, config)
    expect(result).toEqual({ totalDecimos: 2, total: 6, effectiveUnitPrice: 3 })
  })

  it('aplica descuento a todos los decimos cuando no supera volumeMax', () => {
    const result = calcFixedTotal(5, 3, 1, config)
    expect(result.totalDecimos).toBe(5)
    expect(result.total).toBeCloseTo(13.5)
    expect(result.effectiveUnitPrice).toBeCloseTo(2.7)
  })

  it('solo descuenta hasta volumeMax decimos, el resto paga precio completo', () => {
    const result = calcFixedTotal(12, 3, 1, config)
    expect(result.totalDecimos).toBe(12)
    expect(result.total).toBeCloseTo(33)
  })

  it('calcula el bundle "entero" con la misma formula (precio base mas bajo, decimosPerUnit = enteroDecimos)', () => {
    const enteroUnitPrice = 3 - config.enteroDiscount
    const oneEntero = calcFixedTotal(1, enteroUnitPrice, config.enteroDecimos, config)
    expect(oneEntero.totalDecimos).toBe(10)
    expect(oneEntero.total).toBeCloseTo(25)

    const twoEnteros = calcFixedTotal(2, enteroUnitPrice, config.enteroDecimos, config)
    expect(twoEnteros.totalDecimos).toBe(20)
    expect(twoEnteros.total).toBeCloseTo(53)
  })
})

describe('createTicketPickerState — flujo de rango', () => {
  it('arranca en modo manual con numPlays en defaultPlays', () => {
    const state = setupRange()
    expect(state.mode.value).toBe('manual')
    expect(state.numPlays.value).toBe(2)
  })

  it('canAddLine solo es true cuando se completan main y bonus', () => {
    const state = setupRange()
    expect(state.canAddLine.value).toBe(false)
    state.mainPicks.value = [1, 2, 3, 4, 5]
    expect(state.canAddLine.value).toBe(false)
    state.bonusPicks.value = [10]
    expect(state.canAddLine.value).toBe(true)
  })

  it('addLine agrega la linea ordenada y resetea los picks actuales', () => {
    const state = setupRange()
    state.mainPicks.value = [5, 1, 3, 4, 2]
    state.bonusPicks.value = [10]
    state.addLine()
    expect(state.lines.value).toHaveLength(1)
    expect(state.lines.value[0]!.main).toEqual([1, 2, 3, 4, 5])
    expect(state.mainPicks.value).toEqual([])
    expect(state.bonusPicks.value).toEqual([])
  })

  it('addLine no hace nada si no esta completo', () => {
    const state = setupRange()
    state.mainPicks.value = [1, 2]
    state.addLine()
    expect(state.lines.value).toHaveLength(0)
  })

  it('removeLine saca la linea por id', () => {
    const state = setupRange()
    state.mainPicks.value = [1, 2, 3, 4, 5]
    state.bonusPicks.value = [10]
    state.addLine()
    const id = state.lines.value[0]!.id
    state.removeLine(id)
    expect(state.lines.value).toHaveLength(0)
  })

  it('generateRandomLines agrega N lineas validas (numeros en rango, sin duplicados dentro de cada zona)', () => {
    const state = setupRange()
    state.generateRandomLines(4)
    expect(state.lines.value).toHaveLength(4)
    for (const line of state.lines.value) {
      expect(line.main).toHaveLength(5)
      expect(new Set(line.main).size).toBe(5)
      expect(line.main.every((n) => n >= 1 && n <= 69)).toBe(true)
      expect(line.bonus).toHaveLength(1)
      expect(line.bonus[0]! >= 1 && line.bonus[0]! <= 26).toBe(true)
    }
  })

  it('el total de lineas respeta el multiplicador y descuento de sorteos', () => {
    const state = setupRange()
    state.generateRandomLines(2) // 2 lineas * $3 = $6 base

    state.setDrawDurationIndex(0) // 1 sorteo, 0% desc
    expect(state.linesSubtotal.value).toBe(6)
    expect(state.linesTotal.value).toBe(6)

    state.setDrawDurationIndex(2) // 10 sorteos, 10% desc
    expect(state.linesSubtotal.value).toBe(60)
    expect(state.linesTotal.value).toBeCloseTo(54)
  })

  it('numero magico: agrega apuestas, permite actualizar el monto y remover', () => {
    const state = setupRange()
    state.magicPicks.value = [7, 21]
    state.addMagicBets()
    expect(state.magicBets.value).toHaveLength(2)
    expect(state.magicBets.value.every((b) => b.stake === 1)).toBe(true) // betMin

    const betId = state.magicBets.value[0]!.id
    state.updateMagicStake(betId, 10)
    expect(state.magicBets.value[0]!.stake).toBe(10)
    expect(state.magicTotal.value).toBe(11) // 10 + 1

    state.removeMagicBet(betId)
    expect(state.magicBets.value).toHaveLength(1)
  })

  it('no duplica una apuesta de numero magico ya agregada', () => {
    const state = setupRange()
    state.magicPicks.value = [7]
    state.addMagicBets()
    state.magicPicks.value = [7]
    state.addMagicBets()
    expect(state.magicBets.value).toHaveLength(1)
  })

  it('grandTotal suma lineas + numero magico', () => {
    const state = setupRange()
    state.generateRandomLines(1) // $3
    state.magicPicks.value = [5]
    state.addMagicBets() // stake 1
    expect(state.grandTotal.value).toBe(4)
  })

  it('canSubmit requiere al menos una linea o una apuesta magica', () => {
    const state = setupRange()
    expect(state.canSubmit.value).toBe(false)
    state.generateRandomLines(1)
    expect(state.canSubmit.value).toBe(true)
  })

  it('buildTicket arma un payload de tipo range con el desglose correcto', () => {
    const state = setupRange()
    state.generateRandomLines(2)
    state.setDrawDurationIndex(1) // 5 sorteos, 5%
    const ticket = state.buildTicket()
    expect(ticket.payload.kind).toBe('range')
    expect(ticket.gameId).toBe('powerball')
    if (ticket.payload.kind === 'range') {
      expect(ticket.payload.lines).toHaveLength(2)
      expect(ticket.payload.drawDuration).toBe(5)
      expect(ticket.payload.linesSubtotal).toBe(30) // 2*3*5
      expect(ticket.payload.linesTotal).toBeCloseTo(28.5)
    }
    expect(ticket.total).toBeCloseTo(28.5)
  })

  it('reset limpia todo el estado y vuelve a defaultPlays', () => {
    const state = setupRange()
    state.generateRandomLines(3)
    state.magicPicks.value = [1]
    state.addMagicBets()
    state.setDrawDurationIndex(3)
    state.reset()
    expect(state.lines.value).toEqual([])
    expect(state.magicBets.value).toEqual([])
    expect(state.drawDurationIndex.value).toBe(0)
    expect(state.numPlays.value).toBe(2)
  })
})

describe('createTicketPickerState — flujo de decimos', () => {
  it('arranca con la opcion "different" seleccionada y cantidad 1', () => {
    const state = setupFixed()
    expect(state.selectedFixedOption.value).toBe('different')
    expect(state.fixedQuantities.value.different).toBe(1)
  })

  it('setFixedQuantity y setFixedOption actualizan el total correspondiente', () => {
    const state = setupFixed()
    state.setFixedQuantity('different', 5)
    state.setFixedOption('different')
    expect(state.grandTotal.value).toBeCloseTo(13.5)
  })

  it('cambiar de opcion no afecta la cantidad guardada de las otras', () => {
    const state = setupFixed()
    state.setFixedQuantity('different', 5)
    state.setFixedQuantity('entero', 2)
    state.setFixedOption('entero')
    expect(state.grandTotal.value).toBeCloseTo(53)
    state.setFixedOption('different')
    expect(state.grandTotal.value).toBeCloseTo(13.5)
  })

  it('canSubmit es true apenas hay cantidad > 0 en la opcion seleccionada', () => {
    const state = setupFixed()
    expect(state.canSubmit.value).toBe(true) // cantidad default es 1
  })

  it('buildTicket arma un payload de tipo fixed', () => {
    const state = setupFixed()
    state.setFixedQuantity('same', 5)
    state.setFixedOption('same')
    const ticket = state.buildTicket()
    expect(ticket.payload.kind).toBe('fixed')
    expect(ticket.currency).toBe('€')
    if (ticket.payload.kind === 'fixed') {
      expect(ticket.payload.option).toBe('same')
      expect(ticket.payload.quantity).toBe(5)
      expect(ticket.payload.total).toBeCloseTo(13.5)
    }
  })

  it('reset vuelve todas las cantidades a 1 y la opcion a "different"', () => {
    const state = setupFixed()
    state.setFixedQuantity('entero', 4)
    state.setFixedOption('entero')
    state.reset()
    expect(state.selectedFixedOption.value).toBe('different')
    expect(state.fixedQuantities.value).toEqual({ different: 1, same: 1, entero: 1 })
  })
})

describe('createTicketPickerState — reactivo a cambios de juego', () => {
  it('recalcula rangeConfig/fixedConfig cuando cambia el juego provisto', () => {
    const gameRef = ref<JackpotGame>(rangeGame)
    const state = createTicketPickerState(gameRef, computed(() => DEFAULT_DRAW_DURATION_OPTIONS))
    expect(state.rangeConfig.value).not.toBeNull()
    expect(state.fixedConfig.value).toBeNull()

    gameRef.value = fixedGame
    expect(state.rangeConfig.value).toBeNull()
    expect(state.fixedConfig.value).not.toBeNull()
  })
})
