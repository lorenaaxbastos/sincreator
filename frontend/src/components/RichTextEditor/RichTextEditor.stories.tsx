import { RichTextEditor } from './RichTextEditor';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Components/RichTextEditor',
  component: RichTextEditor,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
### Component requirements

This component renders an advanced rich text editor powered by TipTap, tailored for clean and semantic content creation. It is designed to be fully accessible, act as a standard form input, and integrate seamlessly with form libraries (e.g., React Hook Form) inside a \`FieldWrapper\`.

- Should use \`React.forwardRef\` and expose a \`focus()\` method via \`useImperativeHandle\` so form libraries can correctly attach refs and automatically focus the editor on validation errors.
- Should act as a controlled or uncontrolled component (supporting both \`value\` and \`defaultValue\`).
- Should trigger an \`onChange\` event returning clean HTML. If the user clears all content, it must return an empty string (\`""\`) rather than empty HTML tags (e.g., \`"<p></p>"\`) to ensure precise validation.
- Should trigger an \`onBlur\` event so form libraries can track the 'touched' state.
- Should automatically sanitize and strip unwanted inline styles (e.g., fonts, colors, external classes from Word/Web) from pasted content, preserving only the semantic tags allowed by the editor.
- Should accept an \`allowedControls\` array to dynamically render only specific formatting buttons (\`bold\`, \`italic\`, \`bulletList\`, \`orderedList\`, \`highlight\`, \`link\`).
- Should render all available controls if \`allowedControls\` is omitted.
- Should support a \`maxLength\` prop, displaying a character counter at the bottom that visually warns (e.g., changes text color to a warning state) at 90% capacity and strictly prevents further input when the limit is reached.
- Should automatically generate an \`id\` via \`useId\` if none is provided, applying it to the internal \`contenteditable\` element.
- Should accept a \`placeholder\` prop.
- Should handle a \`disabled\` state, visually and functionally making the editor read-only and dimming/disabling the toolbar buttons.
- Should accept a \`hasError\` prop to apply error styling (e.g., red borders) to the editor container.
- Should apply appropriate accessibility attributes when in an error state (\`aria-invalid="true"\` and \`aria-errormessage\` pointing to the generated error ID).
- Should be fully accessible, allowing an \`aria-label\` for the editor area and including descriptive aria-labels for the toolbar buttons (e.g., "Negrito", "Adicionar link", "Lista com marcadores").
- Should accept a \`className\` prop applied to the outer wrapper for flexible layout adjustments.
        `,
      },
    },
  },
} satisfies Meta<typeof RichTextEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: 'default-editor',
    'aria-label': 'Editor de texto padrão',
    placeholder: 'Digite seu texto aqui...',
    defaultValue: '<p>Este é um conteúdo inicial limpo e sem formatação excessiva.</p>',
  },
};

export const CompleteWithLimits: Story = {
  args: {
    id: 'complete-editor',
    'aria-label': 'Editor completo com limite',
    placeholder: 'Insira o conteúdo do slide...',
    maxLength: 300,
    // allowedControls omitido para exibir todos os botões (bold, italic, lists, link, highlight)
  },
};

export const LimitedControls: Story = {
  args: {
    id: 'limited-editor',
    'aria-label': 'Editor com controles limitados',
    placeholder: 'Use apenas formatação de texto...',
    defaultValue:
      '<p>Ideal para slides de citação ou tópicos estritos onde listas não são permitidas.</p>',
    allowedControls: ['bold', 'italic', 'highlight'],
  },
};

export const EmptyWithPlaceholder: Story = {
  args: {
    id: 'empty-editor',
    'aria-label': 'Editor vazio',
    placeholder: 'Descreva os detalhes da atividade...',
  },
};

export const WithError: Story = {
  args: {
    id: 'error-editor',
    'aria-label': 'Editor com erro de validação',
    defaultValue: '<p>Conteúdo inválido que precisa de correção.</p>',
    hasError: true,
  },
};

export const Disabled: Story = {
  args: {
    id: 'disabled-editor',
    'aria-label': 'Editor bloqueado',
    disabled: true,
    defaultValue:
      '<p>Este conteúdo é apenas para leitura e os controles da barra de ferramentas estão desabilitados.</p>',
  },
};
