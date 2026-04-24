import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { ActivateAccountUseCase } from '@src/modules/auth/application/use-cases/activate-account.use-case';
import { CreateActivationCodeUseCase } from '@src/modules/auth/application/use-cases/create-activation-code.use-case';
import { GetMeUseCase } from '@src/modules/auth/application/use-cases/get-me.use-case';
import { RefreshUseCase } from '@src/modules/auth/application/use-cases/refresh.use-case';
import { SignInUseCase } from '@src/modules/auth/application/use-cases/sign-in.use-case';
import { SignOutUseCase } from '@src/modules/auth/application/use-cases/sign-out.use-case';
import { SignUpUseCase } from '@src/modules/auth/application/use-cases/sign-up.use-case';
import { UpdateMeUseCase } from '@src/modules/auth/application/use-cases/update-me.use-case';
import type { ActivationCodeRepositoryInterface } from '@src/modules/auth/application/contracts/repositories/activation-code.repository.interface';
import type { AuthSessionRepositoryInterface } from '@src/modules/auth/application/contracts/repositories/auth-session.repository.interface';
import type { HashServiceInterface } from '@src/modules/auth/application/contracts/services/hash.service.interface';
import type { SignUpInput } from '@src/modules/auth/application/dto/input/sign-up.input';
import type { UpdateMeInput } from '@src/modules/auth/application/dto/input/update-me.input';
import type { ActivationCodeEntity } from '@src/modules/auth/domain/entities/activation-code.entity';
import type { AuthSessionEntity } from '@src/modules/auth/domain/entities/auth-session.entity';
import { ActivationCodeType } from '@src/modules/auth/domain/enums/activation-code-type.enum';
import * as activationCodeHelper from '@src/modules/auth/application/helpers/generate-activation-code.helper';
import * as refreshTokenHelper from '@src/modules/auth/application/helpers/generate-refresh-token.helper';
import type { CreateActivationCodeUseCaseInterface } from '@src/modules/auth/application/contracts/use-cases/create-activation-code.use-case.interface';
import type { UserRepositoryInterface } from '@src/modules/user/application/contracts/repositories/user.repository.interface';
import type { UserEntity } from '@src/modules/user/domain/entities/user.entity';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

type ActivationCodeRepositoryMock =
  jest.Mocked<ActivationCodeRepositoryInterface>;
type AuthSessionRepositoryMock = jest.Mocked<AuthSessionRepositoryInterface>;
type HashServiceMock = jest.Mocked<HashServiceInterface>;
type CreateActivationCodeUseCaseMock =
  jest.Mocked<CreateActivationCodeUseCaseInterface>;
type UserRepositoryMock = jest.Mocked<UserRepositoryInterface>;
type JwtServiceMock = jest.Mocked<Pick<JwtService, 'signAsync'>>;
type BcryptCompareMock = jest.MockedFunction<typeof bcrypt.compare>;

const createActivationCodeRepositoryMock =
  (): ActivationCodeRepositoryMock => ({
    create: jest.fn(),
    findValidByPhoneAndCode: jest.fn(),
    invalidateAllByPhone: jest.fn(),
    markAsUsed: jest.fn(),
  });

const createAuthSessionRepositoryMock = (): AuthSessionRepositoryMock => ({
  create: jest.fn(),
  findValidByRefreshToken: jest.fn(),
  revokeByRefreshToken: jest.fn(),
  revokeAllByUserId: jest.fn(),
});

const createHashServiceMock = (): HashServiceMock => ({
  hash: jest.fn(),
  compare: jest.fn(),
});

const createCreateActivationCodeUseCaseMock =
  (): CreateActivationCodeUseCaseMock => ({
    execute: jest.fn(),
  });

const createJwtServiceMock = (): JwtServiceMock => ({
  signAsync: jest.fn(),
});

const createUserRepositoryMock = (): UserRepositoryMock => ({
  list: jest.fn(),
  create: jest.fn(),
  read: jest.fn(),
  findByPhone: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  activateByPhone: jest.fn(),
});

const createActivationCodeEntity = (
  overrides: Partial<ActivationCodeEntity> = {},
): ActivationCodeEntity => ({
  _id: 'activation-code-id',
  phone: '5511999999999',
  code: '123456',
  type: ActivationCodeType.ACCOUNT_ACTIVATION,
  expiresAt: new Date('2026-04-24T22:00:00.000Z'),
  isUsed: false,
  createdAt: new Date('2026-04-24T21:50:00.000Z'),
  updatedAt: new Date('2026-04-24T21:55:00.000Z'),
  ...overrides,
});

