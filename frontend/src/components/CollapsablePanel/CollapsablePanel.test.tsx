import { render, screen, fireEvent } from '@testing-library/react';
import { CollapsablePanel } from './CollapsablePanel';
import styles from './CollapsablePanel.module.css';

describe('CollapsablePanel component', () => {
  const mockTitle = 'Título do painel';
  const mockChildren = <p>Conteúdo do painel</p>;

  it('should be semantically structured using a generic container (like a <div>)', () => {
    const { container } = render(
      <CollapsablePanel title={mockTitle}>{mockChildren}</CollapsablePanel>,
    );
    expect(container.firstChild?.nodeName).toBe('DIV');
  });

  it('should render a title as an h3 by default', () => {
    render(<CollapsablePanel title={mockTitle}>{mockChildren}</CollapsablePanel>);
    const heading = screen.getByRole('heading', { name: mockTitle, level: 3 });
    expect(heading).toBeInTheDocument();
  });

  it('should render a title with a custom heading level when provided', () => {
    render(
      <CollapsablePanel title={mockTitle} headingLevel="h2">
        {mockChildren}
      </CollapsablePanel>,
    );
    const heading = screen.getByRole('heading', { name: mockTitle, level: 2 });
    expect(heading).toBeInTheDocument();
  });

  it('should apply the titleId to the heading element if provided', () => {
    render(
      <CollapsablePanel title={mockTitle} titleId="custom-id">
        {mockChildren}
      </CollapsablePanel>,
    );
    const heading = screen.getByRole('heading', { name: mockTitle });
    expect(heading).toHaveAttribute('id', 'custom-id');
  });

  it('should render its children passed via props when expanded', () => {
    render(<CollapsablePanel title={mockTitle}>{mockChildren}</CollapsablePanel>);
    const contentArea = screen.getByTestId('content-area');

    expect(screen.getByText(/conteúdo do painel/i)).toBeInTheDocument();
    expect(contentArea).toHaveClass(styles.content);
    expect(contentArea).not.toHaveClass(styles.collapsed);
    expect(contentArea).toHaveAttribute('aria-hidden', 'false');
  });

  it('the heading area must contain a <button> to toggle the state natively via keyboard', () => {
    render(<CollapsablePanel title={mockTitle}>{mockChildren}</CollapsablePanel>);
    expect(screen.getByRole('button', { name: mockTitle })).toBeInTheDocument();
  });

  it('the button must use aria-expanded to indicate its state to screen readers', () => {
    const { unmount } = render(
      <CollapsablePanel title={mockTitle} defaultExpanded={true}>
        {mockChildren}
      </CollapsablePanel>,
    );
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-expanded', 'true');

    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'false');

    unmount();
    render(
      <CollapsablePanel title={mockTitle} defaultExpanded={false}>
        {mockChildren}
      </CollapsablePanel>,
    );
    const buttonClosed = screen.getByRole('button');
    expect(buttonClosed).toHaveAttribute('aria-expanded', 'false');
  });

  it('the content area should be linked to the button via aria-controls', () => {
    render(<CollapsablePanel title={mockTitle}>{mockChildren}</CollapsablePanel>);
    const button = screen.getByRole('button');
    const contentArea = screen.getByTestId('content-area');

    expect(button).toHaveAttribute('aria-controls', contentArea.getAttribute('id'));
  });

  it('should visually hide its children when collapsed', () => {
    render(
      <CollapsablePanel title={mockTitle} defaultExpanded={false}>
        {mockChildren}
      </CollapsablePanel>,
    );
    const contentArea = screen.getByTestId('content-area');

    expect(contentArea).toHaveClass(styles.collapsed);
    expect(contentArea).toHaveAttribute('aria-hidden', 'true');
  });

  it('should toggle children visibility when clicking the button', () => {
    render(<CollapsablePanel title={mockTitle}>{mockChildren}</CollapsablePanel>);

    const button = screen.getByRole('button');
    const contentArea = screen.getByTestId('content-area');

    fireEvent.click(button);
    expect(contentArea).toHaveClass(styles.collapsed);
    expect(contentArea).toHaveAttribute('aria-hidden', 'true');

    fireEvent.click(button);
    expect(contentArea).not.toHaveClass(styles.collapsed);
    expect(contentArea).toHaveAttribute('aria-hidden', 'false');
  });
});
