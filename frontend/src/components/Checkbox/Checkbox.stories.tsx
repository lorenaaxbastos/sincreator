import { Checkbox } from './Checkbox';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
### Component requirements

This component renders a standard checkbox input, ideal for form submissions, terms acceptance, or multi-selection.

- Should use \`React.forwardRef\` to correctly receive and attach refs from form libraries like React Hook Form.
- Should support both controlled and uncontrolled usage (\`checked\` and \`defaultChecked\`).
- Should accept a \`label\` prop (ReactNode) to render alongside the checkbox. If no label is provided, it should render just the checkbox square (useful for table rows).
- Should support an \`indeterminate\` state, visually representing a partially selected group (e.g., a "Select All" parent checkbox).
- Should support a \`disabled\` state, visually and functionally disabling the input and its label.
- Should accept an \`hasError\` prop to apply error styling (e.g., red borders/text).
- Should be fully accessible, allowing users to toggle it via keyboard (Space) and properly linking the label to the input.
        `,
      },
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Aceito os termos de uso e política de privacidade',
  },
};

export const Checked: Story = {
  args: {
    label: 'Desejo receber novidades por e-mail',
    defaultChecked: true,
  },
};

export const Indeterminate: Story = {
  args: {
    label: 'Selecionar todos (parcialmente marcados)',
    indeterminate: true,
  },
};

export const WithoutLabel: Story = {
  args: {
    'aria-label': 'Selecionar linha',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Opção indisponível no seu plano',
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    label: 'Opção obrigatória do sistema',
    disabled: true,
    defaultChecked: true,
  },
};

export const WithError: Story = {
  args: {
    label: 'Você precisa aceitar os termos para continuar',
    hasError: true,
  },
};
