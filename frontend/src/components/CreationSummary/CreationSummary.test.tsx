import { render, screen } from '@testing-library/react';
import { CreationSummary } from './CreationSummary';

describe('CreationSummary component', () => {
  const mockContent = {
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

  it('should be semantically structured as a <section> linked to its title via aria-labelledby', () => {
    render(<CreationSummary data={mockContent} />);

    const title = screen.getByRole('heading', { name: /dados da formação/i, level: 3 });
    const section = screen.getByRole('region', { name: /dados da formação/i });

    expect(section).toBeInTheDocument();
    expect(title).toHaveAttribute('id', 'summary-title');
    expect(section).toHaveAttribute('aria-labelledby', 'summary-title');
  });

  it('should render a title named "Dados da formação"', () => {
    render(<CreationSummary data={mockContent} />);

    const title = screen.getByRole('heading', { name: /dados da formação/i, level: 3 });
    expect(title).toBeInTheDocument();
  });

  it('should be semantically structured using a description list (<dl>, <dt>, <dd>)', () => {
    const { container } = render(<CreationSummary data={mockContent} />);
    const dlElement = container.querySelector('dl');
    expect(dlElement).toBeInTheDocument();

    const term = screen.getByText(/formato/i);
    expect(term).toBeInTheDocument();
    expect(term.tagName).toBe('DT');

    const description = screen.getByText(/presencial/i);
    expect(description).toBeInTheDocument();
    expect(description.tagName).toBe('DD');
  });

  it('should render the training name, format, duration, target, number of participants, number of sessions, date(s), hour(s), and place', () => {
    render(<CreationSummary data={mockContent} />);

    expect(screen.getByText(/nome/i)).toBeInTheDocument();
    expect(screen.getByText(/formato/i)).toBeInTheDocument();
    expect(screen.getByText(/duração/i)).toBeInTheDocument();
    expect(screen.getByText(/participantes/i)).toBeInTheDocument();
    expect(screen.getByText(/turmas/i)).toBeInTheDocument();
    expect(screen.getByText(/aplicação/i)).toBeInTheDocument();
    expect(screen.getByText(/público/i)).toBeInTheDocument();
    expect(screen.getByText(/data/i)).toBeInTheDocument();
    expect(screen.getByText(/local/i)).toBeInTheDocument();

    expect(screen.getByText(/bncc/i)).toBeInTheDocument();
    expect(screen.getByText(/presencial/i)).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('40')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Assíncrona')).toBeInTheDocument();
    expect(screen.getByText(/professores/i)).toBeInTheDocument();
    expect(screen.getByText(/25/i)).toBeInTheDocument();
    expect(screen.getByText(/estádio/i)).toBeInTheDocument();
  });

  it('should display whether sessions are simultaneous ONLY if qtySessions is greater than 1', () => {
    const singleSessionData = { ...mockContent, qtySessions: 1 };
    render(<CreationSummary data={singleSessionData} />);

    expect(screen.queryByText(/aplicação/i)).not.toBeInTheDocument();
    expect(screen.queryByText('Assíncrona')).not.toBeInTheDocument();
  });

  it('should render "Síncrona" when isAtTheSameTime is true and qtySessions is greater than 1', () => {
    const synchronousData = {
      ...mockContent,
      isAtTheSameTime: true,
    };

    render(<CreationSummary data={synchronousData} />);

    expect(screen.getByText('Síncrona')).toBeInTheDocument();
  });

  it('should hide any specific field (label and value) if its data is missing (null, undefined, or empty)', () => {
    const missingData = {
      ...mockContent,
      duration: undefined,
      place: '',
      target: null,
    };
    render(<CreationSummary data={missingData} />);

    expect(screen.queryByText(/duração/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/local/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/público/i)).not.toBeInTheDocument();

    expect(screen.getByText(/nome/i)).toBeInTheDocument();
  });

  it('should not render the component if all valid entries are empty', () => {
    const emptyData = {
      duration: undefined,
      place: '',
    };
    const { container } = render(<CreationSummary data={emptyData} />);

    expect(container.firstChild).toBeNull();
  });
});
