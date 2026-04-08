import { render, screen } from '@testing-library/react';
import { FieldWrapper } from './FieldWrapper';

describe('FieldWrapper', () => {
  it('should render the label correctly linked to the child input', () => {
    render(
      <FieldWrapper id="test-id" label="Meu Campo">
        <input id="test-id" data-testid="child-input" />
      </FieldWrapper>,
    );

    const linkedInput = screen.getByLabelText('Meu Campo');
    const childElement = screen.getByTestId('child-input');

    expect(linkedInput).toBeInTheDocument();
    expect(linkedInput).toBe(childElement);
  });

  it('should render the error message and generate the correct error ID when error prop is provided', () => {
    const errorMessage = 'Ocorreu um erro de validação';
    render(
      <FieldWrapper id="test-error-id" label="Campo com Erro" error={errorMessage}>
        <input id="test-error-id" />
      </FieldWrapper>,
    );

    const errorText = screen.getByText(errorMessage);

    expect(errorText).toBeInTheDocument();
    expect(errorText).toHaveAttribute('id', 'test-error-id-error');
  });

  it('should not render the error span if error prop is undefined', () => {
    const { container } = render(
      <FieldWrapper id="test-no-error" label="Sem Erro">
        <input id="test-no-error" />
      </FieldWrapper>,
    );

    const errorSpan = container.querySelector('span[id$="-error"]');
    expect(errorSpan).not.toBeInTheDocument();
  });

  it('should not render the error span if error prop is an empty string', () => {
    const { container } = render(
      <FieldWrapper id="test-empty-error" label="Erro Vazio" error="">
        <input id="test-empty-error" />
      </FieldWrapper>,
    );

    const errorSpan = container.querySelector('span[id$="-error"]');
    expect(errorSpan).not.toBeInTheDocument();
  });
});
