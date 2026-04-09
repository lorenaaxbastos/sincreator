import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NumberInput } from './NumberInput';
import styles from './NumberInput.module.css';

describe('NumberInput', () => {
  it('should forward the ref correctly to the input element', () => {
    const ref = createRef<HTMLInputElement>();
    render(<NumberInput ref={ref} aria-label="Input Numérico" />);

    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe('INPUT');
  });

  it('should render the stepper interface with an input and decrement/increment buttons', () => {
    render(<NumberInput aria-label="Quantidade" />);

    const inputElement = screen.getByLabelText('Quantidade');
    const decreaseBtn = screen.getByRole('button', { name: 'Diminuir valor' });
    const increaseBtn = screen.getByRole('button', { name: 'Aumentar valor' });

    expect(inputElement).toBeInTheDocument();
    expect(decreaseBtn).toBeInTheDocument();
    expect(increaseBtn).toBeInTheDocument();
  });

  it('should apply error styles when hasError is true', () => {
    const { container } = render(<NumberInput hasError={true} aria-label="Com Erro" />);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass(styles.error);
  });

  it('should disable the input and buttons when the disabled prop is true', () => {
    render(<NumberInput disabled={true} aria-label="Desabilitado" />);

    const inputElement = screen.getByLabelText('Desabilitado');
    const decreaseBtn = screen.getByRole('button', { name: 'Diminuir valor' });
    const increaseBtn = screen.getByRole('button', { name: 'Aumentar valor' });

    expect(inputElement).toBeDisabled();
    expect(decreaseBtn).toBeDisabled();
    expect(increaseBtn).toBeDisabled();
  });

  it('should not allow incrementing or decrementing when disabled', async () => {
    const user = userEvent.setup();
    render(<NumberInput disabled={true} defaultValue={5} aria-label="Ação Desabilitada" />);

    const inputElement = screen.getByLabelText('Ação Desabilitada');
    const increaseBtn = screen.getByRole('button', { name: 'Aumentar valor' });

    await user.click(increaseBtn);
    expect(inputElement).toHaveValue('5');
  });

  it('should allow the user to type and automatically filter out non-numeric characters', async () => {
    const user = userEvent.setup();
    render(<NumberInput defaultValue={0} aria-label="Filtro de Texto" />);

    const inputElement = screen.getByLabelText('Filtro de Texto');

    await user.clear(inputElement);
    await user.type(inputElement, '1a2b3c');

    expect(inputElement).toHaveValue('123');
  });

  it('should increment and decrement the value respecting the default step of 1', async () => {
    const user = userEvent.setup();
    render(<NumberInput defaultValue={5} aria-label="Contador" />);

    const inputElement = screen.getByLabelText('Contador');
    const decreaseBtn = screen.getByRole('button', { name: 'Diminuir valor' });
    const increaseBtn = screen.getByRole('button', { name: 'Aumentar valor' });

    await user.click(increaseBtn);
    expect(inputElement).toHaveValue('6');

    await user.click(decreaseBtn);
    expect(inputElement).toHaveValue('5');
  });

  it('should respect a custom step value', async () => {
    const user = userEvent.setup();
    render(<NumberInput defaultValue={10} step={5} aria-label="Passo Customizado" />);

    const inputElement = screen.getByLabelText('Passo Customizado');
    const increaseBtn = screen.getByRole('button', { name: 'Aumentar valor' });

    await user.click(increaseBtn);
    expect(inputElement).toHaveValue('15');
  });

  it('should disable the decrement button when the min limit is reached', async () => {
    const user = userEvent.setup();
    render(<NumberInput defaultValue={2} min={1} aria-label="Limite Min" />);

    const inputElement = screen.getByLabelText('Limite Min');
    const decreaseBtn = screen.getByRole('button', { name: 'Diminuir valor' });

    await user.click(decreaseBtn);

    expect(inputElement).toHaveValue('1');
    expect(decreaseBtn).toBeDisabled();
  });

  it('should disable the increment button when the max limit is reached', async () => {
    const user = userEvent.setup();
    render(<NumberInput defaultValue={9} max={10} aria-label="Limite Max" />);

    const inputElement = screen.getByLabelText('Limite Max');
    const increaseBtn = screen.getByRole('button', { name: 'Aumentar valor' });

    await user.click(increaseBtn);

    expect(inputElement).toHaveValue('10');
    expect(increaseBtn).toBeDisabled();
  });

  it('should support keyboard navigation using ArrowUp and ArrowDown keys', async () => {
    const user = userEvent.setup();
    render(<NumberInput defaultValue={10} aria-label="Navegação por Teclado" />);

    const inputElement = screen.getByLabelText('Navegação por Teclado');

    await user.click(inputElement);
    await user.keyboard('{ArrowUp}');
    expect(inputElement).toHaveValue('11');

    await user.keyboard('{ArrowDown}');
    expect(inputElement).toHaveValue('10');
  });

  it('should fallback to the min value or zero on blur if the input is left empty', async () => {
    const user = userEvent.setup();
    const { unmount } = render(
      <NumberInput min={5} defaultValue={10} aria-label="Blur Vazio Com Min" />,
    );

    let inputElement = screen.getByLabelText('Blur Vazio Com Min');
    await user.clear(inputElement);
    await user.tab();
    expect(inputElement).toHaveValue('5');

    unmount();

    render(<NumberInput defaultValue={10} aria-label="Blur Vazio Sem Min" />);
    inputElement = screen.getByLabelText('Blur Vazio Sem Min');
    await user.clear(inputElement);
    await user.tab();
    expect(inputElement).toHaveValue('0');
  });

  it('should correct the value to min or max limits on blur if user typed out of bounds', async () => {
    const user = userEvent.setup();
    render(<NumberInput min={5} max={10} aria-label="Correção no Blur" />);

    const inputElement = screen.getByLabelText('Correção no Blur');

    await user.type(inputElement, '2');
    await user.tab();
    expect(inputElement).toHaveValue('5');

    await user.clear(inputElement);
    await user.type(inputElement, '99');
    await user.tab();
    expect(inputElement).toHaveValue('10');
  });

  it('should call onChange, onBlur, and onKeyDown handlers when interacting with the input', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    const handleBlur = vi.fn();
    const handleKeyDown = vi.fn();

    render(
      <NumberInput
        aria-label="Eventos"
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
      />,
    );

    const inputElement = screen.getByLabelText('Eventos');

    await user.type(inputElement, '5');
    expect(handleChange).toHaveBeenCalled();
    expect(handleKeyDown).toHaveBeenCalled();

    await user.tab();
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it('should support callback refs correctly', () => {
    const callbackRef = vi.fn();
    render(<NumberInput ref={callbackRef} aria-label="Callback Ref" />);

    expect(callbackRef).toHaveBeenCalledWith(expect.any(HTMLInputElement));
  });

  it('should act as a controlled component and trigger onChange with corrected value on blur', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    const { rerender } = render(
      <NumberInput value={5} max={10} onChange={handleChange} aria-label="Controlado" />,
    );

    const inputElement = screen.getByLabelText('Controlado');
    expect(inputElement).toHaveValue('5');

    rerender(<NumberInput value={99} max={10} onChange={handleChange} aria-label="Controlado" />);
    expect(inputElement).toHaveValue('99');

    await user.click(inputElement);
    await user.tab();

    expect(handleChange).toHaveBeenCalled();

    // Pegamos a última chamada da função e garantimos o tipo com "unknown" antes
    const lastCallArgs = handleChange.mock.lastCall as unknown as [{ target: { value: string } }];
    expect(lastCallArgs[0].target.value).toBe('10');
  });
});
