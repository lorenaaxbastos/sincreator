import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select } from './Select';
import styles from './Select.module.css';

describe('Select', () => {
  const mockOptions = [
    { value: 'A1', label: 'Formato A1' },
    { value: 'A2', label: 'Formato A2' },
  ];

  it('should render the select element with placeholder and options', () => {
    render(<Select id="meu-select" options={mockOptions} placeholder="Escolha um formato" />);

    const selectElement = screen.getByRole('combobox');
    const placeholderOption = screen.getByRole('option', {
      name: 'Escolha um formato',
    });
    const optionA1 = screen.getByRole('option', { name: 'Formato A1' });

    expect(selectElement).toBeInTheDocument();
    expect(selectElement).toHaveAttribute('id', 'meu-select');
    expect(placeholderOption).toBeInTheDocument();
    expect(placeholderOption).toBeDisabled();
    expect(optionA1).toBeInTheDocument();
  });

  it('should initialize with the correct defaultValue', () => {
    render(<Select options={mockOptions} defaultValue="A2" aria-label="Formatos Default" />);

    const selectElement = screen.getByLabelText('Formatos Default');

    expect(selectElement).toHaveValue('A2');
  });

  it('should render correctly without a placeholder', () => {
    render(<Select id="no-placeholder" options={mockOptions} />);

    const hiddenOptions = screen.queryAllByRole('option', { hidden: true });

    const placeholder = hiddenOptions.find(opt => opt.getAttribute('value') === '');

    expect(placeholder).toBeUndefined();
    expect(screen.getByRole('option', { name: 'Formato A1' })).toBeInTheDocument();
  });

  it('should generate an ID automatically if no ID is provided', () => {
    render(<Select options={mockOptions} aria-label="Select Automático" />);

    const selectElement = screen.getByLabelText('Select Automático');

    expect(selectElement).toBeInTheDocument();
    expect(selectElement.getAttribute('id')).toBeTruthy();
  });

  it('should forward the ref correctly to the select element', () => {
    const ref = createRef<HTMLSelectElement>();
    render(<Select options={mockOptions} ref={ref} />);

    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe('SELECT');
  });

  it('should allow the user to select an option', async () => {
    const user = userEvent.setup();
    render(<Select options={mockOptions} aria-label="Formatos" />);

    const selectElement = screen.getByLabelText('Formatos');

    await user.selectOptions(selectElement, 'A2');

    expect(selectElement).toHaveValue('A2');
  });

  it('should apply accessibility attributes and styles when hasError is true', () => {
    render(<Select id="error-select" options={mockOptions} hasError={true} />);

    const selectElement = screen.getByRole('combobox');

    expect(selectElement).toHaveAttribute('aria-invalid', 'true');
    expect(selectElement).toHaveAttribute('aria-errormessage', 'error-select-error');
    expect(selectElement).toHaveClass(styles.error);
  });

  it('should have the correct aria-errormessage linking to the error id', () => {
    const selectId = 'test-select';
    render(<Select id={selectId} options={mockOptions} hasError={true} />);

    const selectElement = screen.getByRole('combobox');

    expect(selectElement).toHaveAttribute('aria-errormessage', `${selectId}-error`);
  });

  it('should be disabled when the disabled prop is true', () => {
    render(<Select options={mockOptions} disabled={true} />);

    const selectElement = screen.getByRole('combobox');

    expect(selectElement).toBeDisabled();
  });

  it('should trigger onFocus and onBlur events', async () => {
    const user = userEvent.setup();
    const handleFocus = vi.fn();
    const handleBlur = vi.fn();

    render(
      <Select
        options={mockOptions}
        onFocus={handleFocus}
        onBlur={handleBlur}
        aria-label="Eventos"
      />,
    );

    const selectElement = screen.getByLabelText('Eventos');

    await user.click(selectElement);
    expect(handleFocus).toHaveBeenCalledTimes(1);

    await user.tab();
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });
});
