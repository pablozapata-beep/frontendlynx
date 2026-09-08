export type PickerMode = 'manual' | 'surprise' | 'auto'
export type FixedFlowOptionId = 'different' | 'same' | 'entero'

export interface TicketLine {
  id: string
  main: number[]
  bonus: number[]
}

export interface MagicBet {
  id: string
  number: number
  stake: number
}

export interface DrawDurationOption {
  draws: number
  /** Fraccion, ej. 0.05 = 5% de descuento. */
  discount: number
  label?: string
}

export const DEFAULT_DRAW_DURATION_OPTIONS: DrawDurationOption[] = [
  { draws: 1, discount: 0 },
  { draws: 5, discount: 0.05 },
  { draws: 10, discount: 0.1 },
  { draws: 20, discount: 0.18 },
]

export interface RangeTicketPayload {
  kind: 'range'
  lines: Array<{ main: number[]; bonus: number[] }>
  drawDuration: number
  drawDiscount: number
  magicBets: Array<{ number: number; stake: number }>
  linesSubtotal: number
  linesTotal: number
  magicTotal: number
}

export interface FixedTicketPayload {
  kind: 'fixed'
  option: FixedFlowOptionId
  quantity: number
  unitPrice: number
  total: number
}

export interface Ticket {
  gameId: string
  gameName: string
  currency: string
  payload: RangeTicketPayload | FixedTicketPayload
  total: number
}

export interface TicketPickerCopy {
  titlePrefix: string
  closeLabel: string
  numPlaysLabel: string
  manualModeLabel: string
  surpriseModeLabel: string
  autoModeLabel: string
  mainNumbersLabel: string
  bonusNumbersLabel: string
  clearLabel: string
  addLineLabel: string
  surpriseDescription: (numPlays: number) => string
  surpriseButtonLabel: string
  autoDescription: (numPlays: number) => string
  autoButtonLabel: string
  linesTitle: string
  emptyLinesLabel: string
  drawDurationLabel: string
  magicNumberToggleLabel: string
  addMagicLabel: string
  stakeLabel: string
  payoutPreviewLabel: string
  fixedDifferentTitle: string
  fixedDifferentDescription: string
  fixedSameTitle: string
  fixedSameDescription: string
  fixedEnteroTitle: string
  fixedEnteroDescription: string
  volumeDiscountNote: (params: { amount: string; threshold: number; max: number }) => string
  totalLabel: string
  submitLabel: string
}

export const DEFAULT_TICKET_PICKER_COPY: TicketPickerCopy = {
  titlePrefix: 'Jugar',
  closeLabel: 'Cerrar',
  numPlaysLabel: 'Cantidad de líneas',
  manualModeLabel: 'Manual',
  surpriseModeLabel: 'Sorpresa',
  autoModeLabel: 'Auto',
  mainNumbersLabel: 'Números principales',
  bonusNumbersLabel: 'Número extra',
  clearLabel: 'Limpiar',
  addLineLabel: '+ Agregar línea',
  surpriseDescription: (numPlays) =>
    `Elegimos ${numPlays} combinaciones al azar y las agregamos directo a tu boleto.`,
  surpriseButtonLabel: 'Agregar líneas sorpresa',
  autoDescription: (numPlays) => `Generamos ${numPlays} líneas al azar de una sola vez.`,
  autoButtonLabel: 'Generar líneas',
  linesTitle: 'Líneas agregadas',
  emptyLinesLabel: 'Todavía no agregaste ninguna línea',
  drawDurationLabel: 'Sorteos a jugar',
  magicNumberToggleLabel: 'Número mágico',
  addMagicLabel: '+ Agregar',
  stakeLabel: 'Apuesta',
  payoutPreviewLabel: 'Podés ganar',
  fixedDifferentTitle: 'Opción 1',
  fixedDifferentDescription: 'Números diferentes',
  fixedSameTitle: 'Opción 2',
  fixedSameDescription: 'Mismo número',
  fixedEnteroTitle: 'Opción 3',
  fixedEnteroDescription: 'Entero',
  volumeDiscountNote: ({ amount, threshold, max }) =>
    `Ahorrás ${amount} por unidad cuando comprás ${threshold} o más (máx. ${max}).`,
  totalLabel: 'Total',
  submitLabel: 'Agregar al carrito',
}
