import { NotFoundException } from '@nestjs/common';

import { CreateTeamUseCase } from '@src/modules/team/application/use-cases/create-team.use-case';
import { ReadTeamUseCase } from '@src/modules/team/application/use-cases/read-team.use-case';
import { UpdateTeamUseCase } from '@src/modules/team/application/use-cases/update-team.use-case';
import { DeleteTeamUseCase } from '@src/modules/team/application/use-cases/delete-team.use-case';
import { ListTeamUseCase } from '@src/modules/team/application/use-cases/list-team.use-case';
import type { TeamRepositoryInterface } from '@src/modules/team/application/contracts/repositories/team.repository';
import type { TeamEntity } from '@src/modules/team/domain/entities/team.entity';
import type { CreateTeamInput } from '@src/modules/team/application/dto/input/create-team.input';
import type { UpdateTeamInput } from '@src/modules/team/application/dto/input/update-team.input';

type TeamRepositoryMock = jest.Mocked<TeamRepositoryInterface>;

const createRepositoryMock = (): TeamRepositoryMock => ({
  list: jest.fn(),
  create: jest.fn(),
  read: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

const createTeamEntity = (overrides: Partial<TeamEntity> = {}): TeamEntity => ({
  _id: 'team-id',
  name: 'Brasil',
  isoCode: 'BR',
  flagEmoji: '🇧🇷',
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-02T00:00:00.000Z'),
  ...overrides,
});

describe('Use Cases de Team', () => {
  let repository: TeamRepositoryMock;

  beforeEach(() => {
    repository = createRepositoryMock();
  });

  describe('CreateTeamUseCase', () => {
    let useCase: CreateTeamUseCase;

    beforeEach(() => {
      useCase = new CreateTeamUseCase(repository);
    });

    describe('execute', () => {
      it('deve criar um time normalizando o isoCode para maiusculo', async () => {
        const input: CreateTeamInput = {
          name: 'Brasil',
          isoCode: 'br',
          flagEmoji: '🇧🇷',
        };
        const team = createTeamEntity();

        repository.create.mockResolvedValue(team);

        const result = await useCase.execute(input);

        expect(repository.create).toHaveBeenCalledWith({
          ...input,
          isoCode: 'BR',
        });
        expect(result).toEqual(team);
      });
    });
  });

  describe('ReadTeamUseCase', () => {
    let useCase: ReadTeamUseCase;

    beforeEach(() => {
      useCase = new ReadTeamUseCase(repository);
    });

    describe('execute', () => {
      it('deve retornar um time quando o _id existir', async () => {
        const team = createTeamEntity();

        repository.read.mockResolvedValue(team);

        const result = await useCase.execute({ _id: 'team-id' });

        expect(repository.read).toHaveBeenCalledWith('team-id');
        expect(result).toEqual(team);
      });

      it('deve lançar exceção quando o time não for encontrado', async () => {
        repository.read.mockResolvedValue(null);

        await expect(useCase.execute({ _id: 'team-id' })).rejects.toThrow(
          new NotFoundException('Team not found'),
        );
      });
    });
  });

  describe('UpdateTeamUseCase', () => {
    let useCase: UpdateTeamUseCase;

    beforeEach(() => {
      useCase = new UpdateTeamUseCase(repository);
    });

    describe('execute', () => {
      it('deve atualizar um time normalizando o isoCode para maiusculo', async () => {
        const input: UpdateTeamInput = {
          _id: 'team-id',
          name: 'Brasil',
          isoCode: 'br',
          flagEmoji: '🇧🇷',
        };
        const team = createTeamEntity();

        repository.update.mockResolvedValue(team);

        const result = await useCase.execute(input);

        expect(repository.update).toHaveBeenCalledWith({
          ...input,
          isoCode: 'BR',
        });
        expect(result).toEqual(team);
      });

      it('deve atualizar um time sem alterar o isoCode quando ele não for informado', async () => {
        const input: UpdateTeamInput = {
          _id: 'team-id',
          name: 'Brasil',
        };
        const team = createTeamEntity();

        repository.update.mockResolvedValue(team);

        const result = await useCase.execute(input);

        expect(repository.update).toHaveBeenCalledWith({
          ...input,
          isoCode: undefined,
        });
        expect(result).toEqual(team);
      });

      it('deve lançar exceção quando o time não for encontrado', async () => {
        repository.update.mockResolvedValue(null);

        await expect(useCase.execute({ _id: 'team-id' })).rejects.toThrow(
          new NotFoundException('Team not found!'),
        );
      });
    });
  });

  describe('DeleteTeamUseCase', () => {
    let useCase: DeleteTeamUseCase;

    beforeEach(() => {
      useCase = new DeleteTeamUseCase(repository);
    });

    describe('execute', () => {
      it('deve remover um time existente', async () => {
        repository.read.mockResolvedValue(createTeamEntity());
        repository.delete.mockResolvedValue(undefined);

        await useCase.execute({ _id: 'team-id' });

        expect(repository.read).toHaveBeenCalledWith('team-id');
        expect(repository.delete).toHaveBeenCalledWith('team-id');
      });

      it('deve lançar exceção quando o time não for encontrado', async () => {
        repository.read.mockResolvedValue(null);

        await expect(useCase.execute({ _id: 'team-id' })).rejects.toThrow(
          new NotFoundException('Team not found!'),
        );
        expect(repository.delete).not.toHaveBeenCalled();
      });
    });
  });

  describe('ListTeamUseCase', () => {
    let useCase: ListTeamUseCase;

    beforeEach(() => {
      useCase = new ListTeamUseCase(repository);
    });

    describe('execute', () => {
      it('deve listar os times retornados pelo repositório', async () => {
        const teams = [
          createTeamEntity(),
          createTeamEntity({
            _id: 'team-id-2',
            name: 'Argentina',
            isoCode: 'AR',
            flagEmoji: '🇦🇷',
          }),
        ];

        repository.list.mockResolvedValue(teams);

        const result = await useCase.execute();

        expect(repository.list).toHaveBeenCalledTimes(1);
        expect(result).toEqual(teams);
      });

      it('deve retornar uma lista vazia quando não existirem times', async () => {
        repository.list.mockResolvedValue([]);

        const result = await useCase.execute();

        expect(repository.list).toHaveBeenCalledTimes(1);
        expect(result).toEqual([]);
      });
    });
  });
});
