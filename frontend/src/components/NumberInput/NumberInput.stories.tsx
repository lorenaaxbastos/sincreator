import { NumberInput } from './NumberInput';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Components/NumberInput',
  component: NumberInput,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
### Component requirements

This component is a numeric input in a "stepper" style, ideal for controlling quantities, durations, and multipliers. It is designed to integrate seamlessly with forms (e.g., React Hook Form) and should be used inside a \`FieldWrapper\`.

- Should use \`React.forwardRef\` to correctly receive and attach refs from form libraries.
- Should render a stepper interface with a central numeric input, a decrement (\`-\`) button on the left, and an increment (\`+\`) button on the right.
- Should allow setting a minimum (\`min\`) value, disabling the decrement button when the value is less than or equal to \`min\`.
- Should allow setting a maximum (\`max\`) value, disabling the increment button when the value is greater than or equal to \`max\`.
- Should support a custom \`step\` value for incrementing/decrementing (default is 1).
- Should handle direct typing, ignoring non-numeric characters.
- Should support keyboard navigation, allowing users to increment and decrement the value using the Arrow Up (\`↑\`) and Arrow Down (\`↓\`) keys when the input is focused.
- Should fallback to the \`min\` value (or 0) on blur if the input is left empty.
- Should handle a \`disabled\` state, visually and functionally disabling the input and both buttons.
- Should accept a \`hasError\` prop to apply error styling (e.g., red borders).
- Should be fully accessible, allowing \`aria-label\` for the input and including descriptive aria-labels for the buttons (e.g., "Diminuir valor", "Aumentar valor").
        `,
      },
    },
  },
} satisfies Meta<typeof NumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: 'default-quantity',
    'aria-label': 'Quantidade padrão',
  },
};

export const WithMinLimits: Story = {
  args: {
    defaultValue: 1,
    min: 1,
    id: 'students-quantity',
    'aria-label': 'Quantidade de cursistas',
  },
};

export const WithMinMaxLimits: Story = {
  args: {
    defaultValue: 5,
    min: 0,
    max: 10,
    id: 'evaluation-score',
    'aria-label': 'Nota de avaliação',
  },
};

export const CustomStep: Story = {
  args: {
    defaultValue: 0,
    step: 15,
    min: 0,
    max: 60,
    id: 'activity-duration',
    'aria-label': 'Duração em minutos',
  },
};

export const WithError: Story = {
  args: {
    defaultValue: 10,
    hasError: true,
    id: 'error-quantity',
    'aria-label': 'Quantidade com erro',
  },
};

export const Disabled: Story = {
  args: {
    defaultValue: 10,
    disabled: true,
    id: 'disabled-quantity',
    'aria-label': 'Quantidade bloqueada',
  },
};
