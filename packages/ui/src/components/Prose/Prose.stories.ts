import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Prose from './Prose.vue'
import Heading from '../Heading/Heading.vue'
import Paragraph from '../Paragraph/Paragraph.vue'
import List from '../List/List.vue'
import ListItem from '../List/ListItem.vue'

const meta = {
  title: 'Components/Prose',
  component: Prose,
  tags: ['autodocs', 'display'],
  argTypes: { size: { control: 'select', options: ['md', 'sm', 'xsm'] } },
  args: { size: 'md' },
} satisfies Meta<typeof Prose>

export default meta
type Story = StoryObj<typeof meta>

const HTML = `
  <h1>Responsible Gaming Statement</h1>
  <p>Under the Curaçao National Ordinance on Games of Chance (LOK), we are committed to promoting responsible gaming practices to ensure a safe and enjoyable experience for all players. Our responsible gaming policies are designed to protect minors and vulnerable individuals, prevent gambling addiction, and maintain the integrity of our gaming operations.</p>
  <h2>Key Principles:</h2>
  <ul>
    <li><strong>Protection of Minors</strong>: We strictly prohibit gambling by individuals under the age of 18. Robust age verification processes are in place to prevent underage gambling.</li>
    <li><strong>Support for Vulnerable Individuals</strong>: We provide resources and support for players who may be at risk of developing gambling-related problems.</li>
    <li><strong>Fair Play and Transparency</strong>: Our games are designed to be fair and transparent. We adhere to strict regulatory standards.</li>
  </ul>
  <p>If you want to check our entire Responsible Gambling Policy please <a href="#">click here</a>.</p>
`

export const HtmlDeCMS: Story = {
  name: 'HTML que llega armado (CMS / página legal)',
  render: (args) => ({
    components: { Prose },
    setup: () => ({ args, html: HTML }),
    template: `<Prose v-bind="args"><div v-html="html" /></Prose>`,
  }),
}

export const ConComponentes: Story = {
  name: 'Mismo contenido con Heading + Paragraph + List',
  render: () => ({
    components: { Heading, Paragraph, List, ListItem },
    template: `
      <div>
        <Heading :level="1" size="title">Responsible Gaming Statement</Heading>
        <Paragraph>Under the Curaçao National Ordinance on Games of Chance (LOK), we are committed to promoting responsible gaming practices to ensure a safe and enjoyable experience for all players.</Paragraph>
        <Heading :level="2" size="title">Key Principles:</Heading>
        <List>
          <ListItem><strong>Protection of Minors</strong>: We strictly prohibit gambling by individuals under the age of 18.</ListItem>
          <ListItem><strong>Support for Vulnerable Individuals</strong>: We provide resources and support for players who may be at risk.</ListItem>
          <ListItem><strong>Fair Play and Transparency</strong>: Our games are designed to be fair and transparent.</ListItem>
        </List>
        <Paragraph>If you want to check our entire Responsible Gambling Policy please <a href="#">click here</a>.</Paragraph>
      </div>`,
  }),
}
