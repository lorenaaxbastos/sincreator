import { Textarea } from './Textarea';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Components/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
### Component requirements

A multi-line text input component, perfect for long descriptions, comments, or feedback.

- Should use \`React.forwardRef\` to correctly attach refs for form libraries like React Hook Form.
- Should support both controlled and uncontrolled usage (\`value\` and \`defaultValue\`).
- Should accept all standard HTML textarea attributes (\`placeholder\`, \`disabled\`, \`rows\`, etc.).
- Should support a \`resize\` prop to control if the user can resize the box (\`none\`, \`vertical\`, \`horizontal\`, \`both\`). The default should be \`vertical\` to prevent breaking page layouts.
- Should apply consistent styling for focus, error (\`hasError\`), and disabled states, matching our \`TextInput\`.
- Should be accessible, supporting proper focus management.
- Should apply appropriate accessibility attributes when in an error state (e.g., \`aria-invalid="true"\` and \`aria-errormessage\` linked to the error text ID).
        `,
      },
    },
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Digite sua descrição aqui...',
    rows: 4,
  },
};

export const WithDefaultValue: Story = {
  args: {
    defaultValue: 'Este é um texto que já veio preenchido pelo sistema.',
    rows: 4,
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'Campo desabilitado',
    disabled: true,
    rows: 4,
  },
};

export const WithError: Story = {
  args: {
    placeholder: 'Houve um erro no preenchimento',
    hasError: true,
    rows: 4,
  },
};

export const ResizeNone: Story = {
  args: {
    placeholder: 'Este campo não pode ser redimensionado (resize="none")',
    resize: 'none',
    rows: 4,
  },
};

export const ResizeVertical: Story = {
  args: {
    placeholder: 'Puxar apenas para baixo (resize="vertical" - Padrão)',
    resize: 'vertical',
    rows: 4,
  },
};

export const ResizeHorizontal: Story = {
  args: {
    placeholder: 'Puxar apenas para os lados (resize="horizontal")',
    resize: 'horizontal',
    rows: 4,
  },
};

export const ResizeBoth: Story = {
  args: {
    placeholder: 'Livre redimensionamento (resize="both")',
    resize: 'both',
    rows: 4,
  },
};
