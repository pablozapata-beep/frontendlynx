import type { Meta, StoryObj } from '@storybook/vue3-vite'
import CarouselSection from './CarouselSection.vue'
import CarouselSlide from './CarouselSlide.vue'
import CasinoGameCard from '../CasinoGame/CasinoGameCard.vue'

const GAMES = [
  { title: 'Crash', image: 'https://static.trllnhelp.com/site/images_v4/casino-games/game-img/1182.webp' },
  { title: 'Limbo', image: 'https://static.trllnhelp.com/site/images_v4/casino-games/game-img/968.webp' },
  { title: 'Keno', image: 'https://static.trllnhelp.com/site/images_v4/casino-games/game-img/4035.webp' },
  { title: 'Mayor o Menor', image: 'https://static.trllnhelp.com/site/images_v4/casino-games/game-img/1182.webp' },
  { title: 'Leyenda de la Torre', image: 'https://static.trllnhelp.com/site/images_v4/casino-games/game-img/968.webp' },
  { title: 'Dados Clásico', image: 'https://static.trllnhelp.com/site/images_v4/casino-games/game-img/4035.webp' },
]

const meta = {
  title: 'Components/CarouselSection',
  component: CarouselSection,
  tags: ['autodocs', 'media'],
  argTypes: {
    slidesPerView: { control: { type: 'number', min: 1, max: 6 } },
    showViewAll: { control: 'boolean' },
  },
  args: {
    title: 'Britanialynx Originales',
    slidesPerView: 4,
    showViewAll: true,
  },
} satisfies Meta<typeof CarouselSection>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { CarouselSection, CarouselSlide, CasinoGameCard },
    setup: () => ({ args, games: GAMES }),
    template: `
      <div style="max-width: 60rem;">
        <CarouselSection v-bind="args">
          <CarouselSlide v-for="game in games" :key="game.title">
            <CasinoGameCard :image="game.image" :title="game.title" />
          </CarouselSlide>
        </CarouselSection>
      </div>
    `,
  }),
}

export const SinVerTodo: Story = {
  name: 'Sin "Ver todo"',
  args: { showViewAll: false },
  render: (args) => ({
    components: { CarouselSection, CarouselSlide, CasinoGameCard },
    setup: () => ({ args, games: GAMES }),
    template: `
      <div style="max-width: 60rem;">
        <CarouselSection v-bind="args">
          <CarouselSlide v-for="game in games" :key="game.title">
            <CasinoGameCard :image="game.image" :title="game.title" />
          </CarouselSlide>
        </CarouselSection>
      </div>
    `,
  }),
}

export const Mobile: Story = {
  name: 'Vista mobile (flechas ocultas, swipe + Ver todo)',
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  args: { slidesPerView: 2 },
  render: (args) => ({
    components: { CarouselSection, CarouselSlide, CasinoGameCard },
    setup: () => ({ args, games: GAMES }),
    template: `
      <CarouselSection v-bind="args">
        <CarouselSlide v-for="game in games" :key="game.title">
          <CasinoGameCard :image="game.image" :title="game.title" />
        </CarouselSlide>
      </CarouselSection>
    `,
  }),
}
