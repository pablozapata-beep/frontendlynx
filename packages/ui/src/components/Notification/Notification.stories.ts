import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Notification from './Notification.vue'
import NotificationsContainer from './NotificationsContainer.vue'
import { useNotifications } from './useNotifications'

const meta = {
  title: 'Components/Notification',
  component: Notification,
  tags: ['autodocs', 'feedback'],
  argTypes: {
    variant: { control: 'select', options: ['success', 'danger', 'warning', 'info'] },
    title: { control: 'text' },
    dismissible: { control: 'boolean' },
  },
  args: {
    variant: 'info',
    title: 'Titulo',
    dismissible: true,
  },
} satisfies Meta<typeof Notification>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { Notification },
    setup: () => ({ args }),
    template: `<Notification v-bind="args">Este es el mensaje de la notificacion.</Notification>`,
  }),
}

export const Variantes: Story = {
  render: () => ({
    components: { Notification },
    template: `
      <div style="display: flex; flex-direction: column; gap: 0.75rem;">
        <Notification variant="success" title="Listo">Se guardo correctamente.</Notification>
        <Notification variant="danger" title="Error">No se pudo completar la accion.</Notification>
        <Notification variant="warning" title="Atencion">Revisa los datos antes de continuar.</Notification>
        <Notification variant="info" title="Info">Hay una version nueva disponible.</Notification>
      </div>
    `,
  }),
}

export const ColaGlobal: Story = {
  render: () => ({
    components: { NotificationsContainer },
    setup: () => {
      const { success, danger, warning, info } = useNotifications()
      return { success, danger, warning, info }
    },
    template: `
      <div>
        <p style="font-family: var(--font-family-body); font-size: 14px; margin-bottom: 1rem;">
          Los botones disparan <code>useNotifications()</code>; la cola se renderiza en
          &lt;NotificationsContainer /&gt;, montado una sola vez (ej. en el root de la app).
        </p>
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
          <button @click="success('Se guardo correctamente.', 'Listo')">Success</button>
          <button @click="danger('No se pudo completar la accion.', 'Error')">Danger</button>
          <button @click="warning('Revisa los datos antes de continuar.', 'Atencion')">Warning</button>
          <button @click="info('Hay una version nueva disponible.', 'Info')">Info</button>
        </div>
        <NotificationsContainer />
      </div>
    `,
  }),
}