const createAuthSessionEntity = (
  overrides: Partial<AuthSessionEntity> = {},
): AuthSessionEntity => ({
  _id: 'auth-session-id',
  userId: 'user-id',
  refreshToken: 'refresh-token',
  expiresAt: new Date('2026-05-01T00:00:00.000Z'),
  isRevoked: false,
  createdAt: new Date('2026-04-24T21:50:00.000Z'),
  updatedAt: new Date('2026-04-24T21:55:00.000Z'),
  ...overrides,
});

const createUserEntity = (overrides: Partial<UserEntity> = {}): UserEntity => ({
  _id: 'user-id',
  name: 'Joao Silva',
  alias: 'joao',
  password: 'hashed-password',
  phone: {
    number: '5511999999999',
    isWhatsapp: true,
  },
  media: {
    avatarUrl: 'https://example.com/avatar.jpg',
  },
  isActive: true,
  createdAt: new Date('2026-04-24T21:50:00.000Z'),
  updatedAt: new Date('2026-04-24T21:55:00.000Z'),
  ...overrides,
});

describe('AuthUseCase', () => {
  let activationCodeRepository: ActivationCodeRepositoryMock;
  let authSessionRepository: AuthSessionRepositoryMock;
  let createActivationCodeUseCase: CreateActivationCodeUseCaseMock;
  let hashService: HashServiceMock;
  let jwtService: JwtServiceMock;
  let userRepository: UserRepositoryMock;

  beforeEach(() => {
    activationCodeRepository = createActivationCodeRepositoryMock();
    authSessionRepository = createAuthSessionRepositoryMock();
    createActivationCodeUseCase = createCreateActivationCodeUseCaseMock();
    hashService = createHashServiceMock();
    jwtService = createJwtServiceMock();
    userRepository = createUserRepositoryMock();
    jest.restoreAllMocks();
    (bcrypt.compare as BcryptCompareMock).mockReset();
  });

  describe('SignUpUseCase', () => {
    let useCase: SignUpUseCase;

    beforeEach(() => {
      useCase = new SignUpUseCase(
        userRepository,
        hashService,
        createActivationCodeUseCase,
      );
    });

    it('deve criar um usuário inativo e gerar código de ativação', async () => {
      const input: SignUpInput = {
        name: 'Joao Silva',
        alias: 'joao',
        password: '123456',
        phone: {
          number: '5511999999999',
          isWhatsapp: true,
        },
        media: {
          avatarUrl: 'https://example.com/avatar.jpg',
        },
      };

      userRepository.findByPhone.mockResolvedValue(null);
      hashService.hash.mockResolvedValue('hashed-password');
      userRepository.create.mockResolvedValue(
        createUserEntity({
          isActive: false,
        }),
      );
      createActivationCodeUseCase.execute.mockResolvedValue(undefined);

      await useCase.execute(input);

      expect(userRepository.findByPhone).toHaveBeenCalledWith('5511999999999');
      expect(hashService.hash).toHaveBeenCalledWith('123456');
      expect(userRepository.create).toHaveBeenCalledWith({
        name: 'Joao Silva',
        alias: 'joao',
        password: 'hashed-password',
        phone: {
          number: '5511999999999',
          isWhatsapp: true,
        },
        media: {
          avatarUrl: 'https://example.com/avatar.jpg',
        },
        isActive: false,
      });
      expect(createActivationCodeUseCase.execute).toHaveBeenCalledWith({
        phone: '5511999999999',
      });
    });

    it('deve lançar exceção quando o usuário já existir', async () => {
      userRepository.findByPhone.mockResolvedValue(createUserEntity());

      await expect(
        useCase.execute({
          name: 'Joao Silva',
          password: '123456',
          phone: {
            number: '5511999999999',
            isWhatsapp: true,
          },
        }),
      ).rejects.toThrow(new ConflictException('User already exists!'));

      expect(hashService.hash).not.toHaveBeenCalled();
      expect(userRepository.create).not.toHaveBeenCalled();
      expect(createActivationCodeUseCase.execute).not.toHaveBeenCalled();
    });
  });

  describe('SignInUseCase', () => {
    let useCase: SignInUseCase;

    beforeEach(() => {
      useCase = new SignInUseCase(userRepository, authSessionRepository, {
        signAsync: jwtService.signAsync,
      } as unknown as JwtService);
    });

    it('deve autenticar o usuário e retornar tokens', async () => {
      userRepository.findByPhone.mockResolvedValue(createUserEntity());
      (bcrypt.compare as BcryptCompareMock).mockResolvedValue(true as never);
      jwtService.signAsync.mockResolvedValue('access-token');
      jest
        .spyOn(refreshTokenHelper, 'generateRefreshToken')
        .mockReturnValue('refresh-token');
      authSessionRepository.create.mockResolvedValue(
        createAuthSessionEntity({
          refreshToken: 'refresh-token',
        }),
      );

      const result = await useCase.execute({
        phone: '5511999999999',
        password: '123456',
      });

      expect(userRepository.findByPhone).toHaveBeenCalledWith('5511999999999');
      expect(bcrypt.compare).toHaveBeenCalledWith('123456', 'hashed-password');
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: 'user-id',
        phone: '5511999999999',
      });
      expect(authSessionRepository.create).toHaveBeenCalledWith({
        userId: 'user-id',
        refreshToken: 'refresh-token',
        expiresAt: expect.any(Date),
        isRevoked: false,
      });
      expect(result).toEqual({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });
    });

    it('deve lançar exceção quando o usuário não existir ou estiver inativo', async () => {
      userRepository.findByPhone.mockResolvedValue(null);

      await expect(
        useCase.execute({
          phone: '5511999999999',
          password: '123456',
        }),
      ).rejects.toThrow(new BadRequestException('Invalid credentials'));

      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(jwtService.signAsync).not.toHaveBeenCalled();
    });

    it('deve lançar exceção quando a senha for inválida', async () => {
      userRepository.findByPhone.mockResolvedValue(createUserEntity());
      (bcrypt.compare as BcryptCompareMock).mockResolvedValue(false as never);

      await expect(
        useCase.execute({
          phone: '5511999999999',
          password: 'senha-invalida',
        }),
      ).rejects.toThrow(new BadRequestException('Invalid credentials'));

      expect(jwtService.signAsync).not.toHaveBeenCalled();
      expect(authSessionRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('CreateActivationCodeUseCase', () => {
    let useCase: CreateActivationCodeUseCase;

    beforeEach(() => {
      useCase = new CreateActivationCodeUseCase(activationCodeRepository);
    });

    it('deve invalidar códigos anteriores e criar um novo código', async () => {
      activationCodeRepository.invalidateAllByPhone.mockResolvedValue(
        undefined,
      );
      activationCodeRepository.create.mockResolvedValue(
        createActivationCodeEntity(),
      );
      jest
        .spyOn(activationCodeHelper, 'generateActivationCode')
        .mockReturnValue('123456');

      await useCase.execute({
        phone: '5511999999999',
      });

      expect(
        activationCodeRepository.invalidateAllByPhone,
      ).toHaveBeenCalledWith({
        phone: '5511999999999',
        type: ActivationCodeType.ACCOUNT_ACTIVATION,
      });
      expect(activationCodeRepository.create).toHaveBeenCalledWith({
        phone: '5511999999999',
        code: '123456',
        type: ActivationCodeType.ACCOUNT_ACTIVATION,
        expiresAt: expect.any(Date),
        isUsed: false,
      });
    });
  });

  describe('ActivateAccountUseCase', () => {
    let useCase: ActivateAccountUseCase;

    beforeEach(() => {
      useCase = new ActivateAccountUseCase(
        activationCodeRepository,
        userRepository,
      );
    });

    it('deve ativar a conta quando o código for válido', async () => {
      activationCodeRepository.findValidByPhoneAndCode.mockResolvedValue(
        createActivationCodeEntity(),
      );
      activationCodeRepository.markAsUsed.mockResolvedValue(undefined);
      userRepository.activateByPhone.mockResolvedValue(undefined);

      await useCase.execute({
        phone: '5511999999999',
        code: '123456',
      });

      expect(
        activationCodeRepository.findValidByPhoneAndCode,
      ).toHaveBeenCalledWith({
        phone: '5511999999999',
        code: '123456',
        type: ActivationCodeType.ACCOUNT_ACTIVATION,
      });
      expect(activationCodeRepository.markAsUsed).toHaveBeenCalledWith(
        'activation-code-id',
      );
      expect(userRepository.activateByPhone).toHaveBeenCalledWith(
        '5511999999999',
      );
    });

    it('deve lançar exceção quando o código for inválido ou expirado', async () => {
      activationCodeRepository.findValidByPhoneAndCode.mockResolvedValue(null);

      await expect(
        useCase.execute({
          phone: '5511999999999',
          code: '123456',
        }),
      ).rejects.toThrow(
        new BadRequestException('Invalid or expired activation code'),
      );

      expect(activationCodeRepository.markAsUsed).not.toHaveBeenCalled();
      expect(userRepository.activateByPhone).not.toHaveBeenCalled();
    });
  });

  describe('RefreshUseCase', () => {
    let useCase: RefreshUseCase;

    beforeEach(() => {
      useCase = new RefreshUseCase(authSessionRepository, {
        signAsync: jwtService.signAsync,
      } as unknown as JwtService);
    });

    it('deve gerar novo access token quando a sessão for válida', async () => {
      authSessionRepository.findValidByRefreshToken.mockResolvedValue(
        createAuthSessionEntity(),
      );
      jwtService.signAsync.mockResolvedValue('new-access-token');

      const result = await useCase.execute({
        refreshToken: 'refresh-token',
      });

      expect(
        authSessionRepository.findValidByRefreshToken,
      ).toHaveBeenCalledWith('refresh-token');
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: 'user-id',
      });
      expect(result).toEqual({
        accessToken: 'new-access-token',
        refreshToken: 'refresh-token',
      });
    });

    it('deve lançar exceção quando o refresh token for inválido', async () => {
      authSessionRepository.findValidByRefreshToken.mockResolvedValue(null);

      await expect(
        useCase.execute({
          refreshToken: 'refresh-token',
        }),
      ).rejects.toThrow(new BadRequestException('Invalid refresh token'));

      expect(jwtService.signAsync).not.toHaveBeenCalled();
    });
  });

  describe('SignOutUseCase', () => {
    let useCase: SignOutUseCase;

    beforeEach(() => {
      useCase = new SignOutUseCase(authSessionRepository);
    });

    it('deve revogar a sessão pelo refresh token', async () => {
      authSessionRepository.revokeByRefreshToken.mockResolvedValue(undefined);

      await useCase.execute({
        refreshToken: 'refresh-token',
      });

      expect(authSessionRepository.revokeByRefreshToken).toHaveBeenCalledWith(
        'refresh-token',
      );
    });
  });

  describe('GetMeUseCase', () => {
    let useCase: GetMeUseCase;

    beforeEach(() => {
      useCase = new GetMeUseCase(userRepository);
    });

    it('deve retornar o usuário autenticado', async () => {
      userRepository.read.mockResolvedValue(createUserEntity());

      const result = await useCase.execute('user-id');

      expect(userRepository.read).toHaveBeenCalledWith('user-id');
      expect(result).toEqual({
        _id: 'user-id',
        name: 'Joao Silva',
        alias: 'joao',
        phone: {
          number: '5511999999999',
          isWhatsapp: true,
        },
        media: {
          avatarUrl: 'https://example.com/avatar.jpg',
        },
        isActive: true,
        createdAt: new Date('2026-04-24T21:50:00.000Z'),
        updatedAt: new Date('2026-04-24T21:55:00.000Z'),
      });
    });

    it('deve lançar exceção quando o usuário não for encontrado', async () => {
      userRepository.read.mockResolvedValue(null);

      await expect(useCase.execute('user-id')).rejects.toThrow(
        new NotFoundException('User not found!'),
      );
    });
  });

  describe('UpdateMeUseCase', () => {
    let useCase: UpdateMeUseCase;

    beforeEach(() => {
      useCase = new UpdateMeUseCase(userRepository);
    });

    it('deve atualizar os dados do usuário autenticado', async () => {
      const input: UpdateMeInput = {
        userId: 'user-id',
        name: 'Joao Atualizado',
        alias: 'joao-novo',
        phone: {
          number: '5511888888888',
        },
        media: {
          avatarUrl: 'https://example.com/new-avatar.jpg',
        },
      };

      userRepository.update.mockResolvedValue(
        createUserEntity({
          name: 'Joao Atualizado',
          alias: 'joao-novo',
          phone: {
            number: '5511888888888',
            isWhatsapp: true,
          },
          media: {
            avatarUrl: 'https://example.com/new-avatar.jpg',
          },
        }),
      );

      const result = await useCase.execute(input);

      expect(userRepository.update).toHaveBeenCalledWith({
        userId: 'user-id',
        name: 'Joao Atualizado',
        alias: 'joao-novo',
        phone: {
          number: '5511888888888',
        },
        media: {
          avatarUrl: 'https://example.com/new-avatar.jpg',
        },
      });
      expect(result.name).toBe('Joao Atualizado');
      expect(result.alias).toBe('joao-novo');
    });

    it('deve lançar exceção quando o usuário não for encontrado', async () => {
      userRepository.update.mockResolvedValue(null);

      await expect(
        useCase.execute({
          userId: 'user-id',
          name: 'Joao Atualizado',
        }),
      ).rejects.toThrow(new NotFoundException('User not found'));
    });
  });
});
