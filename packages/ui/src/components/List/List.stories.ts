import type { Meta, StoryObj } from '@storybook/vue3-vite'
import List from './List.vue'
import ListItem from './ListItem.vue'

const meta = {
  title: 'Components/List',
  component: List,
  tags: ['autodocs', 'display'],
  argTypes: {
    variant: { control: 'select', options: ['bullets', 'none', 'ordered'] },
    size: { control: 'select', options: ['md', 'sm', 'xsm'] },
    gap: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  args: {
    variant: 'bullets',
    size: 'md',
    gap: 'md',
    items: ['Protección de menores', 'Apoyo a personas vulnerables', 'Juego justo y transparente'],
  },
} satisfies Meta<typeof List>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { List },
    setup: () => ({ args }),
    template: `<List v-bind="args" />`,
  }),
}

export const SinVinetas: Story = {
  name: 'Sin viñetas',
  args: { variant: 'none' },
  render: (args) => ({
    components: { List },
    setup: () => ({ args }),
    template: `<List v-bind="args" />`,
  }),
}

export const Ordenada: Story = {
  args: { variant: 'ordered' },
  render: (args) => ({
    components: { List },
    setup: () => ({ args }),
    template: `<List v-bind="args" />`,
  }),
}

export const ContenidoRico: Story = {
  name: 'Contenido rico (negrita + texto)',
  render: () => ({
    components: { List, ListItem },
    template: `
      <List>
        <ListItem><strong>Protection of Minors</strong>: We strictly prohibit gambling by individuals under the age of 18. Robust age verification processes are in place to prevent underage gambling.</ListItem>
        <ListItem><strong>Support for Vulnerable Individuals</strong>: We provide resources and support for players who may be at risk of developing gambling-related problems.</ListItem>
        <ListItem><strong>Fair Play and Transparency</strong>: Our games are designed to be fair and transparent. See the <a href="#">full policy</a>.</ListItem>
      </List>`,
  }),
}

export const ConIconos: Story = {
  name: 'Sin viñetas, con iconos propios',
  render: () => ({
    components: { List, ListItem },
    template: `
      <List variant="none" size="sm">
        <ListItem v-for="text in ['Verificación de edad', 'Autoexclusión', 'Límites de depósito']" :key="text">
          <template #icon>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>
          </template>
          {{ text }}
        </ListItem>
      </List>`,
  }),
}

export const Tamanos: Story = {
  name: 'Tamaños y separación',
  render: () => ({
    components: { List },
    template: `
      <div style="display:flex; flex-direction:column; gap:1rem;">
        <List size="sm" gap="sm" :items="['sm / gap sm', 'segundo', 'tercero']" />
        <List size="md" gap="lg" :items="['md / gap lg', 'segundo', 'tercero']" />
      </div>`,
  }),
}
