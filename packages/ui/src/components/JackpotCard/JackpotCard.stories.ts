import type { Meta, StoryObj } from '@storybook/vue3-vite'
import JackpotCard from './JackpotCard.vue'
import type { JackpotGame } from './types'

const powerball: JackpotGame = {
  id: 'powerball',
  name: 'Powerball',
  region: 'Estados Unidos',
  balls: [
    {
      id: 'pb',
      label: 'PB',
      background: '#E4002B',
      logoUrl: 'https://d3tmfelegj51yl.cloudfront.net/lotto-logos/wt/3.png',
    },
  ],
  jackpotAmount: 350_000_000,
  hot: true,
  price: 3,
  drawLabel: 'Sábado 22:00',
  closesAt: new Date(Date.now() + 2 * 86_400_000 + 5 * 3_600_000),
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
  },
  detailUrl: '/loterias/powerball',
}

const megaMillions: JackpotGame = {
  id: 'mega-millions',
  name: 'Mega Millions',
  region: 'Estados Unidos',
  balls: [{ id: 'mm', label: 'MM', background: '#3E7BE8' }],
  jackpotAmount: 89_000_000,
  price: 2.5,
  oldPrice: 3.13,
  discountLabel: '-20% hoy',
  drawLabel: 'Martes 23:00',
  closesAt: new Date(Date.now() + 1 * 86_400_000 + 2 * 3_600_000),
  config: {
    kind: 'range',
    mainCount: 5,
    mainMin: 1,
    mainMax: 70,
    bonusCount: 1,
    bonusMin: 1,
    bonusMax: 25,
    bonusLabel: 'Mega Ball',
    defaultPlays: 2,
  },
  detailUrl: '/loterias/mega-millions',
}

const loteriaNacional: JackpotGame = {
  id: 'loteria-nacional',
  name: 'Lotería Nacional',
  region: 'España · Sorteo semanal',
  balls: [{ id: 'ln', label: 'LN', background: '#8A6E2E' }],
  jackpotAmount: 300_000,
  price: 3,
  currency: '€',
  drawLabel: 'Jueves 21:15',
  closesAt: new Date(Date.now() + 2 * 86_400_000 + 9 * 3_600_000),
  config: {
    kind: 'fixed',
    digits: 5,
    volumeDiscount: 0.3,
    volumeThreshold: 3,
    volumeMax: 10,
    enteroDecimos: 10,
    enteroDiscount: 0.2,
  },
  detailUrl: '/loterias/loteria-nacional',
}

const meta = {
  title: 'Components/JackpotCard',
  component: JackpotCard,
  tags: ['autodocs', 'display'],
  args: {
    game: powerball,
  },
} satisfies Meta<typeof JackpotCard>

export default meta
type Story = StoryObj<typeof meta>

export const RangeGameDefault: Story = {
  render: (args) => ({
    components: { JackpotCard },
    setup: () => ({ args }),
    template: `<div style="max-width: 22rem;"><JackpotCard v-bind="args" /></div>`,
  }),
}

export const WithOldPriceAndDiscount: Story = {
  args: { game: megaMillions },
  render: (args) => ({
    components: { JackpotCard },
    setup: () => ({ args }),
    template: `<div style="max-width: 22rem;"><JackpotCard v-bind="args" /></div>`,
  }),
}

export const FixedGameDecimos: Story = {
  args: { game: loteriaNacional },
  render: (args) => ({
    components: { JackpotCard },
    setup: () => ({ args }),
    template: `<div style="max-width: 22rem;"><JackpotCard v-bind="args" /></div>`,
  }),
}

export const MinimalProps: Story = {
  args: {
    game: {
      id: 'minimal',
      name: 'Mi Lotería',
      region: 'Demo',
      balls: [{ id: 'ml', label: 'ML', background: '#7C3AED' }],
      jackpotAmount: 1_000_000,
      price: 1,
      drawLabel: 'Viernes 20:00',
      closesAt: new Date(Date.now() + 3 * 86_400_000),
      config: {
        kind: 'range',
        mainCount: 5,
        mainMin: 1,
        mainMax: 40,
        bonusCount: 1,
        bonusMin: 1,
        bonusMax: 10,
        defaultPlays: 1,
      },
      detailUrl: '/loterias/mi-loteria',
    },
  },
  render: (args) => ({
    components: { JackpotCard },
    setup: () => ({ args }),
    template: `<div style="max-width: 22rem;"><JackpotCard v-bind="args" /></div>`,
  }),
}

export const ExpiringSoon: Story = {
  args: { game: { ...powerball, closesAt: new Date(Date.now() + 65_000) } },
  render: (args) => ({
    components: { JackpotCard },
    setup: () => ({ args }),
    template: `<div style="max-width: 22rem;"><JackpotCard v-bind="args" /></div>`,
  }),
}
