import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { defineComponent, h, markRaw, ref } from 'vue'
import NavDrawer from './NavDrawer.vue'
import Button from '../Button/Button.vue'
import type { NavItem } from './types'

const svg = (path: string) =>
  markRaw(
    defineComponent({
      render: () =>
        h(
          'svg',
          { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
          [h('path', { d: path })],
        ),
    }),
  )

const ICONS = {
  casino: svg('M4 7h16v10H4zM8 12h.01M12 12h.01M16 12h.01'),
  sports: svg('M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18ZM12 3v18M3 12h18'),
  lottery: svg('M12 3l2.9 6.1 6.6.7-4.9 4.6 1.3 6.6L12 17.5 6.1 21l1.3-6.6L2.5 9.8l6.6-.7L12 3Z'),
  promo: svg('M20 12v8H4v-8M2 7h20v5H2zM12 22V7M12 7S9 7 8 5s1-3 3-2 1 4 1 4Zm0 0s3 0 4-2-1-3-3-2-1 4-1 4Z'),
  vip: svg('M3 7l4 4 5-7 5 7 4-4-2 12H5L3 7Z'),
  user: svg('M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21c0-4.4 3.6-7 8-7s8 2.6 8 7'),
}

const items: NavItem[] = [
  { id: 'casino', label: 'Casino', icon: ICONS.casino, expanded: true, children: [
    { id: 'slots', label: 'Tragamonedas', href: '#slots' },
    { id: 'live', label: 'Casino en vivo', href: '#live' },
    { id: 'originals', label: 'Originales', badge: 'New' },
  ] },
  { id: 'sports', label: 'Deportes', icon: ICONS.sports, children: [
    { id: 'football', label: 'Fútbol', href: '#football' },
    { id: 'tennis', label: 'Tenis', href: '#tennis' },
  ] },
  { id: 'lottery', label: 'Lotería', icon: ICONS.lottery, href: '#lottery' },
  { id: 'd1', label: '', type: 'divider' },
  { id: 'h1', label: 'Mi cuenta', type: 'heading' },
  { id: 'promos', label: 'Promociones', icon: ICONS.promo, href: '#promos', badge: 'Hot' },
  { id: 'vip', label: 'VIP Club', icon: ICONS.vip, href: '#vip' },
  { id: 'soon', label: 'Próximamente', icon: ICONS.user, disabled: true },
]

const meta = {
  title: 'Components/NavDrawer',
  component: NavDrawer,
  tags: ['autodocs', 'display'],
  parameters: { layout: 'centered', docs: { story: { inline: false, iframeHeight: 520 } } },
  argTypes: { side: { control: 'select', options: ['left', 'right'] } },
  args: { items, open: false },
} satisfies Meta<typeof NavDrawer>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { NavDrawer, Button },
    setup: () => {
      const open = ref(false)
      const active = ref('lottery')
      const lastSelected = ref('—')
      const onSelect = (item: NavItem, event: MouseEvent) => {
        event.preventDefault()
        active.value = item.id
        lastSelected.value = item.label
      }
      return { args, open, active, lastSelected, onSelect }
    },
    template: `
      <div style="font-family: var(--font-family-body); display:flex; flex-direction:column; gap:1rem; align-items:flex-start;">
        <Button variant="primary" @click="open = true">Abrir menú</Button>
        <span style="font-size:13px;">Último ítem elegido: <strong>{{ lastSelected }}</strong></span>
        <NavDrawer v-bind="args" :open="open" :active-id="active" @close="open = false" @select="onSelect" />
      </div>`,
  }),
}

export const ConHeaderYFooter: Story = {
  name: 'Con header y footer (slots)',
  render: (args) => ({
    components: { NavDrawer, Button },
    setup: () => ({ args, open: ref(false) }),
    template: `
      <div>
        <Button variant="primary" @click="open = true">Abrir menú</Button>
        <NavDrawer v-bind="args" :open="open" @close="open = false">
          <template #header><strong style="font-size:20px; color:white;">Mi marca</strong></template>
          <template #footer>
            <p style="margin:0; font-size:12px; opacity:.7;">Soporte 24/7 · ES</p>
          </template>
        </NavDrawer>
      </div>`,
  }),
}

export const LadoDerecho: Story = {
  name: 'Desde la derecha',
  args: { side: 'right' },
  render: (args) => ({
    components: { NavDrawer, Button },
    setup: () => ({ args, open: ref(false) }),
    template: `
      <div>
        <Button variant="primary" @click="open = true">Abrir menú</Button>
        <NavDrawer v-bind="args" :open="open" @close="open = false" />
      </div>`,
  }),
}

export const SinCerrarAlElegir: Story = {
  name: 'closeOnSelect = false',
  render: (args) => ({
    components: { NavDrawer, Button },
    setup: () => ({ args, open: ref(false) }),
    template: `
      <div>
        <Button variant="primary" @click="open = true">Abrir menú</Button>
        <NavDrawer v-bind="args" :open="open" :close-on-select="false" @close="open = false" />
      </div>`,
  }),
}
