import { CreationGeneralInfo } from './CreationGeneralInfo';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Components/CreationGeneralInfo',
  component: CreationGeneralInfo,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
### Component requirements

This component gives all the details required to plan and create a training to the planner/author.

- Should be semantically structured as a \`<section>\` linked to its title via \`aria-labelledby\`.
- Should render a heading named "Sobre a formação".
- Should render the \`CreationSummary\` and \`CreationBriefing\` components if valid data is provided.
- Should not render anything (return null) if both summary and briefing data are missing or empty.
- Should render an icon-only "split-screen" button (accessible via \`aria-label\`) with a descriptive tooltip, triggering the \`onToggleSplitScreen\` callback when clicked.
- Should accept an \`isSplitScreen\` boolean prop to know the current layout state.
- Should apply specific styling (e.g., gray background, padding) when \`isSplitScreen\` is true.
        `,
      },
    },
  },
} satisfies Meta<typeof CreationGeneralInfo>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockSummaryData = {
  name: 'BNCC Computação',
  format: 'Presencial',
  duration: 8,
  qtyPeople: 40,
  qtySessions: 2,
  isAtTheSameTime: false,
  target: 'Professores do Pará',
  dateAndHour: '25/02/2025 08:00:00',
  place: 'Estádio municipal',
};

const mockBriefingProps = {
  content: (
    <p>
      Este é o briefing detalhado da formação, contendo os objetivos de aprendizagem e o escopo do
      projeto.
    </p>
  ),
  variant: 'free' as const,
};

export const Default: Story = {
  args: {
    summaryData: mockSummaryData,
    briefingProps: mockBriefingProps,
    isSplitScreen: false,
    onToggleSplitScreen: () => {
      alert('Botão clicado! O pai vai mudar o isSplitScreen para true.');
    },
  },
};

export const SplitScreenActive: Story = {
  args: {
    summaryData: mockSummaryData,
    briefingProps: mockBriefingProps,
    isSplitScreen: true,
    onToggleSplitScreen: () => {
      alert('Botão clicado! O pai vai mudar o isSplitScreen para false.');
    },
  },
};

export const OnlySummary: Story = {
  args: {
    summaryData: mockSummaryData,
    briefingProps: null,
    isSplitScreen: false,
    onToggleSplitScreen: () => {
      alert('Botão clicado! O pai vai mudar o isSplitScreen para true.');
    },
  },
};

export const OnlyBriefing: Story = {
  args: {
    summaryData: null,
    briefingProps: mockBriefingProps,
    isSplitScreen: false,
    onToggleSplitScreen: () => {
      alert('Botão clicado! O pai vai mudar o isSplitScreen para true.');
    },
  },
};
