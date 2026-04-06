import { calculateTotalQuantity } from './calculateTotalQuantity';
import type { SupportMaterial } from '../schemas/supportMaterialSchema';
import type { CreationSummary } from '../stores/useCreationStore';

describe('calculateTotalQuantity', () => {
  const mockSummary: CreationSummary = {
    qtyRooms: 2,
    qtySessions: 3,
    qtyTrainers: 4,
    qtyPeople: 30,
  };

  const baseMaterial = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Material Teste',
    qty: 5,
  };

  it('should return 0 if material type is Digital', () => {
    const digitalMaterial: SupportMaterial = {
      ...baseMaterial,
      type: 'Digital',
      tool: 'Padlet',
      url: 'https://padlet.com',
    };

    const result = calculateTotalQuantity(digitalMaterial, mockSummary);
    expect(result).toBe(0);
  });

  it('should multiply by qtyRooms when multiplier is Sala', () => {
    const material: SupportMaterial = {
      ...baseMaterial,
      type: 'Papelaria',
      multiplier: 'Sala',
    };

    expect(calculateTotalQuantity(material, mockSummary)).toBe(10);
  });

  it('should multiply by qtySessions when multiplier is Turma', () => {
    const material: SupportMaterial = {
      ...baseMaterial,
      type: 'Papelaria',
      multiplier: 'Turma',
    };

    expect(calculateTotalQuantity(material, mockSummary)).toBe(15);
  });

  it('should multiply by qtyTrainers when multiplier is Formador', () => {
    const material: SupportMaterial = {
      ...baseMaterial,
      type: 'Papelaria',
      multiplier: 'Formador',
    };

    expect(calculateTotalQuantity(material, mockSummary)).toBe(20);
  });

  it('should multiply by qtyPeople when multiplier is Cursista', () => {
    const material: SupportMaterial = {
      ...baseMaterial,
      type: 'Papelaria',
      multiplier: 'Cursista',
    };

    expect(calculateTotalQuantity(material, mockSummary)).toBe(150);
  });

  it('should multiply by groupQty when multiplier is Grupo', () => {
    const material: SupportMaterial = {
      ...baseMaterial,
      type: 'Papelaria',
      multiplier: 'Grupo',
      groupQty: 6,
    };

    expect(calculateTotalQuantity(material, mockSummary)).toBe(30);
  });

  it('should fallback to 0 if an unknown multiplier is provided', () => {
    const material = {
      ...baseMaterial,
      type: 'Papelaria',
      multiplier: 'MultiplicadorInvalido',
    };

    // @ts-expect-error: testing switch fallback
    const result = calculateTotalQuantity(material, mockSummary);
    expect(result).toBe(0);
  });

  it('should handle all missing summary values gracefully', () => {
    const emptySummary: CreationSummary = {};

    expect(
      calculateTotalQuantity(
        { ...baseMaterial, type: 'Papelaria', multiplier: 'Sala' } as SupportMaterial,
        emptySummary,
      ),
    ).toBe(0);
    expect(
      calculateTotalQuantity(
        { ...baseMaterial, type: 'Papelaria', multiplier: 'Turma' } as SupportMaterial,
        emptySummary,
      ),
    ).toBe(0);
    expect(
      calculateTotalQuantity(
        { ...baseMaterial, type: 'Papelaria', multiplier: 'Formador' } as SupportMaterial,
        emptySummary,
      ),
    ).toBe(0);
    expect(
      calculateTotalQuantity(
        { ...baseMaterial, type: 'Papelaria', multiplier: 'Cursista' } as SupportMaterial,
        emptySummary,
      ),
    ).toBe(0);

    const groupMaterial: SupportMaterial = {
      ...baseMaterial,
      type: 'Papelaria',
      multiplier: 'Grupo',
    };
    expect(calculateTotalQuantity(groupMaterial, emptySummary)).toBe(5);
  });
});
