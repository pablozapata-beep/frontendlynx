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
  },
} satisfies Meta<typeof GamePlayerToolbar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { GamePlayerToolbar },
    setup: () => ({
      args,
      mode: ref(args.mode),
      favorite: ref(args.favorite),
      fullscreen: ref(args.fullscreen),
      floating: ref(args.floating),
    }),
    template: `
      <div style="max-width: 30rem; background: var(--color-background);">
        <GamePlayerToolbar
          v-bind="args"
          v-model:mode="mode"
          v-model:favorite="favorite"
          v-model:fullscreen="fullscreen"
          v-model:floating="floating"
        />
      </div>
    `,
  }),
}

export const FavoritoYPantallaCompletaActivos: Story = {
  name: 'Favorito y pantalla completa activos',
  args: { favorite: true, fullscreen: true },
}
