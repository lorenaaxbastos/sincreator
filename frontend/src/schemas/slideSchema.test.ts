import { slideSchema } from './slideSchema';

describe('slideSchema validation', () => {
  const baseMock = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    title: 'Título do Slide',
    duration: 15,
    layout: 'TITLE_ONLY',
  };

  describe('Base validation & Discriminator', () => {
    it('should validate a correct base slide (TITLE_ONLY)', () => {
      const result = slideSchema.safeParse(baseMock);
      expect(result.success).toBe(true);
    });

    it('should validate base slide with optional fields (notes, orientations, materials)', () => {
      const validData = {
        ...baseMock,
        formativeOrientations: 'Orientação importante',
        presenterNotes: 'Falar com entusiasmo',
        supportMaterials: [],
      };
      const result = slideSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should fail if a not allowed field is present (strict mode)', () => {
      const strictInvalidData: unknown = { ...baseMock, test: true };
      const result = slideSchema.safeParse(strictInvalidData);
      expect(result.success).toBe(false);
    });

    it('should fail if id is not a valid UUID', () => {
      const invalidIdData = { ...baseMock, id: '12345' };
      const result = slideSchema.safeParse(invalidIdData);

      expect(result.success).toBe(false);
      if (!result.success) expect(result.error.issues[0].path[0]).toBe('id');
    });

    it('should fail if title is missing, empty, or only spaces', () => {
      const emptyTitleData = { ...baseMock, title: '' };
      const resultEmpty = slideSchema.safeParse(emptyTitleData);
      expect(resultEmpty.success).toBe(false);

      const spacesTitleData = { ...baseMock, title: '    ' };
      const resultSpaces = slideSchema.safeParse(spacesTitleData);
      expect(resultSpaces.success).toBe(false);

      const { title: _title, ...missingTitleData } = baseMock;
      const resultMissing = slideSchema.safeParse(missingTitleData);
      expect(resultMissing.success).toBe(false);
    });

    it('should fail if title has more than 120 characters', () => {
      const longTitleData = { ...baseMock, title: 'A'.repeat(121) };
      const result = slideSchema.safeParse(longTitleData);

      expect(result.success).toBe(false);
      if (!result.success) expect(result.error.issues[0].path[0]).toBe('title');
    });

    it('should fail if duration is negative', () => {
      const negativeDurationData = { ...baseMock, duration: -1 };
      const result = slideSchema.safeParse(negativeDurationData);

      expect(result.success).toBe(false);
      if (!result.success) expect(result.error.issues[0].path[0]).toBe('duration');
    });

    it('should allow duration to be 0', () => {
      const zeroDurationData = { ...baseMock, duration: 0 };
      const result = slideSchema.safeParse(zeroDurationData);
      expect(result.success).toBe(true);
    });

    it('should fail if layout is missing', () => {
      const { layout: _layout, ...missingLayoutData } = baseMock;
      const result = slideSchema.safeParse(missingLayoutData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('A escolha do layout é obrigatória');
      }
    });

    it('should fail if layout is invalid', () => {
      const invalidLayoutData = { ...baseMock, layout: 'INVALID_LAYOUT' };
      const result = slideSchema.safeParse(invalidLayoutData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Layout de slide inválido');
      }
    });
  });

  describe('Layouts with Content (e.g. TEXT, TABLE)', () => {
    it('should validate a correct TEXT slide', () => {
      const validTextData = { ...baseMock, layout: 'TEXT', content: '<p>Olá mundo</p>' };
      const result = slideSchema.safeParse(validTextData);
      expect(result.success).toBe(true);
    });

    it('should fail if content is missing or empty on TEXT slide', () => {
      const missingContentData = { ...baseMock, layout: 'TEXT' };
      const resultMissing = slideSchema.safeParse(missingContentData);
      expect(resultMissing.success).toBe(false);
      if (!resultMissing.success) expect(resultMissing.error.issues[0].path[0]).toBe('content');

      const emptyContentData = { ...baseMock, layout: 'TEXT', content: '   ' };
      const resultEmpty = slideSchema.safeParse(emptyContentData);
      expect(resultEmpty.success).toBe(false);
    });
  });

  describe('Layouts with Media (e.g. MULTIMEDIA, TEXT_MULTIMEDIA)', () => {
    it('should validate a correct MULTIMEDIA slide with URL', () => {
      const validMediaData = {
        ...baseMock,
        layout: 'MULTIMEDIA',
        mediaUrl: 'https://youtube.com/video',
      };
      const result = slideSchema.safeParse(validMediaData);
      expect(result.success).toBe(true);
    });

    it('should apply fullScreen default to false if omitted', () => {
      const defaultMediaData = {
        ...baseMock,
        layout: 'MULTIMEDIA',
        mediaUrl: 'https://youtube.com/video',
      };
      const result = slideSchema.safeParse(defaultMediaData);

      expect(result.success).toBe(true);
      if (result.success && result.data.layout === 'MULTIMEDIA') {
        expect(result.data.fullScreen).toBe(false);
      }
    });

    it('should fail if mediaUrl is missing or invalid on MULTIMEDIA slide', () => {
      const missingMediaUrlData = { ...baseMock, layout: 'MULTIMEDIA' };
      const resultMissing = slideSchema.safeParse(missingMediaUrlData);
      expect(resultMissing.success).toBe(false);
      if (!resultMissing.success) expect(resultMissing.error.issues[0].path[0]).toBe('mediaUrl');

      const invalidMediaUrlData = { ...baseMock, layout: 'MULTIMEDIA', mediaUrl: 'not-a-url' };
      const resultInvalid = slideSchema.safeParse(invalidMediaUrlData);
      expect(resultInvalid.success).toBe(false);
    });

    it('should fail if content or mediaUrl is missing on TEXT_MULTIMEDIA slide', () => {
      const missingContentData = {
        ...baseMock,
        layout: 'TEXT_MULTIMEDIA',
        mediaUrl: 'https://imagem.com/img.png',
      };
      const resultMissingContent = slideSchema.safeParse(missingContentData);
      expect(resultMissingContent.success).toBe(false);
      if (!resultMissingContent.success)
        expect(resultMissingContent.error.issues[0].path[0]).toBe('content');

      const missingMediaData = {
        ...baseMock,
        layout: 'TEXT_MULTIMEDIA',
        content: 'Texto',
      };
      const resultMissingMedia = slideSchema.safeParse(missingMediaData);
      expect(resultMissingMedia.success).toBe(false);
      if (!resultMissingMedia.success)
        expect(resultMissingMedia.error.issues[0].path[0]).toBe('mediaUrl');
    });

    it('should validate a TEXT_MULTIMEDIA when both content and mediaUrl are present', () => {
      const validTextMediaData = {
        ...baseMock,
        layout: 'TEXT_MULTIMEDIA',
        content: 'Texto',
        mediaUrl: 'https://imagem.com/img.png',
      };
      const result = slideSchema.safeParse(validTextMediaData);
      expect(result.success).toBe(true);
    });
  });

  describe('Layouts with Columns', () => {
    it('should validate TWO_COLUMNS requires leftContent and rightContent', () => {
      const validTwoColData = {
        ...baseMock,
        layout: 'TWO_COLUMNS',
        leftContent: 'Esq',
        rightContent: 'Dir',
      };
      expect(slideSchema.safeParse(validTwoColData).success).toBe(true);

      const invalidTwoColData = { ...baseMock, layout: 'TWO_COLUMNS', leftContent: 'Esq' };
      const result = slideSchema.safeParse(invalidTwoColData);
      expect(result.success).toBe(false);
      if (!result.success) expect(result.error.issues[0].path[0]).toBe('rightContent');
    });

    it('should validate THREE_COLUMNS requires left, middle and right', () => {
      const validThreeColData = {
        ...baseMock,
        layout: 'THREE_COLUMNS',
        leftContent: 'Esq',
        middleContent: 'Meio',
        rightContent: 'Dir',
      };
      expect(slideSchema.safeParse(validThreeColData).success).toBe(true);

      const invalidThreeColData = {
        ...baseMock,
        layout: 'THREE_COLUMNS',
        leftContent: 'Esq',
        rightContent: 'Dir',
      };
      expect(slideSchema.safeParse(invalidThreeColData).success).toBe(false);
    });
  });

  describe('Special Content Layouts (QUOTE, QR_CODE)', () => {
    it('should validate QUOTE with and without author', () => {
      const withoutAuthorData = { ...baseMock, layout: 'QUOTE', quoteText: 'Ser ou não ser' };
      expect(slideSchema.safeParse(withoutAuthorData).success).toBe(true);

      const withAuthorData = { ...withoutAuthorData, quoteAuthor: 'Shakespeare' };
      expect(slideSchema.safeParse(withAuthorData).success).toBe(true);
    });

    it('should fail if quoteText is missing or longer than 500 characters', () => {
      const missingQuoteData = { ...baseMock, layout: 'QUOTE' };
      const resultMissing = slideSchema.safeParse(missingQuoteData);
      expect(resultMissing.success).toBe(false);

      const longQuoteData = { ...baseMock, layout: 'QUOTE', quoteText: 'A'.repeat(501) };
      const resultLong = slideSchema.safeParse(longQuoteData);
      expect(resultLong.success).toBe(false);
    });

    it('should validate QR_CODE and TEXT_QR_CODE requires qrCodeUrl', () => {
      const validQrData = { ...baseMock, layout: 'QR_CODE', qrCodeUrl: 'https://site.com' };
      expect(slideSchema.safeParse(validQrData).success).toBe(true);

      const validTextQrData = {
        ...baseMock,
        layout: 'TEXT_QR_CODE',
        content: 'Scan me',
        qrCodeUrl: 'https://site.com',
      };
      expect(slideSchema.safeParse(validTextQrData).success).toBe(true);

      const invalidQrData = { ...baseMock, layout: 'QR_CODE' };
      expect(slideSchema.safeParse(invalidQrData).success).toBe(false);
    });
  });

  describe('Institutional & System Layouts', () => {
    it('should validate pure institutional slides needing no extra fields', () => {
      const layouts = [
        'COVER',
        'AGENDA',
        'PRESENTER_INTRO',
        'COMPANY_INTRO',
        'BREAK',
        'TRANSITION',
      ];

      layouts.forEach(layout => {
        const result = slideSchema.safeParse({ ...baseMock, layout });
        expect(result.success).toBe(true);
      });
    });

    it('should fail if COVER receives unallowed fields (strict mode)', () => {
      const invalidCoverData: unknown = { ...baseMock, layout: 'COVER', monthYear: '10/2026' };
      const result = slideSchema.safeParse(invalidCoverData);
      expect(result.success).toBe(false);
    });

    it('should validate institutional slides that require content (OBJECTIVES, TIPS, CLOSING)', () => {
      const layouts = ['OBJECTIVES', 'TIPS', 'CLOSING'];

      layouts.forEach(layout => {
        const validData = { ...baseMock, layout, content: 'Texto obrigatório' };
        expect(slideSchema.safeParse(validData).success).toBe(true);

        const invalidData = { ...baseMock, layout };
        expect(slideSchema.safeParse(invalidData).success).toBe(false);
      });
    });

    it('should validate EVALUATION strictly requiring qrCodeUrl', () => {
      const validEvalData = {
        ...baseMock,
        layout: 'EVALUATION',
        qrCodeUrl: 'https://forms.google.com',
      };
      expect(slideSchema.safeParse(validEvalData).success).toBe(true);

      const missingUrlEvalData = { ...baseMock, layout: 'EVALUATION' };
      expect(slideSchema.safeParse(missingUrlEvalData).success).toBe(false);

      const extraFieldEvalData: unknown = {
        ...baseMock,
        layout: 'EVALUATION',
        qrCodeUrl: 'https://forms.com',
        evaluationUrl: 'https://forms.com',
      };
      expect(slideSchema.safeParse(extraFieldEvalData).success).toBe(false);
    });
  });
});
