import { MaskUtils } from '@src/shared/utils/mask.utils';

describe('MaskUtils', () => {
  let maskUtils: MaskUtils;

  beforeEach(() => {
    maskUtils = new MaskUtils();
  });

  describe('formatPhone', () => {
    it('deve retornar string vazia para valores nulos ou indefinidos', () => {
      expect(maskUtils.formatPhone(null)).toBe('');
      expect(maskUtils.formatPhone(undefined)).toBe('');
    });

    it('deve formatar telefones parciais e completos', () => {
      expect(maskUtils.formatPhone('1')).toBe('(1');
      expect(maskUtils.formatPhone('11999')).toBe('(11) 999');
      expect(maskUtils.formatPhone('1198765432')).toBe('(11) 9876-5432');
      expect(maskUtils.formatPhone('11987654321')).toBe('(11) 98765-4321');
    });
    it('deve ignorar caracteres nao numericos e limitar a 11 digitos', () => {
      expect(maskUtils.formatPhone('(11) 98765-4321')).toBe('(11) 98765-4321');
      expect(maskUtils.formatPhone('11a98765b4321c99')).toBe('(11) 98765-4321');
    });
  });
});
