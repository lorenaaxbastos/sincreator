import { CollapsablePanel } from './CollapsablePanel';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Components/CollapsablePanel',
  component: CollapsablePanel,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
### Component requirements

A generic, reusable layout component that wraps content in a collapsable panel. 

- Should be semantically structured using a generic container (like a \`<div>\`).
- Should render a title string passed via props inside a dynamic heading tag (\`headingLevel\`).
- Should accept an optional \`titleId\` to link the heading to external sections via \`aria-labelledby\`.
- The heading area must contain a \`<button>\` to toggle the state natively via keyboard.
- The button must use \`aria-expanded\` to indicate its state to screen readers.
- The content area should be linked to the button via \`aria-controls\`.
- Should render its \`children\` when expanded.
- Should not render (or visually hide) its \`children\` when collapsed.
- Should accept a \`defaultExpanded\` boolean prop to define its initial state.
        `,
      },
    },
  },
} satisfies Meta<typeof CollapsablePanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Expanded: Story = {
  args: {
    title: 'Sobre a formação',
    headingLevel: 'h2',
    defaultExpanded: true,
    children: <p>Conteúdo interno genérico.</p>,
  },
};

export const Collapsed: Story = {
  args: {
    title: 'Dados complementares (FECHADO)',
    headingLevel: 'h3',
    defaultExpanded: false,
    children: <p>Você não deveria estar vendo isso até clicar no título!</p>,
  },
};
