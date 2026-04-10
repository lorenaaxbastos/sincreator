import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Textarea } from './Textarea';
import styles from './Textarea.module.css';

describe('Textarea', () => {
  it('should render correctly and accept standard attributes', () => {
    render(<Textarea placeholder="Descreva aqui" rows={4} id="desc" />);

    const textarea = screen.getByPlaceholderText('Descreva aqui');
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveAttribute('rows', '4');
    expect(textarea).toHaveAttribute('id', 'desc');
    expect(textarea.tagName).toBe('TEXTAREA');
  });

  it('should forward ref correctly', () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(<Textarea ref={ref} />);

    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe('TEXTAREA');
  });

  it('should allow user to type and update value', async () => {
    const user = userEvent.setup();
    render(<Textarea placeholder="Texto" />);

    const textarea = screen.getByPlaceholderText('Texto');
    await user.type(textarea, 'Minha descrição longa');

    expect(textarea).toHaveValue('Minha descrição longa');
  });

  it('should generate an ID automatically if no ID is provided', () => {
    render(<Textarea placeholder="Campo Sem ID" />);

    const inputElement = screen.getByPlaceholderText('Campo Sem ID');

    expect(inputElement).toBeInTheDocument();
    expect(inputElement.getAttribute('id')).toBeTruthy();
  });

  it('should apply accessibility attributes and styles when hasError is true', () => {
    render(<Textarea id="meu-input" hasError placeholder="Erro" />);

    const textarea = screen.getByPlaceholderText('Erro');

    expect(textarea).toHaveAttribute('aria-invalid', 'true');
    expect(textarea).toHaveAttribute('aria-errormessage', 'meu-input-error');
    expect(textarea).toHaveClass(styles.error);
  });

  it('should apply correct resize classes based on the resize prop', () => {
    const { rerender } = render(<Textarea resize="none" placeholder="Resize" />);
    expect(screen.getByPlaceholderText('Resize')).toHaveClass(styles['resize-none']);

    rerender(<Textarea resize="vertical" placeholder="Resize" />);
    expect(screen.getByPlaceholderText('Resize')).toHaveClass(styles['resize-vertical']);

    rerender(<Textarea resize="horizontal" placeholder="Resize" />);
    expect(screen.getByPlaceholderText('Resize')).toHaveClass(styles['resize-horizontal']);

    rerender(<Textarea resize="both" placeholder="Resize" />);
    expect(screen.getByPlaceholderText('Resize')).toHaveClass(styles['resize-both']);
  });

  it('should act as a controlled component', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    const { rerender } = render(
      <Textarea value="valor fixo" onChange={handleChange} placeholder="Controlled" />,
    );

    const textarea = screen.getByPlaceholderText('Controlled');
    expect(textarea).toHaveValue('valor fixo');

    await user.type(textarea, 'a');
    expect(handleChange).toHaveBeenCalled();
    expect(textarea).toHaveValue('valor fixo');

    rerender(<Textarea value="valor novo" onChange={handleChange} placeholder="Controlled" />);
    expect(textarea).toHaveValue('valor novo');
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Textarea disabled placeholder="Disabled" />);

    const textarea = screen.getByPlaceholderText('Disabled');
    expect(textarea).toBeDisabled();
  });
});
