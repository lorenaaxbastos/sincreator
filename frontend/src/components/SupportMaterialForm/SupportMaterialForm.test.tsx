import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useCreationStore } from '../../store/useCreationStore';
import { SupportMaterialForm } from './SupportMaterialForm';
import type { SupportMaterial } from '../../schemas/supportMaterialSchema';

vi.mock('../../store/useCreationStore', () => ({
  useCreationStore: vi.fn(),
}));

describe('SupportMaterialForm', () => {
  const addMaterialMock = vi.fn();
  const updateMaterialMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (useCreationStore as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      (selector: (state: Record<string, unknown>) => unknown) => {
        const state = {
          addMaterial: addMaterialMock,
          updateMaterial: updateMaterialMock,
        };
        return selector(state);
      },
    );
  });

  it('should render in Create mode with "Adicionar" button and enabled "Tipo"', () => {
    render(<SupportMaterialForm />);

    expect(screen.getByRole('button', { name: /adicionar/i })).toBeInTheDocument();

    const radioPapelaria = screen.getByLabelText('Papelaria');
    expect(radioPapelaria).not.toBeDisabled();
  });

  it('should render in Edit mode, disable "Tipo" and show "Salvar alterações"', () => {
    const mockInitialData: SupportMaterial = {
      id: '123',
      type: 'Papelaria',
      name: 'Cartolina',
      qty: 10,
      multiplier: 'Sala',
    };

    render(<SupportMaterialForm initialData={mockInitialData} />);

    expect(screen.getByRole('button', { name: /salvar alterações/i })).toBeInTheDocument();

    expect(screen.getByLabelText('Papelaria')).toBeDisabled();
    expect(screen.getByLabelText('Digital')).toBeDisabled();

    expect(screen.getByDisplayValue('Cartolina')).toBeInTheDocument();
  });

  it('should reveal "Quantidade de grupos" when Multiplicador is "Grupo" (Papelaria)', async () => {
    const user = userEvent.setup();
    render(<SupportMaterialForm />);

    const papelariaRadio = screen.getByLabelText('Papelaria');
    await user.click(papelariaRadio);

    const multiplierSelect = await screen.findByLabelText(/Multiplicador/i);
    await user.selectOptions(multiplierSelect, 'Grupo');

    expect(screen.getByLabelText(/Quantos grupos/i)).toBeInTheDocument();
  });

  it('should render Impressão specific fields when "Impressão" is selected', async () => {
    const user = userEvent.setup();
    render(<SupportMaterialForm />);

    const impressaoRadio = screen.getByLabelText('Impressão');
    await user.click(impressaoRadio);

    expect(screen.getByLabelText(/Link para o arquivo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Lados/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Tamanho/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Cor/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Grampear\?/i)).toBeInTheDocument();
  });

  it('should toggle Digital specific fields based on the Tool selected', async () => {
    const user = userEvent.setup();
    render(<SupportMaterialForm />);

    const digitalRadio = screen.getByLabelText('Digital');
    await user.click(digitalRadio);

    expect(screen.queryByLabelText(/Quantidade/i)).not.toBeInTheDocument();

    const toolSelect = screen.getByLabelText(/Ferramenta/i);

    await user.selectOptions(toolSelect, 'Outra');
    expect(screen.getByLabelText(/Qual\?/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/Link de edição/i)).not.toBeInTheDocument();

    await user.selectOptions(toolSelect, 'Kahoot');
    expect(screen.getByLabelText(/Link de edição/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/Link de resultados/i)).not.toBeInTheDocument();

    await user.selectOptions(toolSelect, 'Mentimeter');
    expect(screen.getByLabelText(/Link de edição/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Link de resultados/i)).toBeInTheDocument();
  });

  it('should render exact Papelaria fields when selected, without Impressão or Digital fields', async () => {
    const user = userEvent.setup();
    render(<SupportMaterialForm />);

    const papelariaRadio = screen.getByLabelText('Papelaria');
    await user.click(papelariaRadio);

    expect(await screen.findByLabelText(/Quantidade/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Multiplicador/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Observações/i)).toBeInTheDocument();

    expect(screen.queryByLabelText(/Link para o arquivo/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/Lados/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/Ferramenta/i)).not.toBeInTheDocument();
  });

  it('should display Zod validation errors when submitting invalid data', async () => {
    const user = userEvent.setup();
    render(<SupportMaterialForm />);

    const papelariaRadio = screen.getByLabelText('Papelaria');
    await user.click(papelariaRadio);

    const submitButton = screen.getByRole('button', { name: /adicionar/i });
    await user.click(submitButton);

    expect(
      await screen.findByText(/O nome do material de apoio deve ter pelo menos 3 caracteres/i),
    ).toBeInTheDocument();

    expect(addMaterialMock).not.toHaveBeenCalled();
  });

  it('should reset the form after successful creation', async () => {
    const user = userEvent.setup();
    render(<SupportMaterialForm />);

    const papelariaRadio = screen.getByLabelText('Papelaria');
    await user.click(papelariaRadio);

    const nameInput = screen.getByLabelText('Nome');
    const qtyInput = await screen.findByLabelText(/Quantidade/i);
    const multiplierSelect = screen.getByLabelText(/Multiplicador/i);

    await user.type(nameInput, 'Apagador');
    await user.type(qtyInput, '2');
    await user.selectOptions(multiplierSelect, 'Cursista');

    await user.click(screen.getByRole('button', { name: /adicionar/i }));

    await waitFor(() => {
      expect(addMaterialMock).toHaveBeenCalled();
    });

    expect(nameInput).toHaveValue('');
    expect(screen.queryByLabelText(/Quantidade/i)).not.toBeInTheDocument();
  });

  it('should call addMaterial on successful creation submission', async () => {
    const user = userEvent.setup();
    render(<SupportMaterialForm />);

    const papelariaRadio = screen.getByLabelText('Papelaria');
    await user.click(papelariaRadio);

    const qtyInput = await screen.findByLabelText(/Quantidade/i);
    const nameInput = screen.getByLabelText(/Nome/i);
    const multiplierSelect = screen.getByLabelText(/Multiplicador/i);

    await user.clear(nameInput);
    await user.type(nameInput, 'Canetas');

    await user.clear(qtyInput);
    await user.type(qtyInput, '5');

    await user.selectOptions(multiplierSelect, 'Sala');

    await user.click(screen.getByRole('button', { name: /adicionar/i }));

    await waitFor(() => {
      expect(addMaterialMock).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Canetas',
          type: 'Papelaria',
          qty: 5,
          multiplier: 'Sala',
          id: expect.any(String) as unknown,
        }) as unknown,
      );
    });
  });

  it('should call updateMaterial on successful edit submission', async () => {
    const user = userEvent.setup();
    const validUUID = '123e4567-e89b-12d3-a456-426614174000';

    const mockInitialData: SupportMaterial = {
      id: validUUID,
      type: 'Papelaria',
      name: 'Cartolina',
      qty: 10,
      multiplier: 'Sala',
    };

    render(<SupportMaterialForm initialData={mockInitialData} />);

    const nameInput = screen.getByLabelText(/Nome/i);
    await user.clear(nameInput);
    await user.type(nameInput, 'Cartolina Azul');

    const qtyInput = screen.getByLabelText(/Quantidade/i);
    await user.clear(qtyInput);
    await user.type(qtyInput, '10');

    await user.click(screen.getByRole('button', { name: /salvar alterações/i }));

    await waitFor(() => {
      expect(updateMaterialMock).toHaveBeenCalledWith(
        validUUID,
        expect.objectContaining({
          id: validUUID,
          name: 'Cartolina Azul',
        }) as unknown,
      );
    });
  });
});
