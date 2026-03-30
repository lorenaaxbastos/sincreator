import { render, screen } from '@testing-library/react';
import { CreationBriefing } from './CreationBriefing';
import styles from './CreationBriefing.module.css';

describe('CreationBriefing component', () => {
  const mockContent = <p>Este é o conteúdo do briefing</p>;

  it('should be semantically structured as a <section> linked to its title via aria-labelledby', () => {
    render(<CreationBriefing variant="free" content={mockContent} />);

    const title = screen.getByRole('heading', { name: /briefing/i, level: 3 });
    const section = screen.getByRole('region', { name: /briefing/i });

    expect(section).toBeInTheDocument();
    expect(title).toHaveAttribute('id', 'briefing-title');
    expect(section).toHaveAttribute('aria-labelledby', 'briefing-title');
  });

  it('should render a title named "Briefing"', () => {
    render(<CreationBriefing variant="free" content={mockContent} />);

    const title = screen.getByRole('heading', { name: /briefing/i, level: 3 });
    expect(title).toBeInTheDocument();
  });

  it('should render a box containing the briefing content', () => {
    render(<CreationBriefing variant="free" content={mockContent} />);

    const textElement = screen.getByText('Este é o conteúdo do briefing');
    expect(textElement).toBeInTheDocument();
  });

  it('should apply constrained styles when variant is "constrained"', () => {
    render(<CreationBriefing variant="constrained" content={mockContent} />);

    const boxElement = screen.getByTestId('briefing-box');
    expect(boxElement).toHaveClass(styles.constrained);
  });

  it('should not apply constrained styles when variant is "free"', () => {
    render(<CreationBriefing variant="free" content={mockContent} />);

    const boxElement = screen.getByTestId('briefing-box');
    expect(boxElement).not.toHaveClass(styles.constrained);
  });

  it('should make the box focusable for keyboard scrolling when constrained', () => {
    render(<CreationBriefing variant="constrained" content={mockContent} />);

    const boxElement = screen.getByTestId('briefing-box');
    expect(boxElement).toHaveAttribute('tabindex', '0');
  });

  it('[ ] Should not render the component if content is empty or null', () => {
    const { container } = render(<CreationBriefing variant="free" content="" />);
    expect(container.firstChild).toBeNull();

    const section = screen.queryByRole('region', { name: /briefing/i });
    expect(section).not.toBeInTheDocument();
  });
});
