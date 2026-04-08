import { Info, Trash2 } from 'lucide-react';
import { Button } from '../Button/Button';
import { Tooltip } from './Tooltip';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
### Component requirements

This component is an accessible wrapper that displays a tooltip bubble when interacting with its children.

- Should display the \`content\` when the user hovers over the wrapped element.
- Should display the \`content\` when the wrapped element receives keyboard focus.
- Should hide the tooltip when the mouse leaves, focus is lost, or the \`Escape\` key is pressed.
- Should inject events into the child element using \`cloneElement\` to comply with accessibility standards (avoiding non-native interactive elements).
- Should have \`role="tooltip"\` for accessibility.
- Should apply \`aria-describedby\` linking the trigger element to the tooltip ID when visible.
- Should support multiple positions: \`top\` (default), \`bottom\`, \`left\`, and \`right\`.
- Should gracefully handle non-valid React elements with a warning, returning the original children.
        `,
      },
    },
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultTop: Story = {
  args: {
    content: 'Abre para cima (padrão)',
    position: 'top',
    children: <Button variant="outline">Acima</Button>,
  },
};

export const PositionBottom: Story = {
  args: {
    content: 'Abre para baixo',
    position: 'bottom',
    children: <Button variant="outline">Abaixo</Button>,
  },
};

export const PositionRight: Story = {
  args: {
    content: 'Abre para a direita',
    position: 'right',
    children: <Button variant="outline">Direita</Button>,
  },
};

export const PositionLeft: Story = {
  args: {
    content: 'Abre para a esquerda',
    position: 'left',
    children: <Button variant="outline">Esquerda</Button>,
  },
};

export const WithIconButton: Story = {
  args: {
    content: 'Excluir item',
    position: 'bottom',
    children: (
      <Button variant="ghost" size="icon" aria-label="Excluir item">
        <Trash2 size={20} />
      </Button>
    ),
  },
};

export const LongText: Story = {
  args: {
    content:
      'Este é um tooltip com um texto um pouco mais longo para testar a quebra de linha e o limite máximo de largura do balão.',
    position: 'right',
    children: (
      <Button variant="ghost" size="icon">
        <Info size={24} color="var(--color-cyan)" />
      </Button>
    ),
  },
};
