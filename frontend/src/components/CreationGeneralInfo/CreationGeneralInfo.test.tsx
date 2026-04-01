import { render, screen, fireEvent } from '@testing-library/react';
import { CreationGeneralInfo } from './CreationGeneralInfo';
import styles from './CreationGeneralInfo.module.css';

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
  content: <p>Este é o briefing detalhado da formação</p>,
  variant: 'free' as const,
};

describe('CreationGeneralInfo component', () => {
  const mockOnToggle = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not render anything if both summaryData and briefingProps are empty or missing', () => {
    const { container } = render(
      <CreationGeneralInfo
        summaryData={null}
        briefingProps={null}
        isSplitScreen={false}
        onToggleSplitScreen={mockOnToggle}
      />,
    );

    expect(container.firstChild).toBeNull();
  });

  it('should render only the Summary if briefingProps is missing', () => {
    render(
      <CreationGeneralInfo
        summaryData={mockSummaryData}
        briefingProps={null}
        isSplitScreen={false}
        onToggleSplitScreen={mockOnToggle}
      />,
    );

    expect(screen.getByText(/bncc computação/i)).toBeInTheDocument();
    expect(screen.queryByText(/este é o briefing detalhado/i)).not.toBeInTheDocument();
  });

  it('should render only the Briefing if summaryData is empty', () => {
    render(
      <CreationGeneralInfo
        summaryData={{ name: '' }}
        briefingProps={mockBriefingProps}
        isSplitScreen={false}
        onToggleSplitScreen={mockOnToggle}
      />,
    );

    expect(screen.queryByText(/bncc computação/i)).not.toBeInTheDocument();
    expect(screen.getByText(/este é o briefing detalhado/i)).toBeInTheDocument();
  });

  it('should be semantically structured as a <section> linked to its title via aria-labelledby', () => {
    render(
      <CreationGeneralInfo
        summaryData={mockSummaryData}
        briefingProps={mockBriefingProps}
        isSplitScreen={false}
        onToggleSplitScreen={mockOnToggle}
      />,
    );

    const section = screen.getByRole('region', { name: /sobre a formação/i });
    const heading = screen.getByRole('heading', { name: /sobre a formação/i });

    expect(section).toBeInTheDocument();
    expect(heading).toHaveAttribute('id');
    expect(section).toHaveAttribute('aria-labelledby', heading.getAttribute('id'));
  });

  it('should render a heading named "Sobre a formação"', () => {
    render(
      <CreationGeneralInfo
        summaryData={mockSummaryData}
        briefingProps={mockBriefingProps}
        isSplitScreen={false}
        onToggleSplitScreen={mockOnToggle}
      />,
    );

    const heading = screen.getByRole('heading', { name: /sobre a formação/i, level: 2 });
    expect(heading).toBeInTheDocument();
  });

  it('should render the CreationSummary and CreationBriefing components with the provided data', () => {
    render(
      <CreationGeneralInfo
        summaryData={mockSummaryData}
        briefingProps={mockBriefingProps}
        isSplitScreen={false}
        onToggleSplitScreen={mockOnToggle}
      />,
    );

    expect(screen.getByText(/bncc computação/i)).toBeInTheDocument();
    expect(screen.getByText(/este é o briefing detalhado/i)).toBeInTheDocument();
  });

  it('should render a button to split the screen (accessible via aria-label)', () => {
    render(
      <CreationGeneralInfo
        summaryData={mockSummaryData}
        briefingProps={mockBriefingProps}
        isSplitScreen={false}
        onToggleSplitScreen={mockOnToggle}
      />,
    );

    const button = screen.getByRole('button', { name: /dividir tela/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-label', 'Dividir tela');

    fireEvent.click(button);
    expect(mockOnToggle).toHaveBeenCalledTimes(1);
  });

  it('should NOT apply specific split-screen styling when isSplitScreen is false', () => {
    render(
      <CreationGeneralInfo
        summaryData={mockSummaryData}
        briefingProps={mockBriefingProps}
        isSplitScreen={false}
        onToggleSplitScreen={mockOnToggle}
      />,
    );

    const section = screen.getByRole('region', { name: /sobre a formação/i });
    expect(section).not.toHaveClass(styles.onsplit);
  });

  it('should apply specific styling (e.g., gray background, padding) when isSplitScreen is true', () => {
    render(
      <CreationGeneralInfo
        summaryData={mockSummaryData}
        briefingProps={mockBriefingProps}
        isSplitScreen={true}
        onToggleSplitScreen={mockOnToggle}
      />,
    );

    const section = screen.getByRole('region', { name: /sobre a formação/i });
    expect(section).toHaveClass(styles.onsplit);
  });
});
