import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import GamePlayerToolbar from './GamePlayerToolbar.vue'

const meta = {
  title: 'Components/GamePlayerToolbar',
  component: GamePlayerToolbar,
  tags: ['autodocs', 'display'],
  args: {
    mode: 'demo',
    favorite: false,
    favoriteCount: 838,
    fullscreen: false,
    floating: false,
    balance: 1250,
  },
} satisfies Meta<typeof GamePlayerToolbar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { GamePlayerToolbar },
    setup: () => {
      const mode = ref(args.mode)
      const favorite = ref(args.favorite)
      const fullscreen = ref(args.fullscreen)
      const floating = ref(args.floating)
      const balance = ref(args.balance ?? 0)
      const addBalance = () => {
        balance.value += 500
      }
      return { args, mode, favorite, fullscreen, floating, balance, addBalance }
    },
    template: `
      <div style="max-width: 48rem; background: var(--color-background);">
        <GamePlayerToolbar
          v-bind="args"
          v-model:mode="mode"
          v-model:favorite="favorite"
          v-model:fullscreen="fullscreen"
          v-model:floating="floating"
          :balance="balance"
          @add-balance="addBalance"
        />
      </div>
    `,
  }),
}

export const ConSaldo: Story = {
  name: 'Con saldo (cambia a rojo con saldo bajo)',
  args: { balance: 1250 },
  render: (args) => ({
    components: { GamePlayerToolbar },
    setup: () => {
      const mode = ref(args.mode)
      const balance = ref(args.balance ?? 0)
      const addBalance = () => {
        balance.value += 500
      }
      return { args, mode, balance, addBalance }
    },
    template: `
      <div style="max-width: 48rem; background: var(--color-background);">
        <GamePlayerToolbar v-bind="args" v-model:mode="mode" :balance="balance" @add-balance="addBalance" />
        <div style="padding: 1rem; display: flex; gap: 1rem; align-items: center; font-family: sans-serif;">
          <label>Saldo: {{ balance }}
            <input type="range" min="0" max="2000" step="10" v-model.number="balance" />
          </label>
        </div>
      </div>
    `,
  }),
}

export const SaldoBajo: Story = {
  name: 'Saldo bajo',
  args: { balance: 120 },
}

export const SinSaldo: Story = {
  name: 'Sin saldo',
  args: { balance: 0 },
}

export const FavoritoYPantallaCompletaActivos: Story = {
  name: 'Favorito y pantalla completa activos',
  args: { favorite: true, fullscreen: true },
}
