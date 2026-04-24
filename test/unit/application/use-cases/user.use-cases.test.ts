import { ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { CreateUserUseCase } from '@src/modules/user/application/use-cases/create-user.use-case';
import { ReadUserUseCase } from '@src/modules/user/application/use-cases/read-user.use-case';
import { UpdateUserUseCase } from '@src/modules/user/application/use-cases/update-user.use-case';
import { DeleteUserUseCase } from '@src/modules/user/application/use-cases/delete-user.use-case';
import { ListUserUseCase } from '@src/modules/user/application/use-cases/list-user.use-case';
import type { UserRepositoryInterface } from '@src/modules/user/application/contracts/repositories/user.repository.interface';
import type { CreateUserInput } from '@src/modules/user/application/dto/input/create-user.input';
import type { UpdateUserInput } from '@src/modules/user/application/dto/input/update-user.input';
import type { UserEntity } from '@src/modules/user/domain/entities/user.entity';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
}));

type UserRepositoryMock = jest.Mocked<UserRepositoryInterface>;
type BcryptHashMock = jest.MockedFunction<typeof bcrypt.hash>;

const createRepositoryMock = (): UserRepositoryMock => ({
  list: jest.fn(),
  create: jest.fn(),
  read: jest.fn(),
  findByPhone: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  activateByPhone: jest.fn(),
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
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-02T00:00:00.000Z'),
  ...overrides,
});

