import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
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
  ],
}

const meta = {
  title: 'Components/LotteryTeamPickerModal',
  component: LotteryTeamPickerModal,
  tags: ['autodocs', 'overlay'],
  args: {
    open: false,
    group: powercombo,
    optionIndex: 0,
  },
  parameters: {
    docs: { story: { inline: false, iframeHeight: 500 } },
  },
} satisfies Meta<typeof LotteryTeamPickerModal>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { LotteryTeamPickerModal },
    setup: () => ({ args, open: ref(true) }),
    template: `<LotteryTeamPickerModal v-bind="args" :open="open" @close="open = false" />`,
  }),
}

export const PocasDisponibles: Story = {
  name: 'Con pocas participaciones disponibles',
  args: {
    group: {
      ...powercombo,
      total: 150,
      options: [{ ...powercombo.options[0], sold: 147 }],
    },
  },
  render: (args) => ({
    components: { LotteryTeamPickerModal },
    setup: () => ({ args, open: ref(true) }),
    template: `<LotteryTeamPickerModal v-bind="args" :open="open" @close="open = false" />`,
  }),
}
