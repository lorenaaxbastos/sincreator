import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TextInput } from './TextInput';
import styles from './TextInput.module.css';

describe('TextInput', () => {
  it('should accept standard HTML attributes and pass them to the input', () => {
    render(<TextInput id="material-name" placeholder="Ex: Cartaz" type="text" />);

    const inputElement = screen.getByPlaceholderText('Ex: Cartaz');

    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute('id', 'material-name');
    expect(inputElement).toHaveAttribute('type', 'text');
  });

  it('should generate an ID automatically if no ID is provided', () => {
    render(<TextInput placeholder="Campo Sem ID" />);

    const inputElement = screen.getByPlaceholderText('Campo Sem ID');

    expect(inputElement).toBeInTheDocument();
    expect(inputElement.getAttribute('id')).toBeTruthy();
  });

  it('should forward the ref correctly to the input element', () => {
    const ref = createRef<HTMLInputElement>();
    render(<TextInput placeholder="Teste Ref" ref={ref} />);

    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe('INPUT');
  });

  it('should apply accessibility attributes and styles when hasError is true', () => {
    render(<TextInput id="meu-input" placeholder="Link da ferramenta" hasError={true} />);

    const inputElement = screen.getByPlaceholderText('Link da ferramenta');

    expect(inputElement).toHaveAttribute('aria-invalid', 'true');
    expect(inputElement).toHaveAttribute('aria-errormessage', 'meu-input-error');
    expect(inputElement).toHaveClass(styles.error);
  });

  it('should disable the input when the disabled prop is true', () => {
    render(<TextInput placeholder="Outra ferramenta" disabled={true} />);

    const inputElement = screen.getByPlaceholderText('Outra ferramenta');

    expect(inputElement).toBeDisabled();
  });

  it('should not allow typing when disabled is true', async () => {
    const user = userEvent.setup();
    render(<TextInput placeholder="Desabilitado" disabled={true} />);

    const inputElement = screen.getByPlaceholderText('Desabilitado');

    await user.type(inputElement, 'tentando digitar');

    expect(inputElement).toHaveValue('');
  });

  it('should allow the user to type in the input', async () => {
    const user = userEvent.setup();
    render(<TextInput placeholder="Digite algo" />);

    const inputElement = screen.getByPlaceholderText('Digite algo');

    await user.type(inputElement, 'texto de teste');

    expect(inputElement).toHaveValue('texto de teste');
  });

  it('should toggle password visibility when the eye icon is clicked', async () => {
    const user = userEvent.setup();
    render(<TextInput placeholder="Senha secreta" type="password" />);

    const inputElement = screen.getByPlaceholderText('Senha secreta');
    expect(inputElement).toHaveAttribute('type', 'password');

    const toggleButton = screen.getByRole('button', { name: 'Show password' });
    expect(toggleButton).toBeInTheDocument();

    await user.click(toggleButton);

    expect(inputElement).toHaveAttribute('type', 'text');
    expect(toggleButton).toHaveAttribute('aria-label', 'Hide password');

    await user.click(toggleButton);

    expect(inputElement).toHaveAttribute('type', 'password');
    expect(toggleButton).toHaveAttribute('aria-label', 'Show password');
  });

  it('should call onFocus and onBlur when interacting with the input', async () => {
    const user = userEvent.setup();
    const handleFocus = vi.fn();
    const handleBlur = vi.fn();

    render(<TextInput placeholder="Eventos" onFocus={handleFocus} onBlur={handleBlur} />);

    const inputElement = screen.getByPlaceholderText('Eventos');

    await user.click(inputElement);
    expect(handleFocus).toHaveBeenCalledTimes(1);

    await user.tab();
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it('should act as a controlled component when the value prop is provided', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    const { rerender } = render(
      <TextInput placeholder="Controlado" value="inicial" onChange={handleChange} />,
    );

    const inputElement = screen.getByPlaceholderText('Controlado');
    expect(inputElement).toHaveValue('inicial');

    await user.type(inputElement, 'a');
    expect(handleChange).toHaveBeenCalled();

    rerender(<TextInput placeholder="Controlado" value="iniciala" onChange={handleChange} />);
    expect(inputElement).toHaveValue('iniciala');
  });
});
