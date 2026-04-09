import { TextInput } from './TextInput';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Components/TextInput',
  component: TextInput,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
### Component requirements

This component is a generic, accessible text input designed to integrate seamlessly with forms (e.g., React Hook Form). It is designed to be used inside a \`FieldWrapper\`.

- Should use \`React.forwardRef\` to correctly receive and attach refs from form libraries.
- Should act as a controlled or uncontrolled component (supporting both \`value\` and \`defaultValue\`).
- Should accept all standard HTML input attributes (placeholder, disabled, type, etc.) and pass them to the underlying \`<input>\`.
- Should apply appropriate accessibility attributes when in an error state (e.g., \`aria-invalid="true"\` and \`aria-errormessage\` linked to the error text ID).
- Should apply specific visual styling for different states: default, focused, disabled, and error (e.g., red border for errors).
- Should include an accessible toggle button to show/hide the text content when the \`type\` is set to \`"password"\`.
        `,
      },
    },
  },
} satisfies Meta<typeof TextInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Ex: Cartaz de Boas-vindas',
    id: 'material-name',
    'aria-label': 'Nome do material',
  },
};

export const WithError: Story = {
  args: {
    placeholder: 'https://...',
    hasError: true,
    id: 'tool-url',
    defaultValue: 'httpx://padlet.com',
    'aria-label': 'Link da ferramenta',
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'Qual ferramenta?',
    disabled: true,
    id: 'other-tool',
    'aria-label': 'Outra ferramenta',
  },
};

export const PasswordType: Story = {
  args: {
    type: 'password',
    placeholder: 'Digite a senha',
    id: 'access-password',
    'aria-label': 'Senha de acesso',
  },
};
