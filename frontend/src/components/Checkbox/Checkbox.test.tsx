import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Checkbox } from './Checkbox';
import styles from './Checkbox.module.css';

describe('Checkbox', () => {
  it('should generate an ID automatically if no ID is provided', () => {
    render(<Checkbox label="Termos de uso" />);

    const checkboxElement = screen.getByLabelText('Termos de uso');

    const generatedId = checkboxElement.getAttribute('id');
    expect(generatedId).toBeTruthy();
  });

  it('should respect provided ID and link error message accordingly', () => {
    render(<Checkbox id="aceite-termos" label="Aceito" hasError />);

    const checkboxElement = screen.getByLabelText('Aceito');

    expect(checkboxElement).toHaveAttribute('id', 'aceite-termos');
    expect(checkboxElement).toHaveAttribute('aria-errormessage', 'aceite-termos-error');
  });

  it('should render the checkbox with a text label', () => {
    render(<Checkbox label="Aceitar termos" />);

    const checkbox = screen.getByLabelText('Aceitar termos');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toHaveAttribute('type', 'checkbox');
  });

  it('should render the checkbox without a label when only aria-label is provided', () => {
    const { container } = render(<Checkbox aria-label="Apenas o quadrado" />);

    const checkbox = screen.getByLabelText('Apenas o quadrado');
    const labelElement = container.querySelector(`.${styles.label}`);

    expect(checkbox).toBeInTheDocument();
    expect(labelElement).not.toBeInTheDocument();
  });

  it('should support ReactNode as a label', () => {
    const customLabel = (
      <span data-testid="custom-label">
        Aceito a <a href="/politica">Política de Privacidade</a>
      </span>
    );
    render(<Checkbox label={customLabel} />);

    expect(screen.getByTestId('custom-label')).toBeInTheDocument();
  });

  it('should forward the ref correctly to the input element', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Checkbox label="Ref Test" ref={ref} />);

    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe('INPUT');
    expect(ref.current?.type).toBe('checkbox');
  });

  it('should support callback refs correctly', () => {
    const callbackRef = vi.fn();
    render(<Checkbox label="Callback Ref Test" ref={callbackRef} />);

    expect(callbackRef).toHaveBeenCalledWith(expect.any(HTMLInputElement));
  });

  it('should act as an uncontrolled component by respecting defaultChecked', () => {
    render(<Checkbox label="Uncontrolled" defaultChecked />);

    const checkbox = screen.getByLabelText('Uncontrolled');
    expect(checkbox).toBeChecked();
  });

  it('should toggle state when clicked in uncontrolled mode', async () => {
    const user = userEvent.setup();
    render(<Checkbox label="Toggle Test" />);

    const checkbox = screen.getByLabelText('Toggle Test');
    expect(checkbox).not.toBeChecked();

    await user.click(checkbox);
    expect(checkbox).toBeChecked();

    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it('should act as a controlled component and trigger onChange when clicked', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    const { rerender } = render(
      <Checkbox label="Controlled" checked={false} onChange={handleChange} />,
    );

    const checkbox = screen.getByLabelText('Controlled');
    expect(checkbox).not.toBeChecked();

    await user.click(checkbox);
    expect(handleChange).toHaveBeenCalledTimes(1);

    rerender(<Checkbox label="Controlled" checked={true} onChange={handleChange} />);
    expect(checkbox).toBeChecked();
  });

  it('should apply the indeterminate property correctly to the DOM element', () => {
    render(<Checkbox label="Indeterminate Test" indeterminate />);

    const checkbox = screen.getByLabelText('Indeterminate Test');

    expect(checkbox).toHaveProperty('indeterminate', true);
  });

  it('should disable the checkbox when disabled is true', () => {
    render(<Checkbox label="Disabled Test" disabled />);

    const checkbox = screen.getByLabelText('Disabled Test');
    expect(checkbox).toBeDisabled();
  });

  it('should apply error styles when hasError is true', () => {
    const { container } = render(<Checkbox label="Error Test" hasError />);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass(styles.error);
  });

  it('should support keyboard accessibility (toggling via Space key)', async () => {
    const user = userEvent.setup();
    render(<Checkbox label="Keyboard Test" />);

    const checkbox = screen.getByLabelText('Keyboard Test');

    await user.tab();
    expect(checkbox).toHaveFocus();

    await user.keyboard(' ');
    expect(checkbox).toBeChecked();
  });
});
