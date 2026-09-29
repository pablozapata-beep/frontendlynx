import type { LotteryBall } from '../JackpotCard/types'

export interface LotteryGroupOption {
  id: string
  /** Ej. "1 mes" */
  label: string
  /** Ej. "36 sorteos" */
  sorteosLabel: string
  price: number
  /** Participaciones minimas vendidas para que el grupo quede asegurado. */
  min: number
  sold: number
  nextDrawDate?: Date | number | string
  /** Ej. "12 de julio" — usado en el footer una vez que el grupo esta asegurado. */
  nextDrawLabel?: string
}

export interface LotteryGroup {
  id: string
  name: string
  /** Total de participaciones que tiene el grupo (denominador comun a todas las options). */
  total: number
  balls: LotteryBall[]
  jackpotAmount?: number
  currency?: string
  /** Ej. "20 Powerball · 20 Mega Millions · 10 SuperEnalotto por sorteo" */
  ticketsLabel: string
  /** URL de la pagina de detalle del grupo. Si no se pasa, el nombre/logo y el link de "mas informacion" no se muestran como clickables. */
  detailUrl?: string
  options: LotteryGroupOption[]
}
