import type { Meta, StoryObj } from '@storybook/vue3-vite'
import CasinoGameCard from './CasinoGameCard.vue'

const meta = {
  title: 'Components/CasinoGameCard',
  component: CasinoGameCard,
  tags: ['autodocs', 'display'],
  args: {
    image: 'https://static.trllnhelp.com/site/images_v4/casino-games/game-img/1182.webp',
    title: '4 Dragon Kings',
  },
} satisfies Meta<typeof CasinoGameCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { CasinoGameCard },
    setup: () => ({ args }),
    template: `<div style="width: 12rem;"><CasinoGameCard v-bind="args" /></div>`,
  }),
}

export const ConJackpot: Story = {
  name: 'Con jackpot',
  args: {
    image: 'https://static.trllnhelp.com/site/images_v4/casino-games/game-img/968.webp',
    title: '40 Dice Fire',
    jackpotAmount: 1098618.51,
  },
  render: (args) => ({
    components: { CasinoGameCard },
    setup: () => ({ args }),
    template: `<div style="width: 12rem;"><CasinoGameCard v-bind="args" /></div>`,
  }),
}

export const Grilla: Story = {
  name: 'Grilla de juegos',
  render: () => ({
    components: { CasinoGameCard },
    template: `
      <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(150px,1fr)); gap: 1.5rem; max-width: 50rem;">
        <CasinoGameCard image="https://static.trllnhelp.com/site/images_v4/casino-games/game-img/1182.webp" title="4 Dragon Kings" />
        <CasinoGameCard image="https://static.trllnhelp.com/site/images_v4/casino-games/game-img/968.webp" title="40 Dice Fire" :jackpot-amount="1098618.51" />
        <CasinoGameCard image="https://static.trllnhelp.com/site/images_v4/casino-games/game-img/4035.webp" title="Plinko" />
      </div>
    `,
  }),
}

export const VarianteBadge: Story = {
  name: 'Variante "badge" (Britanialynx Originales)',
  args: {
    variant: 'badge',
    image: 'https://picsum.photos/seed/crash/300/450',
    title: 'Crash',
    playersOnline: 2800,
  },
  render: (args) => ({
    components: { CasinoGameCard },
    setup: () => ({ args }),
    template: `<div style="width: 10rem;"><CasinoGameCard v-bind="args" /></div>`,
  }),
}

export const GrillaBadge: Story = {
  name: 'Grilla estilo "Britanialynx Originales"',
  render: () => ({
    components: { CasinoGameCard },
    template: `
      <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(130px,1fr)); gap: 1rem; max-width: 60rem; padding: 1rem; background: #1a1a1a;">
        <CasinoGameCard variant="badge" image="https://picsum.photos/seed/crash/300/450" title="Crash" :players-online="2800" />
        <CasinoGameCard variant="badge" image="https://picsum.photos/seed/limbo/300/450" title="Limbo" :players-online="236" />
        <CasinoGameCard variant="badge" image="https://picsum.photos/seed/keno/300/450" title="Keno" :players-online="172" />
        <CasinoGameCard variant="badge" image="https://picsum.photos/seed/mayormenor/300/450" title="Mayor o Menor" :players-online="190" />
        <CasinoGameCard variant="badge" image="https://picsum.photos/seed/plinko/300/450" title="Plinko" :players-online="122" />
      </div>
    `,
  }),
}
