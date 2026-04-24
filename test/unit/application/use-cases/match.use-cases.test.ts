import { BadRequestException, NotFoundException } from '@nestjs/common';

import { CreateMatchUseCase } from '@src/modules/match/application/use-cases/create-match.use-case';
import { ReadMatchUseCase } from '@src/modules/match/application/use-cases/read-match.use-case';
import { UpdateMatchUseCase } from '@src/modules/match/application/use-cases/update-match.use-case';
import { DeleteMatchUseCase } from '@src/modules/match/application/use-cases/delete-match.use-case';
import { ListMatchUseCase } from '@src/modules/match/application/use-cases/list-match.use-case';
import type { MatchRepositoryInterface } from '@src/modules/match/application/contracts/repositories/match.repository.interface';
import type { TeamRepositoryInterface } from '@src/modules/team/application/contracts/repositories/team.repository.interface';
import type { MatchEntity } from '@src/modules/match/domain/entities/match.entity';
import type { CreateMatchInput } from '@src/modules/match/application/dto/input/create-match.input';
import type { UpdateMatchInput } from '@src/modules/match/application/dto/input/update-match.input';
import { MatchGroup } from '@src/modules/match/domain/enums/match-group.enum';
import { MatchPhase } from '@src/modules/match/domain/enums/match-phase.enum';
import { MatchStatus } from '@src/modules/match/domain/enums/match-status.enum';
import type { TeamEntity } from '@src/modules/team/domain/entities/team.entity';

type MatchRepositoryMock = jest.Mocked<MatchRepositoryInterface>;
type TeamRepositoryMock = jest.Mocked<TeamRepositoryInterface>;

