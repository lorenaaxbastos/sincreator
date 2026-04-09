import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RadioGroup } from './RadioGroup';
import styles from './RadioGroup.module.css';

const mockOptions = [
  { label: 'Opção 1', value: '1' },
  { label: 'Opção 2', value: '2' },
  { label: 'Opção 3', value: '3' },
];

describe('RadioGroup', () => {
  it('should render all radio options provided via the options array', () => {
    render(<RadioGroup name="test_group" options={mockOptions} aria-label="Grupo" />);

    expect(screen.getByLabelText('Opção 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Opção 2')).toBeInTheDocument();
    expect(screen.getByLabelText('Opção 3')).toBeInTheDocument();
  });

  it('should apply the same name attribute to all radio inputs to group them', () => {
    render(<RadioGroup name="shared_name" options={mockOptions} aria-label="Grupo" />);

    const radios = screen.getAllByRole('radio');
    radios.forEach(radio => {
      expect(radio).toHaveAttribute('name', 'shared_name');
    });
  });

  it('should support ReactNode as a label', () => {
    const customOptions = [
      { label: <span data-testid="custom-label">Label Customizado</span>, value: 'custom' },
    ];
    render(<RadioGroup name="custom" options={customOptions} aria-label="Grupo" />);

    expect(screen.getByTestId('custom-label')).toBeInTheDocument();
  });

  it('should forward the ref correctly to the input elements', () => {
    const ref = createRef<HTMLInputElement>();
    render(<RadioGroup name="ref_test" options={mockOptions} ref={ref} aria-label="Grupo" />);

    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe('INPUT');
    expect(ref.current?.type).toBe('radio');
  });

  it('should support callback refs correctly', () => {
    const callbackRef = vi.fn();
    render(
      <RadioGroup
        name="callback_test"
        options={mockOptions}
        ref={callbackRef}
        aria-label="Grupo"
      />,
    );

    expect(callbackRef).toHaveBeenCalledWith(expect.any(HTMLInputElement));
  });

  it('should disable all inputs when the group-level disabled prop is true', () => {
    render(<RadioGroup name="disabled_group" options={mockOptions} disabled aria-label="Grupo" />);

    const radios = screen.getAllByRole('radio');
    radios.forEach(radio => {
      expect(radio).toBeDisabled();
    });
  });

  it('should disable only specific inputs when the disabled property is set inside the option', () => {
    const partialDisabledOptions = [
      { label: 'Ativo', value: 'active' },
      { label: 'Inativo', value: 'inactive', disabled: true },
    ];

    render(
      <RadioGroup name="partial_disabled" options={partialDisabledOptions} aria-label="Grupo" />,
    );

    expect(screen.getByLabelText('Ativo')).not.toBeDisabled();
    expect(screen.getByLabelText('Inativo')).toBeDisabled();
  });

  it('should apply the correct orientation class (vertical vs horizontal)', () => {
    const { container: verticalContainer } = render(
      <RadioGroup name="vertical" options={mockOptions} aria-label="Vertical" />,
    );
    expect(verticalContainer.firstChild).toHaveClass(styles.vertical);

    const { container: horizontalContainer } = render(
      <RadioGroup
        name="horizontal"
        options={mockOptions}
        orientation="horizontal"
        aria-label="Horizontal"
      />,
    );
    expect(horizontalContainer.firstChild).toHaveClass(styles.horizontal);
  });

  it('should apply error styles when hasError is true', () => {
    const { container } = render(
      <RadioGroup name="error_test" options={mockOptions} hasError aria-label="Erro" />,
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass(styles.error);
  });

  it('should act as an uncontrolled component by respecting defaultValue', () => {
    render(
      <RadioGroup name="uncontrolled" options={mockOptions} defaultValue="2" aria-label="Grupo" />,
    );

    expect(screen.getByLabelText('Opção 2')).toBeChecked();
    expect(screen.getByLabelText('Opção 1')).not.toBeChecked();
  });

  it('should act as a controlled component and trigger onChange when an option is selected', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    const { rerender } = render(
      <RadioGroup
        name="controlled"
        options={mockOptions}
        value="1"
        onChange={handleChange}
        aria-label="Grupo"
      />,
    );

    expect(screen.getByLabelText('Opção 1')).toBeChecked();

    rerender(
      <RadioGroup
        name="controlled"
        options={mockOptions}
        value="3"
        onChange={handleChange}
        aria-label="Grupo"
      />,
    );
    expect(screen.getByLabelText('Opção 3')).toBeChecked();

    await user.click(screen.getByLabelText('Opção 2'));

    expect(handleChange).toHaveBeenCalled();
  });

  it('should be accessible by wrapping inputs in a role="radiogroup"', () => {
    render(<RadioGroup name="a11y" options={mockOptions} aria-label="Escolha uma opção" />);

    const group = screen.getByRole('radiogroup', { name: 'Escolha uma opção' });
    expect(group).toBeInTheDocument();
  });

  it('should update internal state when clicked (uncontrolled) and handle missing onChange', async () => {
    const user = userEvent.setup();
    render(
      <RadioGroup
        name="uncontrolled_click"
        options={mockOptions}
        aria-label="Grupo Uncontrolled"
      />,
    );

    const option2 = screen.getByLabelText('Opção 2');

    await user.click(option2);

    expect(option2).toBeChecked();
  });
});
