import { Select } from './Select';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
### Component requirements

This component is a native, accessible select input designed to integrate seamlessly with forms. It is designed to be used inside a \`FieldWrapper\`.

- Should use \`React.forwardRef\` to correctly receive and attach refs from form libraries.
- Should act as a controlled or uncontrolled component (supporting both \`value\` and \`defaultValue\`).
- Should accept an array of \`options\` (value and label).
- Should optionally display a \`placeholder\` as a disabled, unselectable first option.
- Should accept standard HTML select attributes (disabled, defaultValue, etc.).
- Should apply appropriate accessibility attributes when in an error state (e.g., \`aria-invalid="true"\` and \`aria-errormessage\` linked to the error text ID).
- Should apply specific visual styling for different states: default, focused, disabled, and error.
        `,
      },
    },
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultOptions = [
  { value: 'Digital', label: 'Digital' },
  { value: 'Impressão', label: 'Impressão' },
  { value: 'Papelaria', label: 'Papelaria' },
];

export const Default: Story = {
  args: {
    id: 'material-type',
    options: defaultOptions,
    placeholder: 'Selecione o tipo de material',
    'aria-label': 'Tipo de material',
    defaultValue: '',
  },
};

export const WithError: Story = {
  args: {
    id: 'material-tool',
    options: [
      { value: 'Padlet', label: 'Padlet' },
      { value: 'Mentimeter', label: 'Mentimeter' },
    ],
    placeholder: 'Selecione a ferramenta',
    hasError: true,
    'aria-label': 'Ferramenta digital',
    defaultValue: '',
  },
};

export const Disabled: Story = {
  args: {
    id: 'material-size',
    options: [{ value: 'A4', label: 'Tamanho A4' }],
    placeholder: 'Selecione o tamanho',
    disabled: true,
    'aria-label': 'Tamanho da impressão',
  },
};
