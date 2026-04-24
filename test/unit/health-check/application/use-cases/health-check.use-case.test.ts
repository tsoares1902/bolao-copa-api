import { HealthCheckUseCase } from '@src/modules/health-check/application/use-cases/health-check.use-case';

describe('HealthCheckUseCase', () => {
  let useCase: HealthCheckUseCase;
  const originalVersion = process.env.npm_package_version;

  beforeEach(() => {
    useCase = new HealthCheckUseCase();
  });

  afterEach(() => {
    if (originalVersion === undefined) {
      delete process.env.npm_package_version;
      return;
    }

    process.env.npm_package_version = originalVersion;
  });

  describe('execute', () => {
    it('deve retornar a saude da aplicacao usando a versao do package vinda do ambiente', () => {
      process.env.npm_package_version = '1.2.3';

      const result = useCase.execute();

      expect(result).toEqual({
        healthy: true,
        name: 'API',
        version: '1.2.3',
      });
    });

    it('deve retornar a versao padrao quando a versao do package nao estiver definida', () => {
      delete process.env.npm_package_version;

      const result = useCase.execute();

      expect(result).toEqual({
        healthy: true,
        name: 'API',
        version: '0.0.1',
      });
    });
  });
});
