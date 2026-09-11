import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Accordion from './Accordion.vue'
import AccordionItem from './AccordionItem.vue'

const meta = {
  title: 'Components/Accordion',
  component: Accordion,
  tags: ['autodocs', 'display'],
  argTypes: {
    multiple: { control: 'boolean' },
  },
  args: {
    multiple: true,
  },
} satisfies Meta<typeof Accordion>

export default meta
type Story = StoryObj<typeof meta>

export const FAQ: Story = {
  render: (args) => ({
    components: { Accordion, AccordionItem },
    setup: () => ({ args }),
    template: `
      <div style="max-width: 36rem;">
        <Accordion v-bind="args">
          <AccordionItem title="¿Cómo me registro en Wintrillions?">
            Ingresa en wintrillions.com y haz clic en el botón "Registrarse". Escribe tu nombre,
            apellido y correo electrónico, define una contraseña y ¡listo!
          </AccordionItem>
          <AccordionItem title="¿Cuál es el depósito mínimo en Wintrillions?">
            El depósito mínimo es de apenas $2 USD, aunque algunos métodos de pago pueden requerir
            un monto un poco mayor.
          </AccordionItem>
          <AccordionItem title="¿Cuánto tarda un retiro en Wintrillions?">
            Tu retiro comienza a procesarse dentro de los 3 a 5 días hábiles posteriores a la
            solicitud. Si tienes alguna consulta, puedes contactarnos en
            <a href="mailto:support@wintrillions.com">support@wintrillions.com</a>.
          </AccordionItem>
        </Accordion>
      </div>
    `,
  }),
}

export const UnaSolaAbierta: Story = {
  name: 'Una sola abierta a la vez (multiple=false)',
  args: { multiple: false },
  render: (args) => ({
    components: { Accordion, AccordionItem },
    setup: () => ({ args }),
    template: `
      <div style="max-width: 36rem;">
        <Accordion v-bind="args">
          <AccordionItem title="¿Qué es la autoexclusión?" default-open>
            La autoexclusión te permite bloquear temporal o permanentemente el acceso a tu cuenta
            si consideras que necesitas tomar una pausa del juego.
          </AccordionItem>
          <AccordionItem title="¿Qué es el periodo de descanso (cooling off)?">
            Te permite bloquear temporalmente el acceso a tu cuenta durante un tiempo determinado.
          </AccordionItem>
          <AccordionItem title="¿Cómo puedo establecer un límite de depósito?">
            Desde la sección Límites de depósito de tu cuenta, definiendo el monto máximo que
            podrás depositar durante un período determinado.
          </AccordionItem>
        </Accordion>
      </div>
    `,
  }),
}
