import { RadioGroup } from './RadioGroup';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Components/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
### Component requirements

This component renders a group of mutually exclusive radio buttons. It is designed to be fully accessible and easily integrable with form validation libraries like React Hook Form.

- Should use \`React.forwardRef\` to correctly receive and attach refs from form libraries to the underlying input elements.
- Should accept an \`options\` array containing objects with \`label\`, \`value\`, and optionally \`disabled\` to dynamically render the radio inputs.
- Should accept a \`name\` prop that is shared across all radio inputs in the group to ensure they are mutually exclusive.
- Should support a group-level \`disabled\` state, which visually and functionally disables all radio buttons within the group.
- Should allow individual options to be disabled via the \`options\` array, even if the group itself is not fully disabled.
- Should support an \`orientation\` prop (\`vertical\` or \`horizontal\`) to control the layout of the radio buttons (default is \`vertical\`).
- Should accept a \`hasError\` prop to apply error styling (e.g., red text/borders) to the group.
- Should apply appropriate accessibility attributes when in an error state (\`aria-invalid="true"\` and \`aria-errormessage\`).
- Should act as a controlled or uncontrolled component (supporting both \`value\` and \`defaultValue\`).
- Should be fully accessible, utilizing \`role="radiogroup"\` (or \`<fieldset>\`) and properly linking inputs to their respective labels.
        `,
      },
    },
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

const standardOptions = [
  { label: 'Cartão de Crédito', value: 'credit_card' },
  { label: 'Boleto Bancário', value: 'boleto' },
  { label: 'Pix', value: 'pix' },
];

export const Default: Story = {
  args: {
    name: 'payment_method',
    options: standardOptions,
    'aria-label': 'Método de pagamento',
  },
};

export const Horizontal: Story = {
  args: {
    name: 'payment_method_horizontal',
    options: standardOptions,
    orientation: 'horizontal',
    'aria-label': 'Método de pagamento',
  },
};

export const WithDefaultValue: Story = {
  args: {
    name: 'payment_method_default',
    options: standardOptions,
    defaultValue: 'pix',
    'aria-label': 'Método de pagamento',
  },
};

export const DisabledGroup: Story = {
  args: {
    name: 'payment_method_disabled',
    options: standardOptions,
    disabled: true,
    defaultValue: 'boleto',
    'aria-label': 'Método de pagamento desabilitado',
  },
};

export const DisabledOption: Story = {
  args: {
    name: 'payment_method_partial',
    options: [
      { label: 'Cartão de Crédito', value: 'credit_card' },
      { label: 'Boleto Bancário (Indisponível)', value: 'boleto', disabled: true },
      { label: 'Pix', value: 'pix' },
    ],
    'aria-label': 'Método de pagamento com opção indisponível',
  },
};

export const WithError: Story = {
  args: {
    name: 'payment_method_error',
    options: standardOptions,
    hasError: true,
    'aria-label': 'Método de pagamento com erro',
  },
};
