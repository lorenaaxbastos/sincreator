import { SupportMaterialForm } from './SupportMaterialForm';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Forms/SupportMaterialForm',
  component: SupportMaterialForm,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
### Component requirements

A smart form component responsible for gathering data to create a Support Material or edit an existir Support Material.
It integrates internally with \`react-hook-form\`, \`zod\` (for validation), and the \`useCreationStore\` created with \`zustand\` (for state management).

**Form modes:**
- **Create mode:** When no \`initialData\` is provided. Submit button should say "Adicionar".
- **Edit mode:** When \`initialData\` is provided. Submit button should say "Salvar alterações".

**Data handling:**
- Should accept an optional \`initialData\` prop of type \`SupportMaterial\`.
- Should use \`initialData\` to populate \`defaultValues\` in React Hook Form.
- Should disable the 'Tipo' field when in Edit mode, as the core material type cannot be morphed after creation.

**Business rules & dynamic rendering:**
- **Base fields:** 'Tipo' and 'Nome' are always visible.
- **Papelaria (Stationery):** Renders 'Quantidade', 'Multiplicador', and 'Observações'. If Multiplier is 'Grupo', reveals the 'Quantidade de grupos' field.
- **Impressão (Print):** Renders all 'Papelaria' fields PLUS 'Link do arquivo', 'Lados', 'Tamanho', 'Cor' and 'Grampear'.
- **Digital:** Shows 'Link' and 'Ferramenta'.
  - If Tool is 'Outro', reveals 'Nome da ferramenta'.
  - If Tool is 'Mentimeter', reveals both 'Link de edição' and 'Link de resultados'.
  - If Tool is 'Quizizz' or 'Kahoot', reveals only 'Link de edição'.

**Validation & state management:**
- Should use \`zodResolver\` with the \`supportMaterialSchema\` to enforce strict validation limits (min/max characters, URLs, positive numbers).
- Should clean up unregistered fields from the payload using \`shouldUnregister: true\` to avoid Zod strict() errors when switching tabs.
- Upon successful validation, should dispatch to \`useCreationStore\` (\`addMaterial\` with a generated \`uuid\` for creations, or \`updateMaterial\` for edits), and reset the form.
- Upon successful validation, should generate a \`uuid\` for the material, dispatch it to the \`useCreationStore\`, and reset the form.
        `,
      },
    },
  },
} satisfies Meta<typeof SupportMaterialForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Create: Story = {
  args: {},
};

export const EditStationery: Story = {
  args: {
    initialData: {
      id: '1',
      type: 'Papelaria',
      name: 'Cartolinas Brancas',
      qty: 10,
      multiplier: 'Sala',
      notes: 'Entregar na secretaria',
    },
  },
};

export const EditPrint: Story = {
  args: {
    initialData: {
      id: '2',
      type: 'Impressão',
      name: 'Apostila de Treinamento',
      url: 'https://meu-drive.com/arquivo.pdf',
      qty: 1,
      multiplier: 'Cursista',
      sides: 'Frente e verso',
      size: 'A4',
      color: 'Colorido',
      staple: true,
    },
  },
};

export const EditDigital: Story = {
  args: {
    initialData: {
      id: '3',
      type: 'Digital',
      name: 'Quiz de Encerramento',
      url: 'https://menti.com/123',
      tool: 'Mentimeter',
      editUrl: 'https://mentimeter.com/edit/456',
      resultsUrl: 'https://mentimeter.com/results/789',
    },
  },
};
