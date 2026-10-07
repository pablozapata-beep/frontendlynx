import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Paragraph from './Paragraph.vue'

const meta = {
  title: 'Components/Paragraph',
  component: Paragraph,
  tags: ['autodocs', 'display'],
  argTypes: {
    size: { control: 'select', options: ['md', 'sm', 'xsm'] },
    align: { control: 'select', options: ['left', 'center', 'right'] },
  },
  args: { size: 'md' },
} satisfies Meta<typeof Paragraph>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { Paragraph },
    setup: () => ({ args }),
    template: `
      <Paragraph v-bind="args">
        Under the Curaçao National Ordinance on Games of Chance (LOK), we are committed to promoting
        responsible gaming practices to ensure a safe and enjoyable experience for all players.
      </Paragraph>`,
  }),
}

export const Tamanos: Story = {
  name: 'Tamaños',
  render: () => ({
    components: { Paragraph },
    template: `
      <div>
        <Paragraph size="md">md — Our responsible gaming policies protect minors and vulnerable individuals.</Paragraph>
        <Paragraph size="sm">sm — Our responsible gaming policies protect minors and vulnerable individuals.</Paragraph>
        <Paragraph size="xsm">xsm — Our responsible gaming policies protect minors and vulnerable individuals.</Paragraph>
      </div>`,
  }),
}

export const ConEnlaceYNegrita: Story = {
  name: 'Con enlace y negrita',
  render: () => ({
    components: { Paragraph },
    template: `
      <Paragraph>
        <strong>Protection of Minors</strong>: We strictly prohibit gambling by individuals under the age of 18.
        If you want to check our entire policy please <a href="#">click here</a>.
      </Paragraph>`,
  }),
}

export const Centrado: Story = {
  args: { align: 'center' },
  render: (args) => ({
    components: { Paragraph },
    setup: () => ({ args }),
    template: `<Paragraph v-bind="args">Texto centrado.</Paragraph>`,
  }),
}
