import {
  BRAZIL_PHONE_REGEX,
  BRAZIL_PHONE_VALIDATION_MESSAGE,
} from '@src/shared/utils/phone-validation.utils';

describe('phone-validation.utils', () => {
  it('deve aceitar numeros brasileiros validos com DDD, com ou sem codigo 55', () => {
    expect(BRAZIL_PHONE_REGEX.test('11987654321')).toBe(true);
    expect(BRAZIL_PHONE_REGEX.test('1132654321')).toBe(true);
    expect(BRAZIL_PHONE_REGEX.test('5511987654321')).toBe(true);
    expect(BRAZIL_PHONE_REGEX.test('551132654321')).toBe(true);
  });

  it('deve rejeitar numeros brasileiros invalidos', () => {
    expect(BRAZIL_PHONE_REGEX.test('')).toBe(false);
    expect(BRAZIL_PHONE_REGEX.test('987654321')).toBe(false);
    expect(BRAZIL_PHONE_REGEX.test('0011987654321')).toBe(false);
    expect(BRAZIL_PHONE_REGEX.test('101987654321')).toBe(false);
    expect(BRAZIL_PHONE_REGEX.test('5511087654321')).toBe(false);
    expect(BRAZIL_PHONE_REGEX.test('55119876543')).toBe(false);
    expect(BRAZIL_PHONE_REGEX.test('(11) 98765-4321')).toBe(false);
    expect(BRAZIL_PHONE_REGEX.test('55119876543210')).toBe(false);
  });

  it('deve exportar a mensagem de validacao esperada', () => {
    expect(BRAZIL_PHONE_VALIDATION_MESSAGE).toBe(
      'phone must be a valid Brazilian number with DDD, using only digits, optionally starting with 55',
    );
  });
});
