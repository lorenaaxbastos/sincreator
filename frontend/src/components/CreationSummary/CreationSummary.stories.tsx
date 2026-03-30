import { CreationSummary } from './CreationSummary';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Components/CreationSummary',
  component: CreationSummary,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
### Components requirements

This component gives details to the planner/author about generic information about a training, such as date, hour, targer, etc.

- Should be semantically structured as a \`<section>\` linked to its title via \`aria-labelledby\`
- Should render a title named "Dados da formação"
- Should be semantically structured using a Description List (\`<dl>\`, \`<dt>\`, \`<dd>\`)
- Should render the training name, format, duration, target, number of participants, number of sessions, date(s), hour(s), and place
- Should display whether sessions are simultaneous ONLY if \`qtySessions\` is greater than 1
- Should hide any specific field (label and value) if its data is missing (null, undefined, or empty)
- Should not render the component if all valid entries are empty
        `,
      },
    },
  },
} satisfies Meta<typeof CreationSummary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CompleteSingleSession: Story = {
  args: {
    data: {
      name: 'BNCC Computação',
      format: 'Presencial',
      duration: 8,
      qtyPeople: 40,
      qtySessions: 1,
      isAtTheSameTime: false,
      target: 'Professores do Pará',
      dateAndHour: '25/02/2025 08:00:00',
      place: 'Estádio municipal',
    },
  },
};

export const MultipleSessions: Story = {
  args: {
    data: {
      name: 'Capacitação Avançada',
      format: 'Online',
      duration: 20,
      qtyPeople: 100,
      qtySessions: 5,
      isAtTheSameTime: true,
      target: 'Coordenadores',
      dateAndHour: 'Várias datas',
      place: 'Google Meet',
    },
  },
};

export const MissingInformation: Story = {
  args: {
    data: {
      name: 'Palestra Rápida',
      format: 'Presencial',
      duration: undefined,
      qtyPeople: undefined,
      qtySessions: 1,
      isAtTheSameTime: false,
      target: 'Alunos',
      dateAndHour: '10/10/2025 14:00',
      place: '',
    },
  },
};
