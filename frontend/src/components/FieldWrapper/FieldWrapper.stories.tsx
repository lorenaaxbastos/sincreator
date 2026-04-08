import { FieldWrapper } from './FieldWrapper';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Components/FieldWrapper',
  component: FieldWrapper,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
### Component requirements

This is a structural component designed to wrap form fields (inputs, selects, textareas).

- Should render a \`<label>\` linked to the child input via the \`id\` prop.
- Should render the child components passed to it.
- Should conditionally render an error message below the child components.
- Should generate an accessible error ID to be used by the child component's \`aria-errormessage\`.
        `,
      },
    },
  },
} satisfies Meta<typeof FieldWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: 'sample-field',
    label: 'Nome da ferramenta',
    children: (
      <input
        id="sample-field"
        type="text"
        placeholder="Digite o nome..."
        style={{ padding: '0.5rem', width: '100%' }}
      />
    ),
  },
};

export const WithError: Story = {
  args: {
    id: 'sample-error-field',
    label: 'Link de edição',
    error: 'Este campo é obrigatório para a ferramenta selecionada.',
    children: (
      <input
        id="sample-error-field"
        type="url"
        aria-invalid="true"
        placeholder="https://..."
        style={{ padding: '0.5rem', width: '100%', borderColor: 'red' }}
      />
    ),
  },
};
