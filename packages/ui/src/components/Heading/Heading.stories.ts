import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Heading from './Heading.vue'

const SIZES = ['main-title', 'title', 'md', 'sm', 'xsm', 'xxsm', 'subtitle', 'subtitle-sm', 'subtitle-xsm'] as const

const meta = {
  title: 'Components/Heading',
  component: Heading,
  tags: ['autodocs', 'display'],
  argTypes: {
    level: { control: 'select', options: [1, 2, 3, 4, 5, 6] },
    size: { control: 'select', options: SIZES },
    align: { control: 'select', options: ['left', 'center', 'right'] },
  },
  args: { level: 1 },
} satisfies Meta<typeof Heading>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { Heading },
    setup: () => ({ args }),
    template: `<Heading v-bind="args">Responsible Gaming Statement</Heading>`,
  }),
}

export const EscalaCompleta: Story = {
  name: 'Escala completa de tamaños',
  render: () => ({
    components: { Heading },
    setup: () => ({ sizes: SIZES }),
    template: `
      <div>
        <Heading v-for="size in sizes" :key="size" :size="size" :level="2">
          {{ size }} — Key Principles
        </Heading>
      </div>`,
  }),
}

export const NivelIndependienteDelTamano: Story = {
  name: 'Nivel semántico ≠ tamaño visual',
  render: () => ({
    components: { Heading },
    template: `
      <div>
        <Heading :level="2" size="title">h2 que se ve como "title"</Heading>
        <Heading :level="3" size="md">h3 que se ve como "md"</Heading>
        <Heading :level="1" size="xsm">h1 que se ve como "xsm"</Heading>
      </div>`,
  }),
}

export const ConIcono: Story = {
  name: 'Con icono',
  render: () => ({
    components: { Heading },
    template: `
      <Heading :level="2" size="md">
        <template #icon>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3Z"/></svg>
        </template>
        Juego responsable
      </Heading>`,
  }),
}

export const Centrado: Story = {
  args: { align: 'center', size: 'main-title' },
  render: (args) => ({
    components: { Heading },
    setup: () => ({ args }),
    template: `<Heading v-bind="args">Titulo centrado</Heading>`,
  }),
}
