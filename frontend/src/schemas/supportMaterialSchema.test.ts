import { supportMaterialSchema, distributionSchema } from './supportMaterialSchema';

describe('supportMaterial schema', () => {
  describe('Base validation (id, name, url and type)', () => {
    const mockObject = {
      id: '4a8eabb0-9a98-4562-9b17-691d308cfe3f',
      name: 'Atividade - Conectando objetivos',
      type: 'Digital',
      url: 'https://www.padlet.com',
      tool: 'Padlet',
    };

    it('should validate a correct supportMaterial object', () => {
      const result = supportMaterialSchema.safeParse(mockObject);

      expect(result.success).toBe(true);
    });

    it('should fail if a required field is missing', () => {
      const { name: _name, ...data } = mockObject;
      const result = supportMaterialSchema.safeParse(data);

      expect(result.success).toBe(false);
      if (!result.success) expect(result.error.issues[0].path[0]).toBe('name');
    });

    it('should fail if a not allowed field is present', () => {
      const data = { ...mockObject, test: true };
      const result = supportMaterialSchema.safeParse(data);

      expect(result.success).toBe(false);
    });

    it('should fail if id is not a valid UUID', () => {
      const data = { ...mockObject, id: '12345' };
      const result = supportMaterialSchema.safeParse(data);

      expect(result.success).toBe(false);
      if (!result.success) expect(result.error.issues[0].path[0]).toBe('id');
    });

    it('should fail if name has less than 3 characters', () => {
      let data = { ...mockObject, name: 'Oi' };
      let result = supportMaterialSchema.safeParse(data);

      expect(result.success).toBe(false);
      if (!result.success) expect(result.error.issues[0].path[0]).toBe('name');

      data = { ...mockObject, name: '    ' };
      result = supportMaterialSchema.safeParse(data);

      expect(result.success).toBe(false);
      if (!result.success) expect(result.error.issues[0].path[0]).toBe('name');
    });

    it('should fail if name has more than 255 characters', () => {
      const data = {
        ...mockObject,
        name: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas in eros congue, cursus dolor eget, lacinia quam. Proin a urna sit amet arcu laoreet tempor. Aenean placerat neque quis quam laoreet, ac auctor nisl volutpat. Quisque id tristique mi, in nam.',
      };
      const result = supportMaterialSchema.safeParse(data);

      expect(result.success).toBe(false);
      if (!result.success) expect(result.error.issues[0].path[0]).toBe('name');
    });

    it('should fail if type is invalid', () => {
      const data = { ...mockObject, type: 'Arquivo' };
      const result = supportMaterialSchema.safeParse(data);

      expect(result.success).toBe(false);
      if (!result.success) expect(result.error.issues[0].path[0]).toBe('type');
    });

    it('should fail if type is missing', () => {
      const { type: _type, ...data } = mockObject;
      const result = supportMaterialSchema.safeParse(data);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Tipo é obrigatório');
      }
    });

    it('should fail if url is not a valid http/https domain', () => {
      const data = { ...mockObject, url: 'https://localhost:3000' };
      const result = supportMaterialSchema.safeParse(data);

      expect(result.success).toBe(false);
      if (!result.success) expect(result.error.issues[0].path[0]).toBe('url');
    });

    it('should fail if url has more than 2048 characters', () => {
      const overLimitUrl = 'https://example.com/' + 'a'.repeat(2029);

      const data = {
        ...mockObject,
        url: overLimitUrl,
      };
      const result = supportMaterialSchema.safeParse(data);

      expect(result.success).toBe(false);
      if (!result.success) expect(result.error.issues[0].path[0]).toBe('url');
    });
  });

  describe('Shared distribution validation (qty, multiplier, groupQty, notes)', () => {
    const mockObject = {
      qty: 5,
      multiplier: 'Cursista',
      notes: 'Coloridas, 1/3 de cada cor',
    };

    it('should validate a correct distribution object', () => {
      const result = distributionSchema.safeParse(mockObject);
      expect(result.success).toBe(true);
    });

    it('should fail if quantity is less than 1', () => {
      const data = { ...mockObject, qty: 0 };
      const result = distributionSchema.safeParse(data);

      expect(result.success).toBe(false);
      if (!result.success) expect(result.error.issues[0].path[0]).toBe('qty');
    });

    it('should fail if quantity is more than 9999', () => {
      const data = { ...mockObject, qty: 10000 };
      const result = distributionSchema.safeParse(data);

      expect(result.success).toBe(false);
      if (!result.success) expect(result.error.issues[0].path[0]).toBe('qty');
    });

    it('should fail if multiplier is invalid', () => {
      const data = { ...mockObject, multiplier: 'Aluno' };
      const result = distributionSchema.safeParse(data);

      expect(result.success).toBe(false);
      if (!result.success) expect(result.error.issues[0].path[0]).toBe('multiplier');
    });

    it('should validate if groupQty is provided and multiplier is Grupo', () => {
      const invalidData = { ...mockObject, multiplier: 'Grupo' };
      const invalidResult = distributionSchema.safeParse(invalidData);
      expect(invalidResult.success).toBe(false);

      const validData = { ...mockObject, multiplier: 'Grupo', groupQty: 5 };
      const validResult = distributionSchema.safeParse(validData);
      expect(validResult.success).toBe(true);
    });

    it('should fail if groupQty is provided but multiplier is not Grupo', () => {
      const data = { ...mockObject, groupQty: 3 };
      const result = distributionSchema.safeParse(data);

      expect(result.success).toBe(false);
      if (!result.success) expect(result.error.issues[0].path[0]).toBe('groupQty');
    });

    it('should fail if groupQty is less than 2', () => {
      const data = { ...mockObject, multiplier: 'Grupo', groupQty: 1 };
      const result = distributionSchema.safeParse(data);

      expect(result.success).toBe(false);
      if (!result.success) expect(result.error.issues[0].path[0]).toBe('groupQty');
    });

    it('should fail if notes has less than 2 characters', () => {
      let data = { ...mockObject, notes: '+' };
      let result = distributionSchema.safeParse(data);

      expect(result.success).toBe(false);
      if (!result.success) expect(result.error.issues[0].path[0]).toBe('notes');

      data = { ...mockObject, notes: '    ' };
      result = distributionSchema.safeParse(data);

      expect(result.success).toBe(false);
      if (!result.success) expect(result.error.issues[0].path[0]).toBe('notes');
    });

    it('should fail if notes has more than 500 characters', () => {
      const data = {
        ...mockObject,
        notes:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas in eros congue, cursus dolor eget, lacinia quam. Proin a urna sit amet arcu laoreet tempor. Aenean placerat neque quis quam laoreet, ac auctor nisl volutpat. Quisque id tristique mi, in nam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas in eros congue, cursus dolor eget, lacinia quam. Proin a urna sit amet arcu laoreet tempor. Aenean placerat neque quis quam laoreet, ac auctor nisl volutpat. Quisque id tristique mi, in nam.',
      };
      const result = distributionSchema.safeParse(data);

      expect(result.success).toBe(false);
      if (!result.success) expect(result.error.issues[0].path[0]).toBe('notes');
    });

    it('should validate if notes is an empty string', () => {
      const data = { ...mockObject, notes: '' };
      const result = distributionSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should validate when notes is completely omitted (optional)', () => {
      const { notes: _notes, ...data } = mockObject;
      const result = distributionSchema.safeParse(data);

      expect(result.success).toBe(true);
    });
  });

  describe('Type: Papelaria', () => {
    const mockObject = {
      id: '5d700810-b014-421e-9081-e10ad40f9829',
      name: 'Caneta',
      type: 'Papelaria',
      qty: 5,
      multiplier: 'Cursista',
    };

    it('should validade a correct supportMaterial object of type Papelaria', () => {
      const result = supportMaterialSchema.safeParse(mockObject);

      expect(result.success).toBe(true);
    });

    it('should fail if a required field is missing', () => {
      const { name: _name, ...data } = mockObject;
      const result = supportMaterialSchema.safeParse(data);

      expect(result.success).toBe(false);
      if (!result.success) expect(result.error.issues[0].path[0]).toBe('name');
    });

    it('should fail if a not allowed field is present', () => {
      const data = { ...mockObject, test: true };
      const result = supportMaterialSchema.safeParse(data);

      expect(result.success).toBe(false);
    });
  });

  describe('Type: Impressão', () => {
    const mockObject = {
      id: '644088e8-9038-447e-b632-3a1e3c71197c',
      name: 'Atividade mão na massa',
      type: 'Impressão',
      url: 'https://www.docs.google.com',
      qty: 2,
      multiplier: 'Turma',
      sides: 'Frente',
      size: 'A4',
      color: 'Colorido',
      staple: true,
      notes: 'Gramatura do papel: 120g',
    };

    it('should validate a correct supportMaterial object of type Impressão', () => {
      const result = supportMaterialSchema.safeParse(mockObject);

      expect(result.success).toBe(true);
    });

    it('should fail if a required field is missing', () => {
      const { name: _name, ...data } = mockObject;
      const result = supportMaterialSchema.safeParse(data);

      expect(result.success).toBe(false);
      if (!result.success) expect(result.error.issues[0].path[0]).toBe('name');
    });

    it('should fail if a not allowed field is present', () => {
      const data = { ...mockObject, test: true };
      const result = supportMaterialSchema.safeParse(data);

      expect(result.success).toBe(false);
    });

    it('should fail if sides is invalid', () => {
      const data = { ...mockObject, sides: 'Só frente' };
      const result = supportMaterialSchema.safeParse(data);

      expect(result.success).toBe(false);
      if (!result.success) expect(result.error.issues[0].path[0]).toBe('sides');
    });

    it('should fail if size is invalid', () => {
      const data = { ...mockObject, size: 'A6' };
      const result = supportMaterialSchema.safeParse(data);

      expect(result.success).toBe(false);
      if (!result.success) expect(result.error.issues[0].path[0]).toBe('size');
    });

    it('should fail if color is invalid', () => {
      const data = { ...mockObject, color: 'RGB' };
      const result = supportMaterialSchema.safeParse(data);

      expect(result.success).toBe(false);
      if (!result.success) expect(result.error.issues[0].path[0]).toBe('color');
    });

    it('should fail if staple is invalid', () => {
      const data = { ...mockObject, staple: 'Sim' };
      const result = supportMaterialSchema.safeParse(data);

      expect(result.success).toBe(false);
      if (!result.success) expect(result.error.issues[0].path[0]).toBe('staple');
    });
  });

  describe('Type: Digital', () => {
    const mockObject = {
      id: 'a8a6341e-f847-4248-9218-18a20647808e',
      name: 'Mural - Bilhete de entrada',
      type: 'Digital',
      tool: 'Padlet',
      url: 'https://padlet.com',
    };

    it('should validate a correct supportMaterial object of type Digital', () => {
      const result = supportMaterialSchema.safeParse(mockObject);

      expect(result.success).toBe(true);
    });

    it('should fail if a required field is missing', () => {
      const { name: _name, ...data } = mockObject;
      const result = supportMaterialSchema.safeParse(data);

      expect(result.success).toBe(false);
      if (!result.success) expect(result.error.issues[0].path[0]).toBe('name');
    });

    it('should fail if a not allowed field is present', () => {
      const data = { ...mockObject, test: true };
      const result = supportMaterialSchema.safeParse(data);

      expect(result.success).toBe(false);
    });

    it('should fail if tool is invalid', () => {
      const data = { ...mockObject, tool: 'Canva' };
      const result = supportMaterialSchema.safeParse(data);

      expect(result.success).toBe(false);
      if (!result.success) expect(result.error.issues[0].path[0]).toBe('tool');
    });

    it('should require otherToolName if tool is Outro', () => {
      const invalidData = { ...mockObject, tool: 'Outro' };
      const invalidResult = supportMaterialSchema.safeParse(invalidData);

      expect(invalidResult.success).toBe(false);
      if (!invalidResult.success)
        expect(invalidResult.error.issues[0].path[0]).toBe('otherToolName');

      const validData = { ...mockObject, tool: 'Outro', otherToolName: 'Miro' };
      const validResult = supportMaterialSchema.safeParse(validData);

      expect(validResult.success).toBe(true);
    });

    it('should fail if otherToolName is provided but tool is not Outro', () => {
      const data = { ...mockObject, otherToolName: 'Miro' };
      const result = supportMaterialSchema.safeParse(data);

      expect(result.success).toBe(false);
      if (!result.success) expect(result.error.issues[0].path[0]).toBe('otherToolName');
    });

    it('should require editUrl and resultsUrl if tool is Mentimeter', () => {
      const missingBoth = { ...mockObject, tool: 'Mentimeter' };
      expect(supportMaterialSchema.safeParse(missingBoth).success).toBe(false);

      const missingResults = { ...mockObject, tool: 'Mentimeter', editUrl: 'https://edit.com' };
      expect(supportMaterialSchema.safeParse(missingResults).success).toBe(false);

      const missingEdit = { ...mockObject, tool: 'Mentimeter', resultsUrl: 'https://results.com' };
      expect(supportMaterialSchema.safeParse(missingEdit).success).toBe(false);

      const valid = {
        ...mockObject,
        tool: 'Mentimeter',
        editUrl: 'https://edit.com',
        resultsUrl: 'https://results.com',
      };
      expect(supportMaterialSchema.safeParse(valid).success).toBe(true);
    });

    it('should require editUrl if tool is Quizizz or Kahoot', () => {
      const missingEditKahoot = { ...mockObject, tool: 'Kahoot' };
      expect(supportMaterialSchema.safeParse(missingEditKahoot).success).toBe(false);

      const validKahoot = { ...mockObject, tool: 'Kahoot', editUrl: 'https://edit.com' };
      expect(supportMaterialSchema.safeParse(validKahoot).success).toBe(true);

      const missingEditQuizizz = { ...mockObject, tool: 'Quizizz' };
      expect(supportMaterialSchema.safeParse(missingEditQuizizz).success).toBe(false);

      const validQuizizz = { ...mockObject, tool: 'Quizizz', editUrl: 'https://edit.com' };
      expect(supportMaterialSchema.safeParse(validQuizizz).success).toBe(true);
    });

    it('should fail if resultsUrl is present but tool is not Mentimeter', () => {
      const invalidKahoot = {
        ...mockObject,
        tool: 'Kahoot',
        editUrl: 'https://edit.com',
        resultsUrl: 'https://results.com',
      };
      const result = supportMaterialSchema.safeParse(invalidKahoot);

      expect(result.success).toBe(false);
      if (!result.success) expect(result.error.issues[0].path[0]).toBe('resultsUrl');
    });

    it('should fail if editUrl is present but tool does not require it', () => {
      const data = { ...mockObject, tool: 'Padlet', editUrl: 'https://edit.com' };
      const result = supportMaterialSchema.safeParse(data);

      expect(result.success).toBe(false);
      if (!result.success) expect(result.error.issues[0].path[0]).toBe('editUrl');
    });
  });
});
