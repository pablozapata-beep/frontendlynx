import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import TicketPicker from './TicketPicker.vue'
import type { JackpotGame, RangeGameConfig } from '../JackpotCard/types'

const powerball: JackpotGame = {
  id: 'powerball',
  name: 'Powerball',
  region: 'Estados Unidos',
  balls: [{ id: 'pb', label: 'PB', background: '#E4002B' }],
  jackpotAmount: 350_000_000,
  hot: true,
  price: 3,
  drawLabel: 'Sábado 22:00',
  closesAt: new Date(Date.now() + 2 * 86_400_000),
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
}

const powerballWithMagicNumber: JackpotGame = {
  ...powerball,
  id: 'powerball-magic',
  config: {
    ...(powerball.config as RangeGameConfig),
    magicNumber: { min: 1, max: 69, betMin: 1, betMax: 100, payout: 7 },
  },
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
  closesAt: new Date(Date.now() + 2 * 86_400_000),
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

const meta = {
  title: 'Components/TicketPicker',
  component: TicketPicker,
  tags: ['autodocs', 'forms'],
  args: {
    game: powerball,
    open: true,
  },
  // TicketPicker usa Modal (Teleport a `body` + position:fixed cubriendo todo el
  // viewport). La pagina de Docs de Storybook monta todas las stories del archivo
  // juntas en el mismo documento, asi que sin esto los 4 modales abiertos quedarian
  // superpuestos unos sobre otros. `inline: false` hace que cada story de Docs se
  // renderice en su propio iframe (su propio `body`), aislado del resto.
  parameters: {
    docs: { story: { inline: false, iframeHeight: 700 } },
  },
} satisfies Meta<typeof TicketPicker>

export default meta
type Story = StoryObj<typeof meta>

export const RangeFlowManual: Story = {
  render: (args) => ({
    components: { TicketPicker },
    setup: () => ({ args, open: ref(true) }),
    template: `<TicketPicker v-bind="args" :open="open" @close="open = false" @submit="() => {}" />`,
  }),
}

export const RangeFlowWithMagicNumber: Story = {
  args: { game: powerballWithMagicNumber },
  render: (args) => ({
    components: { TicketPicker },
    setup: () => ({ args, open: ref(true) }),
    template: `<TicketPicker v-bind="args" :open="open" @close="open = false" @submit="() => {}" />`,
  }),
}

export const FixedFlowDecimos: Story = {
  args: { game: loteriaNacional },
  render: (args) => ({
    components: { TicketPicker },
    setup: () => ({ args, open: ref(true) }),
    template: `<TicketPicker v-bind="args" :open="open" @close="open = false" @submit="() => {}" />`,
  }),
}

export const MinimalCopyOverrides: Story = {
  args: {
    game: powerball,
    copy: { titlePrefix: 'Play', submitLabel: 'Add to cart' },
  },
  render: (args) => ({
    components: { TicketPicker },
    setup: () => ({ args, open: ref(true) }),
    template: `<TicketPicker v-bind="args" :open="open" @close="open = false" @submit="() => {}" />`,
  }),
}
