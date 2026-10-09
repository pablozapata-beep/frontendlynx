import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import SubNav from './SubNav.vue'

const items = [
  { id: 'casino', label: 'Casino' },
  { id: 'live', label: 'Casino en Vivo' },
  { id: 'categories', label: 'Categorías', hasMenu: true },
  { id: 'sports', label: 'Deportes' },
  { id: 'lottery', label: 'Lotería' },
  { id: 'promos', label: 'Promociones', disabled: true },
]

const meta = {
  title: 'Components/SubNav',
  component: SubNav,
  tags: ['autodocs', 'display'],
  args: { items },
} satisfies Meta<typeof SubNav>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { SubNav },
    setup: () => ({ args, active: ref('casino') }),
    template: `
      <div style="background: var(--color-surface-dark); color: var(--color-surface-dark-text-secondary); padding: 1rem; max-width: 34rem;">
        <SubNav v-bind="args" v-model="active" />
      </div>`,
  }),
}

export const SobreFondoClaro: Story = {
  name: 'Sobre fondo claro (hereda el color)',
  render: (args) => ({
    components: { SubNav },
    setup: () => ({ args, active: ref('live') }),
    template: `
      <div style="background: var(--color-background); color: var(--color-text); padding: 1rem; max-width: 34rem;">
        <SubNav v-bind="args" v-model="active" />
      </div>`,
  }),
}

export const ConMenuAbierto: Story = {
  name: 'Pill con menú (expanded)',
  render: (args) => ({
    components: { SubNav },
    setup: () => {
      const active = ref('casino')
      const menuOpen = ref(true)
      const withState = () => items.map((i) => (i.hasMenu ? { ...i, expanded: menuOpen.value } : i))
      const onSelect = (item: { hasMenu?: boolean }) => {
        if (item.hasMenu) menuOpen.value = !menuOpen.value
      }
      return { args, active, withState, onSelect }
    },
    template: `
      <div style="background: var(--color-surface-dark); color: var(--color-surface-dark-text-secondary); padding: 1rem; max-width: 34rem;">
        <SubNav v-bind="args" :items="withState()" v-model="active" @select="onSelect" />
      </div>`,
  }),
}

export const ScrollEnMobile: Story = {
  name: 'Scroll horizontal en pantallas angostas',
  render: (args) => ({
    components: { SubNav },
    setup: () => ({ args, active: ref('casino') }),
    template: `
      <div style="background: var(--color-surface-dark); color: var(--color-surface-dark-text-secondary); padding: 1rem; width: 20rem;">
        <SubNav v-bind="args" v-model="active" />
      </div>`,
  }),
}
