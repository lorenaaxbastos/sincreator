import { CreationBriefing } from './CreationBriefing';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Components/CreationBriefing',
  component: CreationBriefing,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
### Component requirements

This component gives details to the planner/author about what they should create.

- Should be semantically structured as a \`<section>\` linked to its title via \`aria-labelledby\`
- Should render a title named "Briefing"
- Should render a box containing the briefing content
- Should adapt its layout via \`variant\` prop:
  - **Variant \`constrained\`**: Must limit max-height, enable vertical scroll, and be focusable via keyboard (\`tabIndex={0}\`)
  - **Variant \`free\`**: Must grow vertically according to content without focus restraints
- Should receive its content as a ReactNode
- Should not render the component if content is empty or null
        `,
      },
    },
  },
} satisfies Meta<typeof CreationBriefing>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Free: Story = {
  args: {
    variant: 'free',
    content: (
      <p>
        Este é um briefing curto. O container deve abraçar este conteúdo sem restrições de altura.
      </p>
    ),
  },
};

export const Constrained: Story = {
  args: {
    variant: 'constrained',
    content: (
      <>
        <p>
          <strong>Objetivo da Campanha:</strong> Aumentar a conversão.
        </p>
        <p>
          <strong>Público-alvo:</strong> Jovens de 18 a 24 anos.
        </p>
        <p>
          <strong>Tom de voz:</strong> Descontraído e direto.
        </p>
        <div style={{ height: '300px', background: '#ddd', margin: '16px 0', padding: '16px' }}>
          <em>
            [Bloco artificial para simular um texto muito longo e forçar o scroll do container...]
          </em>
        </div>
        <p>
          <strong>Fim do documento.</strong> Se você está lendo isso dentro do box, o scroll
          funcionou!
        </p>
      </>
    ),
  },
};

export const Empty: Story = {
  args: {
    variant: 'free',
    content: '',
  },
};
