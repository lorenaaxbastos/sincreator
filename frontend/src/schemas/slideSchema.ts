import { z } from 'zod';
import { urlValidationRule } from './sharedSchemas';
import { supportMaterialSchema } from './supportMaterialSchema';

export const slideLayoutEnum = z.enum(
  [
    'TEXT',
    'TEXT_MULTIMEDIA',
    'MULTIMEDIA',
    'TABLE',
    'QR_CODE',
    'TEXT_QR_CODE',
    'TWO_COLUMNS',
    'THREE_COLUMNS',
    'QUOTE',
    'TITLE_ONLY',
    'COVER',
    'AGENDA',
    'PRESENTER_INTRO',
    'COMPANY_INTRO',
    'OBJECTIVES',
    'TIPS',
    'BREAK',
    'TRANSITION',
    'EVALUATION',
    'CLOSING',
  ],
  'Tipo de layout inválido',
);

export type SlideLayout = z.infer<typeof slideLayoutEnum>;

const baseSlideShape = {
  id: z.uuid('ID inválido'),
  title: z.string().trim().min(1, 'O título é obrigatório').max(120, 'O título está muito longo'),
  duration: z.number().min(0, 'A duração não pode ser negativa'),
  formativeOrientations: z.string().trim().optional(),
  presenterNotes: z.string().trim().optional(),
  supportMaterials: z.array(supportMaterialSchema).default([]),
};

const baseSlideSchema = z.object(baseSlideShape);

const contentShape = {
  content: z.string().trim().min(1, 'O conteúdo é obrigatório'),
};

const mediaShape = {
  mediaUrl: z.union(
    [
      urlValidationRule,
      z.custom<File>(
        val => typeof window !== 'undefined' && val instanceof File,
        'Insira uma URL válida ou faça o upload de um arquivo',
      ),
    ],
    'A mídia é obrigatória (URL ou Arquivo)',
  ),
};

const qrCodeShape = {
  qrCodeUrl: urlValidationRule,
};

const quoteShape = {
  quoteText: z.string().trim().min(1, 'A citação é obrigatória').max(500, 'Citação muito longa'),
  quoteAuthor: z.string().trim().optional(),
};

const textSlideSchema = baseSlideSchema
  .extend(contentShape)
  .extend({ layout: z.literal('TEXT') })
  .strict();

const multimediaSlideSchema = baseSlideSchema
  .extend(mediaShape)
  .extend({
    layout: z.literal('MULTIMEDIA'),
    fullScreen: z.boolean().default(false),
  })
  .strict();

const textMultimediaSlideSchema = baseSlideSchema
  .extend(contentShape)
  .extend(mediaShape)
  .extend({ layout: z.literal('TEXT_MULTIMEDIA') })
  .strict();

const tableSlideSchema = baseSlideSchema
  .extend(contentShape)
  .extend({ layout: z.literal('TABLE') })
  .strict();

const qrCodeSlideSchema = baseSlideSchema
  .extend(qrCodeShape)
  .extend({ layout: z.literal('QR_CODE') })
  .strict();

const textQrCodeSlideSchema = baseSlideSchema
  .extend(contentShape)
  .extend(qrCodeShape)
  .extend({ layout: z.literal('TEXT_QR_CODE') })
  .strict();

const twoColumnsSlideSchema = baseSlideSchema
  .extend({
    leftContent: z.string().trim().min(1, 'Coluna esquerda obrigatória'),
    rightContent: z.string().trim().min(1, 'Coluna direita obrigatória'),
    layout: z.literal('TWO_COLUMNS'),
  })
  .strict();

const threeColumnsSlideSchema = baseSlideSchema
  .extend({
    leftContent: z.string().trim().min(1, 'Coluna esquerda obrigatória'),
    middleContent: z.string().trim().min(1, 'Coluna central obrigatória'),
    rightContent: z.string().trim().min(1, 'Coluna direita obrigatória'),
    layout: z.literal('THREE_COLUMNS'),
  })
  .strict();

const quoteSlideSchema = baseSlideSchema
  .extend(quoteShape)
  .extend({ layout: z.literal('QUOTE') })
  .strict();

const titleOnlySlideSchema = baseSlideSchema.extend({ layout: z.literal('TITLE_ONLY') }).strict();

const coverSlideSchema = baseSlideSchema.extend({ layout: z.literal('COVER') }).strict();

const agendaSlideSchema = baseSlideSchema.extend({ layout: z.literal('AGENDA') }).strict();

const presenterIntroSlideSchema = baseSlideSchema
  .extend({ layout: z.literal('PRESENTER_INTRO') })
  .strict();

const companyIntroSlideSchema = baseSlideSchema
  .extend({ layout: z.literal('COMPANY_INTRO') })
  .strict();

const objectivesSlideSchema = baseSlideSchema
  .extend(contentShape)
  .extend({ layout: z.literal('OBJECTIVES') })
  .strict();

const tipsSlideSchema = baseSlideSchema
  .extend(contentShape)
  .extend({ layout: z.literal('TIPS') })
  .strict();

const breakSlideSchema = baseSlideSchema.extend({ layout: z.literal('BREAK') }).strict();

const transitionSlideSchema = baseSlideSchema.extend({ layout: z.literal('TRANSITION') }).strict();

const evaluationSlideSchema = baseSlideSchema
  .extend({
    qrCodeUrl: urlValidationRule,
    layout: z.literal('EVALUATION'),
  })
  .strict();

const closingSlideSchema = baseSlideSchema
  .extend(contentShape)
  .extend({ layout: z.literal('CLOSING') })
  .strict();

export const slideSchema = z.discriminatedUnion(
  'layout',
  [
    textSlideSchema,
    multimediaSlideSchema,
    textMultimediaSlideSchema,
    tableSlideSchema,
    qrCodeSlideSchema,
    textQrCodeSlideSchema,
    twoColumnsSlideSchema,
    threeColumnsSlideSchema,
    quoteSlideSchema,
    titleOnlySlideSchema,
    coverSlideSchema,
    agendaSlideSchema,
    presenterIntroSlideSchema,
    companyIntroSlideSchema,
    objectivesSlideSchema,
    tipsSlideSchema,
    breakSlideSchema,
    transitionSlideSchema,
    evaluationSlideSchema,
    closingSlideSchema,
  ],
  {
    error: iss => {
      const input = iss.input as { layout?: unknown } | undefined;
      if (input?.layout === undefined) return 'A escolha do layout é obrigatória';
      return 'Layout de slide inválido';
    },
  },
);

export type SlideData = z.infer<typeof slideSchema>;
