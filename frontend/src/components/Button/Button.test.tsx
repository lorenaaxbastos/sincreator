import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';
import styles from './Button.module.css';

describe('Button', () => {
  it('should render the button with children', () => {
    render(<Button>Meu Botão</Button>);
    const buttonElement = screen.getByRole('button', { name: 'Meu Botão' });
    expect(buttonElement).toBeInTheDocument();
  });

  it('should forward the ref correctly to the button element', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Teste Ref</Button>);

    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe('BUTTON');
  });

  it('should call onClick handler when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Clicar</Button>);

    const buttonElement = screen.getByRole('button', { name: 'Clicar' });
    await user.click(buttonElement);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should not call onClick when disabled', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(
      <Button onClick={handleClick} disabled>
        Clicar
      </Button>,
    );

    const buttonElement = screen.getByRole('button', { name: 'Clicar' });

    expect(buttonElement).toBeDisabled();
    await user.click(buttonElement);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should disable the button and show loading state when isLoading is true', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(
      <Button onClick={handleClick} isLoading>
        Processando
      </Button>,
    );

    const buttonElement = screen.getByRole('button', { name: 'Processando' });

    expect(buttonElement).toBeDisabled();
    expect(buttonElement).toHaveAttribute('aria-busy', 'true');

    await user.click(buttonElement);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should render the loading spinner when isLoading is true', () => {
    const { container } = render(<Button isLoading>Salvando</Button>);
    const spinnerElement = container.querySelector('svg');

    expect(spinnerElement).toBeInTheDocument();
    expect(spinnerElement).toHaveClass(styles.spinner);
  });

  it('should apply the correct class for each variant', () => {
    const { rerender } = render(<Button variant="default">Btn</Button>);
    expect(screen.getByRole('button')).toHaveClass(styles.default);

    rerender(<Button variant="outline">Btn</Button>);
    expect(screen.getByRole('button')).toHaveClass(styles.outline);

    rerender(<Button variant="ghost">Btn</Button>);
    expect(screen.getByRole('button')).toHaveClass(styles.ghost);

    rerender(<Button variant="alert">Btn</Button>);
    expect(screen.getByRole('button')).toHaveClass(styles.alert);

    rerender(<Button variant="link">Btn</Button>);
    expect(screen.getByRole('button')).toHaveClass(styles.link);
  });

  it('should apply the correct class for each size', () => {
    const { rerender } = render(<Button size="sm">Btn</Button>);
    expect(screen.getByRole('button')).toHaveClass(styles.sm);

    rerender(<Button size="lg">Btn</Button>);
    expect(screen.getByRole('button')).toHaveClass(styles.lg);

    rerender(<Button size="icon">Icon</Button>);
    expect(screen.getByRole('button')).toHaveClass(styles.icon);
  });

  it('should apply default variant and size classes if none are provided', () => {
    render(<Button>Btn</Button>);
    const buttonElement = screen.getByRole('button');

    expect(buttonElement).toHaveClass(styles.default);
    expect(buttonElement).toHaveClass(styles.md);
  });

  it('should append custom className to the button', () => {
    render(<Button className="minha-classe-customizada">Btn</Button>);
    const buttonElement = screen.getByRole('button');

    expect(buttonElement).toHaveClass('minha-classe-customizada');
    expect(buttonElement).toHaveClass(styles.button);
  });

  it('should handle explicitly passing disabled={false}', () => {
    render(<Button disabled={false}>Btn</Button>);
    expect(screen.getByRole('button')).not.toBeDisabled();
  });

  it('should render children inside the content span', () => {
    render(<Button>Conteúdo do Span</Button>);
    const spanElement = screen.getByText('Conteúdo do Span');

    expect(spanElement.tagName).toBe('SPAN');
    expect(spanElement).toHaveClass(styles.content);
  });
});
