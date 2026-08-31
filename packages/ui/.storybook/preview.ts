import type { Preview } from '@storybook/vue3-vite'
import '../../tokens/dist/index.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
  },

  globalTypes: {
    brand: {
      description: 'Marca activa',
      defaultValue: 'nwt',
      toolbar: {
        title: 'Marca',
        icon: 'paintbrush',
        items: [
          { value: 'nwt', title: 'NWT' },
          { value: 'ltk', title: 'LTK' },
          { value: 'qtz', title: 'QTZ' },
        ],
        dynamicTitle: true,
      },
    },
  },

  decorators: [
    (story, context) => ({
      components: { story },
      setup: () => ({ brand: context.globals.brand }),
      template: `<div :data-brand="brand" style="padding: 1.5rem"><story /></div>`,
    }),
  ],
}

export default preview
