import { MaskUtils } from '@src/shared/utils/mask.utils';

describe('MaskUtils', () => {
  let maskUtils: MaskUtils;

  beforeEach(() => {
    maskUtils = new MaskUtils();
  });

  describe('formatPhone', () => {
    it('should return empty string for nullish values', () => {
      expect(maskUtils.formatPhone(null)).toBe('');
      expect(maskUtils.formatPhone(undefined)).toBe('');
    });

    it('should format partial and full phone numbers', () => {
      expect(maskUtils.formatPhone('1')).toBe('(1');
      expect(maskUtils.formatPhone('11999')).toBe('(11) 999');
      expect(maskUtils.formatPhone('1198765432')).toBe('(11) 9876-5432');
      expect(maskUtils.formatPhone('11987654321')).toBe('(11) 98765-4321');
    });
    it('should ignore non-digit characters and limit to 11 digits', () => {
      expect(maskUtils.formatPhone('(11) 98765-4321')).toBe('(11) 98765-4321');
      expect(maskUtils.formatPhone('11a98765b4321c99')).toBe('(11) 98765-4321');
    });
  });
});
