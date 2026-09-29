export interface LotteryBall {
  id: string
  label: string
  background: string
  color?: string
  /** URL del logo real de la loteria (ej. CloudFront, distinta por marca). Si falla o no se pasa, se usa label+background. */
  logoUrl?: string
}

export interface MagicNumberConfig {
  min: number
  max: number
  betMin: number
  betMax: number
  payout: number
  label?: string
}

export interface RangeGameConfig {
  kind: 'range'
  mainCount: number
  mainMin: number
  mainMax: number
  bonusCount: number
  bonusMin: number
  bonusMax: number
  bonusLabel?: string
  defaultPlays: number
  magicNumber?: MagicNumberConfig
}

export interface FixedGameConfig {
  kind: 'fixed'
  digits: number
  /** Monto que se descuenta por decimo una vez alcanzado volumeThreshold. */
  volumeDiscount: number
  /** Cantidad minima de decimos totales para que aplique el descuento por volumen. */
  volumeThreshold: number
  /** Tope de decimos que reciben el descuento; el resto paga precio completo. */
  volumeMax: number
  enteroDecimos: number
  enteroDiscount: number
}

export interface JackpotGame {
  id: string
  name: string
  region: string
  balls: LotteryBall[]
  jackpotAmount: number
  hot?: boolean
  price: number
  oldPrice?: number
  discountLabel?: string
  drawLabel: string
  closesAt: Date | number | string
  currency?: string
  config: RangeGameConfig | FixedGameConfig
  /** URL de la pagina de detalle de la loteria. Si no se pasa, el nombre/logo y el link de "mas informacion" no se muestran como clickables. */
  detailUrl?: string
}
