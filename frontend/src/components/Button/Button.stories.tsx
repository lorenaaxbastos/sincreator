import { Trash2, Plus } from 'lucide-react';
import { Button } from './Button';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
### Component requirements

This component is an accessible, highly customizable button.

- Should use \`React.forwardRef\` to correctly receive and attach refs.
- Should support multiple variants: \`default\`, \`outline\`, \`ghost\`, \`alert\`, and \`link\`.
- Should support multiple sizes: \`sm\`, \`md\`, \`lg\`, and \`icon\`.
- Should handle a \`isLoading\` state, preventing clicks and displaying a loading indicator while preserving the button's dimensions.
- Should accept standard HTML button attributes (\`disabled\`, \`type\`, \`onClick\`, etc.).
- Should provide clear visual feedback for \`hover\`, \`focus\`, \`active\`, and \`disabled\` states across all variants.
        `,
      },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Salvar',
    variant: 'default',
    size: 'md',
  },
};

export const Outline: Story = {
  args: {
    children: 'Adicionar material',
    variant: 'outline',
    size: 'md',
  },
};

export const Ghost: Story = {
  args: {
    children: 'Limpar filtros',
    variant: 'ghost',
    size: 'md',
  },
};

export const Alert: Story = {
  args: {
    children: 'Cancelar',
    variant: 'alert',
    size: 'md',
  },
};

export const Link: Story = {
  args: {
    children: 'Ver detalhes',
    variant: 'link',
    size: 'md',
  },
};

export const Loading: Story = {
  args: {
    children: 'Salvando...',
    variant: 'default',
    isLoading: true,
  },
};

export const Disabled: Story = {
  args: {
    children: 'Avançar',
    variant: 'default',
    disabled: true,
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <Button size="sm">Pequeno</Button>
      <Button size="md">Médio</Button>
      <Button size="lg">Grande</Button>
    </div>
  ),
};

export const IconButton: Story = {
  args: {
    children: <Trash2 size={24} />,
    variant: 'alert',
    size: 'icon',
    'aria-label': 'Excluir item',
  },
};

export const WithIconAndText: Story = {
  args: {
    children: (
      <>
        <Plus size={20} />
        Adicionar novo
      </>
    ),
    variant: 'outline',
  },
};
