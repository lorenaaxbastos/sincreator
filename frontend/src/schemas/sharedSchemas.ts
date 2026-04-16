import { z } from 'zod';

export const urlValidationRule = z
  .url({
    protocol: /^https?$/,
    hostname: z.regexes.domain,
    error: 'A url deve ter um protocolo http/https e um domínio válido',
  })
  .max(2048, 'A url deve ter no máximo 2048 caracteres');
