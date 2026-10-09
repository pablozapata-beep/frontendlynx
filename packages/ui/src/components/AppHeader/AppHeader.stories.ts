import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import AppHeader from './AppHeader.vue'
import NavDrawer from '../NavDrawer/NavDrawer.vue'
import SubNav from '../SubNav/SubNav.vue'
import type { NavItem } from '../NavDrawer/types'

const Logo = `
  <span style="display:inline-flex; align-items:center; gap:6px; color:white; font-family: var(--font-family-heading); font-weight:800; font-size:22px;">
    <span style="width:28px; height:28px; border-radius:8px; background: var(--color-primary); display:inline-block;"></span>
    MARCA
  </span>`

const drawerItems: NavItem[] = [
  { id: 'casino', label: 'Casino', href: '#casino' },
  { id: 'sports', label: 'Deportes', children: [{ id: 'fut', label: 'Fútbol', href: '#fut' }, { id: 'ten', label: 'Tenis', href: '#ten' }] },
  { id: 'lottery', label: 'Lotería', href: '#lottery', badge: 'New' },
  { id: 'promos', label: 'Promociones', href: '#promos' },
]

const subnavItems = [
  { id: 'casino', label: 'Casino' },
  { id: 'live', label: 'Casino en Vivo' },
  { id: 'categories', label: 'Categorías', hasMenu: true },
]

const meta = {
  title: 'Components/AppHeader',
  component: AppHeader,
  tags: ['autodocs', 'display'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    loggedIn: { control: 'boolean' },
    sticky: { control: 'boolean' },
    balance: { control: 'number' },
  },
  args: { loggedIn: false, sticky: false, balance: 1250, logoHref: '#inicio' },
} satisfies Meta<typeof AppHeader>

export default meta
type Story = StoryObj<typeof meta>

export const SinSesion: Story = {
  name: 'Sin sesión',
  render: (args) => ({
    components: { AppHeader },
    setup: () => ({ args }),
    template: `
      <AppHeader v-bind="args">
        <template #logo>${Logo}</template>
      </AppHeader>`,
  }),
}

export const ConSesion: Story = {
  name: 'Con sesión (saldo + usuario)',
  args: { loggedIn: true },
  render: (args) => ({
    components: { AppHeader },
    setup: () => ({ args }),
    template: `
      <AppHeader v-bind="args">
        <template #logo>${Logo}</template>
      </AppHeader>`,
  }),
}

export const SaldoBajo: Story = {
  name: 'Con sesión y saldo bajo',
  args: { loggedIn: true, balance: 80 },
  render: (args) => ({
    components: { AppHeader },
    setup: () => ({ args }),
    template: `
      <AppHeader v-bind="args">
        <template #logo>${Logo}</template>
      </AppHeader>`,
  }),
}

export const Completo: Story = {
  name: 'Completo (menú, subnav y sesión interactivos)',
  render: (args) => ({
    components: { AppHeader, NavDrawer, SubNav },
    setup: () => {
      const menuOpen = ref(false)
      const loggedIn = ref(false)
      const balance = ref(1250)
      const section = ref('casino')
      const log = ref('—')
      return {
        args,
        menuOpen,
        loggedIn,
        balance,
        section,
        log,
        drawerItems,
        subnavItems,
        say: (text: string) => (log.value = text),
      }
    },
    template: `
      <div style="min-height: 28rem; background: var(--color-background);">
        <AppHeader
          v-bind="args"
          :logged-in="loggedIn"
          :balance="balance"
          :menu-open="menuOpen"
          @menu="menuOpen = true"
          @login="loggedIn = true; say('login')"
          @signup="loggedIn = true; say('signup')"
          @add-balance="balance += 500; say('addBalance +500')"
          @account="loggedIn = false; say('account → (cierro sesión)')"
        >
          <template #logo>${Logo}</template>
          <template #subnav><SubNav v-model="section" :items="subnavItems" /></template>
        </AppHeader>
        <NavDrawer :open="menuOpen" :items="drawerItems" @close="menuOpen = false" />
        <p style="padding: 1rem; font-family: var(--font-family-body); font-size: 13px; color: var(--color-text);">
          Último evento: <strong>{{ log }}</strong> · Sección: <strong>{{ section }}</strong>
        </p>
      </div>`,
  }),
}

export const SlotsPersonalizados: Story = {
  name: 'Slots personalizados (guest, actions, account-icon)',
  render: (args) => ({
    components: { AppHeader },
    setup: () => ({ args }),
    template: `
      <div style="display:flex; flex-direction:column; gap:1rem;">
        <AppHeader v-bind="args">
          <template #logo>${Logo}</template>
          <template #actions><button style="height:2.5rem; padding:0 .75rem; border-radius:6px; border:0;">ES</button></template>
          <template #guest><a href="#" style="color:white; font-family: var(--font-family-body);">Acceder con mi cuenta</a></template>
        </AppHeader>
        <AppHeader v-bind="args" logged-in>
          <template #logo>${Logo}</template>
          <template #account-icon><span style="font-weight:800; font-family: var(--font-family-body);">AP</span></template>
        </AppHeader>
      </div>`,
  }),
}

export const Sticky: Story = {
  name: 'Sticky (scrollea para verlo)',
  args: { sticky: true, loggedIn: true },
  render: (args) => ({
    components: { AppHeader },
    setup: () => ({ args }),
    template: `
      <div style="height: 40rem; overflow-y: auto; background: var(--color-background);">
        <AppHeader v-bind="args"><template #logo>${Logo}</template></AppHeader>
        <div style="height: 80rem; padding: 1rem; font-family: var(--font-family-body); color: var(--color-text);">Contenido largo…</div>
      </div>`,
  }),
}
