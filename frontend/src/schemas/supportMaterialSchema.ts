import { z } from 'zod';
import { urlValidationRule } from './sharedSchemas';

interface DistributionValidationData {
  multiplier: string;
  groupQty?: number;
}

const baseMaterialSchema = z.object({
  id: z.uuid('ID inválido'),
  name: z
    .string()
    .trim()
    .min(3, 'O nome do material de apoio deve ter pelo menos 3 caracteres')
    .max(255, 'O nome do material de apoio deve ter no máximo 255 caracteres.'),
});

const distributionShape = {
  qty: z
    .number()
    .min(1, 'Quantidade deve ser maior que zero')
    .max(9999, 'Quantidade deve ser menor que 10.000'),
  multiplier: z.enum(['Cursista', 'Formador', 'Sala', 'Turma', 'Grupo'], 'Multiplicador inválido'),
  groupQty: z.number().min(2, 'Deve haver no mínimo 2 grupos').optional(),
  notes: z
    .string()
    .trim()
    .min(2, 'As observações devem ter um mínimo de 2 caracteres')
    .max(500, 'As observações devem ter um máximo de 500 caracteres')
    .optional()
    .or(z.literal('')),
};

const validateGroupMultiplier = (data: DistributionValidationData, ctx: z.RefinementCtx) => {
  if (data.multiplier === 'Grupo' && data.groupQty === undefined) {
    ctx.addIssue({
      code: 'custom',
      message: 'A quantidade de grupos é obrigatória quando o multiplicador é grupo',
      path: ['groupQty'],
    });
  }

  if (data.multiplier !== 'Grupo' && data.groupQty !== undefined) {
    ctx.addIssue({
      code: 'custom',
      message: 'A quantidade de grupos não deve ser preenchida para este multiplicador',
      path: ['groupQty'],
    });
  }
};

export const distributionSchema = z.object(distributionShape).superRefine(validateGroupMultiplier);

const stationerySchema = baseMaterialSchema
  .extend(distributionShape)
  .extend({
    type: z.literal('Papelaria'),
  })
  .strict()
  .superRefine(validateGroupMultiplier);

const printSchema = baseMaterialSchema
  .extend(distributionShape)
  .extend({
    url: urlValidationRule,
    type: z.literal('Impressão'),
    sides: z.enum(['Frente', 'Frente e verso'], 'Tipo de impressão inválida'),
    size: z.enum(['A1', 'A2', 'A3', 'A4', 'A5'], 'Tamanho inválido'),
    color: z.enum(['Colorido', 'Preto e branco'], 'Cor inválida'),
    staple: z.boolean(),
  })
  .strict()
  .superRefine(validateGroupMultiplier);

const digitalSchema = baseMaterialSchema
  .extend({
    url: urlValidationRule,
    type: z.literal('Digital'),
    tool: z.enum(
      ['Padlet', 'Mentimeter', 'Quizizz', 'Kahoot', 'Site', 'Outro'],
      'Ferramenta inválida',
    ),
    otherToolName: z
      .string()
      .trim()
      .min(2, 'O nome da ferramenta deve ter pelo menos 2 caracteres')
      .max(100, 'O nome da ferramenta deve ter no máximo 100 caracteres')
      .optional(),
    editUrl: urlValidationRule.optional(),
    resultsUrl: urlValidationRule.optional(),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (data.tool === 'Outro' && !data.otherToolName) {
      ctx.addIssue({
        code: 'custom',
        message: 'Informe a ferramenta',
        path: ['otherToolName'],
      });
    }

    if (data.tool !== 'Outro' && data.otherToolName !== undefined) {
      ctx.addIssue({
        code: 'custom',
        message: 'Este campo não pertence a esta ferramenta',
        path: ['otherToolName'],
      });
    }

    if (data.tool === 'Mentimeter') {
      if (!data.editUrl) {
        ctx.addIssue({
          code: 'custom',
          message: 'Link de edição é obrigatório',
          path: ['editUrl'],
        });
      }

      if (!data.resultsUrl) {
        ctx.addIssue({
          code: 'custom',
          message: 'Link de resultados é obrigatório',
          path: ['resultsUrl'],
        });
      }
    }

    if (data.tool === 'Quizizz' || data.tool === 'Kahoot') {
      if (!data.editUrl) {
        ctx.addIssue({
          code: 'custom',
          message: 'Link de edição é obrigatório',
          path: ['editUrl'],
        });
      }
    }

    if (
      data.tool !== 'Mentimeter' &&
      data.tool !== 'Quizizz' &&
      data.tool !== 'Kahoot' &&
      data.editUrl !== undefined
    ) {
      ctx.addIssue({
        code: 'custom',
        message: 'Este campo não pertence a esta ferramenta',
        path: ['editUrl'],
      });
    }

    if (data.tool !== 'Mentimeter' && data.resultsUrl !== undefined) {
      ctx.addIssue({
        code: 'custom',
        message: 'Este campo não pertence a esta ferramenta',
        path: ['resultsUrl'],
      });
    }
  });

export const supportMaterialSchema = z.discriminatedUnion(
  'type',
  [stationerySchema, printSchema, digitalSchema],
  {
    error: iss => {
      const input = iss.input as { type?: unknown } | undefined;

      if (input?.type === undefined) return 'Tipo é obrigatório';
      return 'Tipo inválido';
    },
  },
);

export type SupportMaterial = z.infer<typeof supportMaterialSchema>;
