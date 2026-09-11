import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import LotteryTeamCard from './LotteryTeamCard.vue'
import LotteryTeamPickerModal from './LotteryTeamPickerModal.vue'
import type { LotteryGroup } from './types'

const nextDraw = new Date(Date.now() + 5 * 86_400_000 + 3 * 3_600_000)

const powercombo: LotteryGroup = {
  id: 'powercombo',
  name: 'Powercombo',
  total: 150,
  balls: [
    { id: 'pb', label: 'PB', background: '#E4002B' },
    { id: 'se', label: 'SE', background: '#3FCB88' },
    { id: 'mm', label: 'MM', background: '#3E7BE8' },
  ],
  jackpotAmount: 786_000_000,
  currency: 'us$',
  ticketsLabel: '20 Powerball · 20 Mega Millions · 10 SuperEnalotto por sorteo',
  partialPath: 'powercombo',
  options: [
    {
      id: '1m',
      label: '1 mes',
      sorteosLabel: '36 sorteos',
      price: 40,
      min: 100,
      sold: 46,
      nextDrawDate: nextDraw,
      nextDrawLabel: '12 de julio',
    },
    {
      id: '3m',
      label: '3 meses',
      sorteosLabel: '108 sorteos',
      price: 110,
      min: 100,
      sold: 46,
      nextDrawDate: nextDraw,
      nextDrawLabel: '12 de julio',
    },
    {
      id: '6m',
      label: '6 meses',
      sorteosLabel: '216 sorteos',
      price: 200,
      min: 100,
      sold: 46,
      nextDrawDate: nextDraw,
      nextDrawLabel: '12 de julio',
    },
  ],
}

const meta = {
  title: 'Components/LotteryTeamCard',
  component: LotteryTeamCard,
  tags: ['autodocs', 'display'],
  args: {
    group: powercombo,
  },
} satisfies Meta<typeof LotteryTeamCard>

export default meta
type Story = StoryObj<typeof meta>

export const Waiting: Story = {
  render: (args) => ({
    components: { LotteryTeamCard },
    setup: () => ({ args }),
    template: `<div style="max-width: 22rem;"><LotteryTeamCard v-bind="args" /></div>`,
  }),
}

export const Locked: Story = {
  args: {
    group: { ...powercombo, options: powercombo.options.map((o) => ({ ...o, sold: 120 })) },
  },
  render: (args) => ({
    components: { LotteryTeamCard },
    setup: () => ({ args }),
    template: `<div style="max-width: 22rem;"><LotteryTeamCard v-bind="args" /></div>`,
  }),
}

export const ClosingSoon: Story = {
  args: { isClosingSoon: true },
  render: (args) => ({
    components: { LotteryTeamCard },
    setup: () => ({ args }),
    template: `<div style="max-width: 22rem;"><LotteryTeamCard v-bind="args" /></div>`,
  }),
}

export const ConModalDeCompra: Story = {
  name: 'Con el modal de compra',
  parameters: {
    docs: { story: { inline: false, iframeHeight: 500 } },
  },
  render: (args) => ({
    components: { LotteryTeamCard, LotteryTeamPickerModal },
    setup: () => ({ args, open: ref(false), optionIndex: ref(0) }),
    methods: {
      onJoin(this: any, payload: { optionIndex: number }) {
        this.optionIndex = payload.optionIndex
        this.open = true
      },
    },
    template: `
      <div style="max-width: 22rem;">
        <LotteryTeamCard v-bind="args" @join="onJoin" />
        <LotteryTeamPickerModal
          :open="open"
          :group="args.group"
          :option-index="optionIndex"
          @close="open = false"
        />
      </div>
    `,
  }),
}
