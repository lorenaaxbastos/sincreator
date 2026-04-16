import { urlValidationRule } from './sharedSchemas';

describe('sharedSchemas', () => {
  describe('urlValidationRule', () => {
    it('should validate a correct https url', () => {
      const result = urlValidationRule.safeParse('https://www.padlet.com');
      expect(result.success).toBe(true);
    });

    it('should validate a correct http url', () => {
      const result = urlValidationRule.safeParse('http://example.com');
      expect(result.success).toBe(true);
    });

    it('should fail if url is missing the protocol', () => {
      const result = urlValidationRule.safeParse('www.example.com');
      expect(result.success).toBe(false);
    });

    it('should fail if url is not a valid http/https domain (e.g. localhost or ftp)', () => {
      let result = urlValidationRule.safeParse('https://localhost:3000');
      expect(result.success).toBe(false);

      result = urlValidationRule.safeParse('ftp://files.example.com');
      expect(result.success).toBe(false);
    });

    it('should fail if url has more than 2048 characters', () => {
      const overLimitUrl = 'https://example.com/' + 'a'.repeat(2029);
      const result = urlValidationRule.safeParse(overLimitUrl);

      expect(result.success).toBe(false);
    });

    it('should fail if url is an empty string', () => {
      let result = urlValidationRule.safeParse('');
      expect(result.success).toBe(false);

      result = urlValidationRule.safeParse('   ');
      expect(result.success).toBe(false);
    });
  });
});
