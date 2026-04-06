import type { SupportMaterial } from '../schemas/supportMaterialSchema';
import type { CreationSummary } from '../stores/useCreationStore';

export const calculateTotalQuantity = (
  material: SupportMaterial,
  summary: CreationSummary,
): number => {
  if (material.type === 'Digital') return 0;

  let total;

  switch (material.multiplier) {
    case 'Sala':
      total = summary.qtyRooms ?? 0;
      break;
    case 'Turma':
      total = summary.qtySessions ?? 0;
      break;
    case 'Formador':
      total = summary.qtyTrainers ?? 0;
      break;
    case 'Cursista':
      total = summary.qtyPeople ?? 0;
      break;
    case 'Grupo':
      total = material.groupQty ?? 1;
      break;
    default:
      total = 0;
  }

  return material.qty * total;
};