describe('UserUseCase', () => {
  let repository: UserRepositoryMock;

  beforeEach(() => {
    repository = createRepositoryMock();
    jest.restoreAllMocks();
    (bcrypt.hash as BcryptHashMock).mockReset();
  });

  describe('CreateUserUseCase', () => {
    let useCase: CreateUserUseCase;

    beforeEach(() => {
      useCase = new CreateUserUseCase(repository);
    });

    describe('execute', () => {
      it('deve criar um usuário com a senha criptografada', async () => {
        const input: CreateUserInput = {
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
        const user = createUserEntity();

        repository.findByPhone.mockResolvedValue(null);
        (bcrypt.hash as BcryptHashMock).mockResolvedValue(
          'hashed-password' as never,
        );
        repository.create.mockResolvedValue(user);

        const result = await useCase.execute(input);

        expect(repository.findByPhone).toHaveBeenCalledWith('5511999999999');
        expect(bcrypt.hash).toHaveBeenCalledWith('123456', 10);
        expect(repository.create).toHaveBeenCalledWith({
          ...input,
          password: 'hashed-password',
          isActive: false,
        });
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
          createdAt: new Date('2026-01-01T00:00:00.000Z'),
          updatedAt: new Date('2026-01-02T00:00:00.000Z'),
        });
      });

      it('deve manter isActive=true quando informado na criação', async () => {
        const input: CreateUserInput = {
          name: 'Joao Silva',
          password: '123456',
          phone: {
            number: '5511999999999',
            isWhatsapp: true,
          },
          isActive: true,
        };

        repository.findByPhone.mockResolvedValue(null);
        (bcrypt.hash as BcryptHashMock).mockResolvedValue(
          'hashed-password' as never,
        );
        repository.create.mockResolvedValue(
          createUserEntity({
            media: undefined,
          }),
        );

        await useCase.execute(input);

        expect(repository.create).toHaveBeenCalledWith({
          ...input,
          password: 'hashed-password',
          isActive: true,
        });
      });

      it('deve lançar exceção quando já existir usuário com o telefone informado', async () => {
        repository.findByPhone.mockResolvedValue(createUserEntity());

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

        expect(repository.create).not.toHaveBeenCalled();
      });
    });
  });

  describe('ReadUserUseCase', () => {
    let useCase: ReadUserUseCase;

    beforeEach(() => {
      useCase = new ReadUserUseCase(repository);
    });

    describe('execute', () => {
      it('deve retornar um usuário quando o userId existir', async () => {
        const user = createUserEntity();

        repository.read.mockResolvedValue(user);

        const result = await useCase.execute({ userId: 'user-id' });

        expect(repository.read).toHaveBeenCalledWith('user-id');
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
          createdAt: new Date('2026-01-01T00:00:00.000Z'),
          updatedAt: new Date('2026-01-02T00:00:00.000Z'),
        });
      });

      it('deve lançar exceção quando o usuário não for encontrado', async () => {
        repository.read.mockResolvedValue(null);

        await expect(useCase.execute({ userId: 'user-id' })).rejects.toThrow(
          new NotFoundException('User not found'),
        );
      });
    });
  });

  describe('UpdateUserUseCase', () => {
    let useCase: UpdateUserUseCase;

    beforeEach(() => {
      useCase = new UpdateUserUseCase(repository);
    });

    describe('execute', () => {
      it('deve atualizar um usuário com senha criptografada quando password for informado', async () => {
        const input: UpdateUserInput = {
          userId: 'user-id',
          name: 'Joao Atualizado',
          password: 'nova-senha',
          isActive: false,
        };
        const updatedUser = createUserEntity({
          name: 'Joao Atualizado',
          isActive: false,
        });

        (bcrypt.hash as BcryptHashMock).mockResolvedValue(
          'hashed-new-password' as never,
        );
        repository.update.mockResolvedValue(updatedUser);

        const result = await useCase.execute(input);

        expect(bcrypt.hash).toHaveBeenCalledWith('nova-senha', 10);
        expect(repository.update).toHaveBeenCalledWith({
          ...input,
          password: 'hashed-new-password',
        });
        expect(result).toEqual({
          _id: 'user-id',
          name: 'Joao Atualizado',
          alias: 'joao',
          phone: {
            number: '5511999999999',
            isWhatsapp: true,
          },
          media: {
            avatarUrl: 'https://example.com/avatar.jpg',
          },
          isActive: false,
          createdAt: new Date('2026-01-01T00:00:00.000Z'),
          updatedAt: new Date('2026-01-02T00:00:00.000Z'),
        });
      });

      it('deve atualizar um usuário sem criptografar senha quando password não for informado', async () => {
        const input: UpdateUserInput = {
          userId: 'user-id',
          alias: 'joao-novo',
        };
        const updatedUser = createUserEntity({
          alias: 'joao-novo',
        });
        repository.update.mockResolvedValue(updatedUser);

        const result = await useCase.execute(input);

        expect(bcrypt.hash).not.toHaveBeenCalled();
        expect(repository.update).toHaveBeenCalledWith({
          ...input,
          password: undefined,
        });
        expect(result.alias).toBe('joao-novo');
      });

      it('deve lançar exceção quando o usuário não for encontrado na atualização', async () => {
        repository.update.mockResolvedValue(null);

        await expect(
          useCase.execute({
            userId: 'user-id',
            name: 'Joao Atualizado',
          }),
        ).rejects.toThrow(new NotFoundException('User not found'));
      });
    });
  });

  describe('DeleteUserUseCase', () => {
    let useCase: DeleteUserUseCase;

    beforeEach(() => {
      useCase = new DeleteUserUseCase(repository);
    });

    describe('execute', () => {
      it('deve remover um usuário existente', async () => {
        repository.read.mockResolvedValue(createUserEntity());
        repository.delete.mockResolvedValue(undefined);

        await useCase.execute({ userId: 'user-id' });

        expect(repository.read).toHaveBeenCalledWith('user-id');
        expect(repository.delete).toHaveBeenCalledWith('user-id');
      });

      it('deve lançar exceção quando o usuário não for encontrado', async () => {
        repository.read.mockResolvedValue(null);

        await expect(useCase.execute({ userId: 'user-id' })).rejects.toThrow(
          new NotFoundException('User not found'),
        );
        expect(repository.delete).not.toHaveBeenCalled();
      });
    });
  });

  describe('ListUserUseCase', () => {
    let useCase: ListUserUseCase;

    beforeEach(() => {
      useCase = new ListUserUseCase(repository);
    });

    describe('execute', () => {
      it('deve listar os usuários retornados pelo repositório', async () => {
        const users = [
          createUserEntity(),
          createUserEntity({
            _id: 'user-id-2',
            name: 'Maria Souza',
            alias: 'maria',
            phone: {
              number: '5511888888888',
              isWhatsapp: false,
            },
          }),
        ];

        repository.list.mockResolvedValue(users);

        const result = await useCase.execute();

        expect(repository.list).toHaveBeenCalledTimes(1);
        expect(result).toEqual([
          {
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
            createdAt: new Date('2026-01-01T00:00:00.000Z'),
            updatedAt: new Date('2026-01-02T00:00:00.000Z'),
          },
          {
            _id: 'user-id-2',
            name: 'Maria Souza',
            alias: 'maria',
            phone: {
              number: '5511888888888',
              isWhatsapp: false,
            },
            media: {
              avatarUrl: 'https://example.com/avatar.jpg',
            },
            isActive: true,
            createdAt: new Date('2026-01-01T00:00:00.000Z'),
            updatedAt: new Date('2026-01-02T00:00:00.000Z'),
          },
        ]);
      });

      it('deve retornar uma lista vazia quando não existirem usuários', async () => {
        repository.list.mockResolvedValue([]);

        const result = await useCase.execute();

        expect(repository.list).toHaveBeenCalledTimes(1);
        expect(result).toEqual([]);
      });
    });
  });
});
