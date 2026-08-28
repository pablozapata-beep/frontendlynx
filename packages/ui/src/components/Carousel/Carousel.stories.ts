import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Carousel from './Carousel.vue'
import CarouselSlide from './CarouselSlide.vue'

const SLIDE_STYLE =
  'height: 8rem; border-radius: var(--radius-md); background: var(--color-surface); ' +
  'border: 1px solid var(--color-border); display: flex; align-items: center; justify-content: center; ' +
  'font-family: var(--font-family-body); color: var(--color-text);'

const meta = {
  title: 'Components/Carousel',
  component: Carousel,
  tags: ['autodocs', 'media'],
  argTypes: {
    slidesPerView: { control: { type: 'number', min: 1, max: 4 } },
    gap: { control: 'text' },
    showArrows: { control: 'boolean' },
  },
  args: {
    slidesPerView: 1,
    gap: '1rem',
    showArrows: true,
  },
} satisfies Meta<typeof Carousel>

export default meta
type Story = StoryObj<typeof meta>

export const UnaPorVista: Story = {
  args: { slidesPerView: 1 },
  render: (args) => ({
    components: { Carousel, CarouselSlide },
    setup: () => ({ args }),
    template: `
      <Carousel v-bind="args">
        <CarouselSlide v-for="n in 5" :key="n">
          <div style="${SLIDE_STYLE}">Slide {{ n }}</div>
        </CarouselSlide>
      </Carousel>
    `,
  }),
}

export const TresPorVista: Story = {
  args: { slidesPerView: 3 },
  render: (args) => ({
    components: { Carousel, CarouselSlide },
    setup: () => ({ args }),
    template: `
      <Carousel v-bind="args">
        <CarouselSlide v-for="n in 6" :key="n">
          <div style="${SLIDE_STYLE}">Slide {{ n }}</div>
        </CarouselSlide>
      </Carousel>
    `,
  }),
}

export const SinFlechas: Story = {
  args: { slidesPerView: 2, showArrows: false },
  render: (args) => ({
    components: { Carousel, CarouselSlide },
    setup: () => ({ args }),
    template: `
      <Carousel v-bind="args">
        <CarouselSlide v-for="n in 4" :key="n">
          <div style="${SLIDE_STYLE}">Slide {{ n }}</div>
        </CarouselSlide>
      </Carousel>
    `,
  }),
}