const createMatchRepositoryMock = (): MatchRepositoryMock => ({
  list: jest.fn(),
  create: jest.fn(),
  read: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

const createTeamRepositoryMock = (): TeamRepositoryMock => ({
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

const createMatchEntity = (
  overrides: Partial<MatchEntity> = {},
): MatchEntity => ({
  _id: 'match-id',
  homeTeamId: 'team-id-1',
  awayTeamId: 'team-id-2',
  stadiumId: 'stadium-id',
  matchDate: new Date('2026-06-10T20:00:00.000Z'),
  phase: MatchPhase.GROUP_STAGE,
  groupName: MatchGroup.GROUP_A,
  homeTeamScore: null,
  awayTeamScore: null,
  status: MatchStatus.SCHEDULED,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-02T00:00:00.000Z'),
  ...overrides,
});

describe('Use Cases de Match', () => {
  let matchRepository: MatchRepositoryMock;
  let teamRepository: TeamRepositoryMock;

  beforeEach(() => {
    matchRepository = createMatchRepositoryMock();
    teamRepository = createTeamRepositoryMock();
  });

  describe('CreateMatchUseCase', () => {
    let useCase: CreateMatchUseCase;

    beforeEach(() => {
      useCase = new CreateMatchUseCase(matchRepository, teamRepository);
    });

    describe('execute', () => {
      it('deve criar uma partida preenchendo valores padrao', async () => {
        const input: CreateMatchInput = {
          homeTeamId: 'team-id-1',
          awayTeamId: 'team-id-2',
          stadiumId: 'stadium-id',
          matchDate: new Date('2026-06-10T20:00:00.000Z'),
          phase: MatchPhase.GROUP_STAGE,
          groupName: MatchGroup.GROUP_A,
        };
        const match = createMatchEntity();

        teamRepository.read
          .mockResolvedValueOnce(createTeamEntity({ _id: 'team-id-1' }))
          .mockResolvedValueOnce(
            createTeamEntity({ _id: 'team-id-2', name: 'Argentina' }),
          );
        matchRepository.create.mockResolvedValue(match);

        const result = await useCase.execute(input);

        expect(teamRepository.read).toHaveBeenNthCalledWith(1, 'team-id-1');
        expect(teamRepository.read).toHaveBeenNthCalledWith(2, 'team-id-2');
        expect(matchRepository.create).toHaveBeenCalledWith({
          ...input,
          homeTeamScore: null,
          awayTeamScore: null,
          status: MatchStatus.SCHEDULED,
        });
        expect(result).toEqual(match);
      });

      it('deve lançar exceção quando o grupo for informado fora da fase de grupos', async () => {
        await expect(
          useCase.execute({
            homeTeamId: 'team-id-1',
            awayTeamId: 'team-id-2',
            stadiumId: 'stadium-id',
            matchDate: new Date('2026-06-10T20:00:00.000Z'),
            phase: MatchPhase.FINAL,
            groupName: MatchGroup.GROUP_A,
          }),
        ).rejects.toThrow(
          new BadRequestException(
            'Grupo só é permitido para jogos da Fase de Grupos',
          ),
        );

        expect(matchRepository.create).not.toHaveBeenCalled();
      });

      it('deve lançar exceção quando os times forem iguais', async () => {
        await expect(
          useCase.execute({
            homeTeamId: 'team-id-1',
            awayTeamId: 'team-id-1',
            stadiumId: 'stadium-id',
            matchDate: new Date('2026-06-10T20:00:00.000Z'),
            phase: MatchPhase.GROUP_STAGE,
          }),
        ).rejects.toThrow(
          new BadRequestException('Home team and away team must be different!'),
        );

        expect(matchRepository.create).not.toHaveBeenCalled();
      });

      it('deve lançar exceção quando algum time for inválido', async () => {
        teamRepository.read
          .mockResolvedValueOnce(createTeamEntity())
          .mockResolvedValueOnce(null);

        await expect(
          useCase.execute({
            homeTeamId: 'team-id-1',
            awayTeamId: 'team-id-2',
            stadiumId: 'stadium-id',
            matchDate: new Date('2026-06-10T20:00:00.000Z'),
            phase: MatchPhase.GROUP_STAGE,
          }),
        ).rejects.toThrow(
          new BadRequestException('Home team or away team is invalid!'),
        );
      });
    });
  });

  describe('ReadMatchUseCase', () => {
    let useCase: ReadMatchUseCase;

    beforeEach(() => {
      useCase = new ReadMatchUseCase(matchRepository);
    });

    describe('execute', () => {
      it('deve retornar uma partida quando o matchId existir', async () => {
        const match = createMatchEntity();

        matchRepository.read.mockResolvedValue(match);

        const result = await useCase.execute({ matchId: 'match-id' });

        expect(matchRepository.read).toHaveBeenCalledWith('match-id');
        expect(result).toEqual(match);
      });

      it('deve lançar exceção quando a partida não for encontrada', async () => {
        matchRepository.read.mockResolvedValue(null);

        await expect(useCase.execute({ matchId: 'match-id' })).rejects.toThrow(
          new NotFoundException('Match not found!'),
        );
      });
    });
  });

  describe('UpdateMatchUseCase', () => {
    let useCase: UpdateMatchUseCase;

    beforeEach(() => {
      useCase = new UpdateMatchUseCase(matchRepository, teamRepository);
    });

    describe('execute', () => {
      it('deve atualizar uma partida existente', async () => {
        const currentMatch = createMatchEntity();
        const input: UpdateMatchInput = {
          matchId: 'match-id',
          homeTeamId: 'team-id-3',
          awayTeamId: 'team-id-4',
          phase: MatchPhase.GROUP_STAGE,
          groupName: MatchGroup.GROUP_B,
          status: MatchStatus.LIVE,
        };
        const updatedMatch = createMatchEntity({
          homeTeamId: 'team-id-3',
          awayTeamId: 'team-id-4',
          groupName: MatchGroup.GROUP_B,
          status: MatchStatus.LIVE,
        });

        matchRepository.read.mockResolvedValue(currentMatch);
        teamRepository.read
          .mockResolvedValueOnce(createTeamEntity({ _id: 'team-id-3' }))
          .mockResolvedValueOnce(
            createTeamEntity({ _id: 'team-id-4', name: 'Uruguai' }),
          );
        matchRepository.update.mockResolvedValue(updatedMatch);

        const result = await useCase.execute(input);

        expect(matchRepository.read).toHaveBeenCalledWith('match-id');
        expect(teamRepository.read).toHaveBeenNthCalledWith(1, 'team-id-3');
        expect(teamRepository.read).toHaveBeenNthCalledWith(2, 'team-id-4');
        expect(matchRepository.update).toHaveBeenCalledWith(input);
        expect(result).toEqual(updatedMatch);
      });

      it('deve usar os times atuais quando eles não forem informados na atualização', async () => {
        const currentMatch = createMatchEntity();
        const updatedMatch = createMatchEntity({
          status: MatchStatus.FINISHED,
        });

        matchRepository.read.mockResolvedValue(currentMatch);
        teamRepository.read
          .mockResolvedValueOnce(createTeamEntity({ _id: 'team-id-1' }))
          .mockResolvedValueOnce(
            createTeamEntity({ _id: 'team-id-2', name: 'Argentina' }),
          );
        matchRepository.update.mockResolvedValue(updatedMatch);

        const result = await useCase.execute({
          matchId: 'match-id',
          status: MatchStatus.FINISHED,
        });

        expect(teamRepository.read).toHaveBeenNthCalledWith(1, 'team-id-1');
        expect(teamRepository.read).toHaveBeenNthCalledWith(2, 'team-id-2');
        expect(result).toEqual(updatedMatch);
      });

      it('deve lançar exceção quando a partida não for encontrada antes de atualizar', async () => {
        matchRepository.read.mockResolvedValue(null);

        await expect(useCase.execute({ matchId: 'match-id' })).rejects.toThrow(
          new NotFoundException('Match not found'),
        );

        expect(matchRepository.update).not.toHaveBeenCalled();
      });

      it('deve lançar exceção quando o update retornar nulo', async () => {
        matchRepository.read.mockResolvedValue(createMatchEntity());
        teamRepository.read
          .mockResolvedValueOnce(createTeamEntity({ _id: 'team-id-1' }))
          .mockResolvedValueOnce(createTeamEntity({ _id: 'team-id-2' }));
        matchRepository.update.mockResolvedValue(null);

        await expect(useCase.execute({ matchId: 'match-id' })).rejects.toThrow(
          new NotFoundException('Match not found'),
        );
      });
    });
  });

  describe('DeleteMatchUseCase', () => {
    let useCase: DeleteMatchUseCase;

    beforeEach(() => {
      useCase = new DeleteMatchUseCase(matchRepository);
    });

    describe('execute', () => {
      it('deve remover uma partida existente', async () => {
        matchRepository.read.mockResolvedValue(createMatchEntity());
        matchRepository.delete.mockResolvedValue(undefined);

        await useCase.execute({ matchId: 'match-id' });

        expect(matchRepository.read).toHaveBeenCalledWith('match-id');
        expect(matchRepository.delete).toHaveBeenCalledWith('match-id');
      });

      it('deve lançar exceção quando a partida não for encontrada', async () => {
        matchRepository.read.mockResolvedValue(null);

        await expect(useCase.execute({ matchId: 'match-id' })).rejects.toThrow(
          new NotFoundException('Match not found'),
        );
        expect(matchRepository.delete).not.toHaveBeenCalled();
      });
    });
  });

  describe('ListMatchUseCase', () => {
    let useCase: ListMatchUseCase;

    beforeEach(() => {
      useCase = new ListMatchUseCase(matchRepository);
    });

    describe('execute', () => {
      it('deve listar as partidas retornadas pelo repositório', async () => {
        const matches = [
          createMatchEntity(),
          createMatchEntity({
            _id: 'match-id-2',
            homeTeamId: 'team-id-3',
            awayTeamId: 'team-id-4',
            groupName: MatchGroup.GROUP_B,
          }),
        ];

        matchRepository.list.mockResolvedValue(matches);

        const result = await useCase.execute();

        expect(matchRepository.list).toHaveBeenCalledTimes(1);
        expect(result).toEqual(matches);
      });

      it('deve retornar uma lista vazia quando não existirem partidas', async () => {
        matchRepository.list.mockResolvedValue([]);

        const result = await useCase.execute();

        expect(matchRepository.list).toHaveBeenCalledTimes(1);
        expect(result).toEqual([]);
      });
    });
  });
});
