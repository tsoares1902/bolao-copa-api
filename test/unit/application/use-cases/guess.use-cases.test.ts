import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

import { CalculateGuessPointsUseCase } from '@src/modules/guess/application/use-cases/calculate-guess-points.use-case';
import { CreateGuessUseCase } from '@src/modules/guess/application/use-cases/create-guess.use-case';
import { DeleteGuessUseCase } from '@src/modules/guess/application/use-cases/delete-guess.use-case';
import { ListGuessByMatchUseCase } from '@src/modules/guess/application/use-cases/list-guess-by-match.use-case';
import { ListGuessUseCase } from '@src/modules/guess/application/use-cases/list-guess.use-case';
import { ListMyGuessUseCase } from '@src/modules/guess/application/use-cases/list-my-guess.use-case';
import { ReadGuessUseCase } from '@src/modules/guess/application/use-cases/read-guess.use-case';
import { UpdateGuessUseCase } from '@src/modules/guess/application/use-cases/update-guess.use-case';
import type { GuessRepositoryInterface } from '@src/modules/guess/application/contracts/repositories/guess.repository.interface';
import type { CreateGuessInput } from '@src/modules/guess/application/dto/input/create-guess.input';
import type { UpdateGuessInput } from '@src/modules/guess/application/dto/input/update-guess.input';
import type { GuessEntity } from '@src/modules/guess/domain/entities/guess.entity';
import type { MatchRepositoryInterface } from '@src/modules/match/application/contracts/repositories/match.repository.interface';
import { MatchPhase } from '@src/modules/match/domain/enums/match-phase.enum';
import { MatchStatus } from '@src/modules/match/domain/enums/match-status.enum';
import type { MatchEntity } from '@src/modules/match/domain/entities/match.entity';
import type { UserRepositoryInterface } from '@src/modules/user/application/contracts/repositories/user.repository.interface';
import type { UserEntity } from '@src/modules/user/domain/entities/user.entity';

type GuessRepositoryMock = jest.Mocked<GuessRepositoryInterface>;
type MatchRepositoryMock = jest.Mocked<MatchRepositoryInterface>;
type UserRepositoryMock = jest.Mocked<UserRepositoryInterface>;

const createGuessRepositoryMock = (): GuessRepositoryMock => ({
  list: jest.fn(),
  create: jest.fn(),
  read: jest.fn(),
  listByUser: jest.fn(),
  listByMatch: jest.fn(),
  findByUserAndMatch: jest.fn(),
  update: jest.fn(),
  updatePoints: jest.fn(),
  delete: jest.fn(),
});

const createMatchRepositoryMock = (): MatchRepositoryMock => ({
  list: jest.fn(),
  create: jest.fn(),
  read: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
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

const createGuessEntity = (
  overrides: Partial<GuessEntity> = {},
): GuessEntity => ({
  _id: 'guess-id',
  userId: 'user-id',
  matchId: 'match-id',
  guessedHomeScore: 2,
  guessedAwayScore: 1,
  pointsEarned: 0,
  isCalculated: false,
  createdAt: new Date('2026-06-01T00:00:00.000Z'),
  updatedAt: new Date('2026-06-01T00:00:00.000Z'),
  ...overrides,
});

const createMatchEntity = (
  overrides: Partial<MatchEntity> = {},
): MatchEntity => ({
  _id: 'match-id',
  homeTeamId: 'team-1',
  awayTeamId: 'team-2',
  stadiumId: 'stadium-id',
  matchDate: new Date('2099-06-10T20:00:00.000Z'),
  phase: MatchPhase.GROUP_STAGE,
  homeTeamScore: null,
  awayTeamScore: null,
  status: MatchStatus.SCHEDULED,
  createdAt: new Date('2026-06-01T00:00:00.000Z'),
  updatedAt: new Date('2026-06-01T00:00:00.000Z'),
  ...overrides,
});

const createUserEntity = (overrides: Partial<UserEntity> = {}): UserEntity => ({
  _id: 'user-id',
  name: 'Joao',
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
  createdAt: new Date('2026-06-01T00:00:00.000Z'),
  updatedAt: new Date('2026-06-01T00:00:00.000Z'),
  ...overrides,
});

describe('GuessUseCase', () => {
  let guessRepository: GuessRepositoryMock;
  let matchRepository: MatchRepositoryMock;
  let userRepository: UserRepositoryMock;

  beforeEach(() => {
    guessRepository = createGuessRepositoryMock();
    matchRepository = createMatchRepositoryMock();
    userRepository = createUserRepositoryMock();
  });

  describe('CreateGuessUseCase', () => {
    let useCase: CreateGuessUseCase;

    beforeEach(() => {
      useCase = new CreateGuessUseCase(
        guessRepository,
        userRepository,
        matchRepository,
      );
    });

    it('deve criar um palpite quando usuário e partida forem válidos', async () => {
      const input: CreateGuessInput = {
        userId: 'user-id',
        matchId: 'match-id',
        guessedHomeScore: 2,
        guessedAwayScore: 1,
      };
      const guess = createGuessEntity();

      userRepository.read.mockResolvedValue(createUserEntity());
      matchRepository.read.mockResolvedValue(createMatchEntity());
      guessRepository.findByUserAndMatch.mockResolvedValue(null);
      guessRepository.create.mockResolvedValue(guess);

      const result = await useCase.execute(input);

      expect(userRepository.read).toHaveBeenCalledWith('user-id');
      expect(matchRepository.read).toHaveBeenCalledWith('match-id');
      expect(guessRepository.findByUserAndMatch).toHaveBeenCalledWith({
        userId: 'user-id',
        matchId: 'match-id',
      });
      expect(guessRepository.create).toHaveBeenCalledWith(input);
      expect(result).toEqual({
        _id: 'guess-id',
        userId: 'user-id',
        matchId: 'match-id',
        guessedHomeScore: 2,
        guessedAwayScore: 1,
        pointsEarned: 0,
        createdAt: new Date('2026-06-01T00:00:00.000Z'),
        updatedAt: new Date('2026-06-01T00:00:00.000Z'),
      });
    });

    it('deve lançar exceção quando algum placar for negativo', async () => {
      await expect(
        useCase.execute({
          userId: 'user-id',
          matchId: 'match-id',
          guessedHomeScore: -1,
          guessedAwayScore: 0,
        }),
      ).rejects.toThrow(
        new BadRequestException('Scores must be greater than or equal to 0'),
      );

      expect(userRepository.read).not.toHaveBeenCalled();
    });

    it('deve lançar exceção quando o usuário não for encontrado', async () => {
      userRepository.read.mockResolvedValue(null);

      await expect(
        useCase.execute({
          userId: 'user-id',
          matchId: 'match-id',
          guessedHomeScore: 1,
          guessedAwayScore: 0,
        }),
      ).rejects.toThrow(new NotFoundException('User not found'));
    });

    it('deve lançar exceção quando a partida não for encontrada', async () => {
      userRepository.read.mockResolvedValue(createUserEntity());
      matchRepository.read.mockResolvedValue(null);

      await expect(
        useCase.execute({
          userId: 'user-id',
          matchId: 'match-id',
          guessedHomeScore: 1,
          guessedAwayScore: 0,
        }),
      ).rejects.toThrow(new NotFoundException('Match not found!'));
    });

    it('deve lançar exceção quando o jogo já tiver começado', async () => {
      userRepository.read.mockResolvedValue(createUserEntity());
      matchRepository.read.mockResolvedValue(
        createMatchEntity({
          matchDate: new Date('2020-01-01T00:00:00.000Z'),
        }),
      );

      await expect(
        useCase.execute({
          userId: 'user-id',
          matchId: 'match-id',
          guessedHomeScore: 1,
          guessedAwayScore: 0,
        }),
      ).rejects.toThrow(
        new BadRequestException(
          'Guess can only be created or updated before the match starts',
        ),
      );
    });

    it('deve lançar exceção quando já existir palpite para a partida', async () => {
      userRepository.read.mockResolvedValue(createUserEntity());
      matchRepository.read.mockResolvedValue(createMatchEntity());
      guessRepository.findByUserAndMatch.mockResolvedValue(createGuessEntity());

      await expect(
        useCase.execute({
          userId: 'user-id',
          matchId: 'match-id',
          guessedHomeScore: 1,
          guessedAwayScore: 0,
        }),
      ).rejects.toThrow(
        new ConflictException('Guess already exists for this match!'),
      );

      expect(guessRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('ReadGuessUseCase', () => {
    let useCase: ReadGuessUseCase;

    beforeEach(() => {
      useCase = new ReadGuessUseCase(guessRepository);
    });

    it('deve retornar um palpite quando ele existir', async () => {
      const guess = createGuessEntity();
      guessRepository.read.mockResolvedValue(guess);

      const result = await useCase.execute({ guessId: 'guess-id' });

      expect(guessRepository.read).toHaveBeenCalledWith('guess-id');
      expect(result).toEqual({
        _id: 'guess-id',
        userId: 'user-id',
        matchId: 'match-id',
        guessedHomeScore: 2,
        guessedAwayScore: 1,
        pointsEarned: 0,
        createdAt: new Date('2026-06-01T00:00:00.000Z'),
        updatedAt: new Date('2026-06-01T00:00:00.000Z'),
      });
    });

    it('deve lançar exceção quando o palpite não for encontrado', async () => {
      guessRepository.read.mockResolvedValue(null);

      await expect(useCase.execute({ guessId: 'guess-id' })).rejects.toThrow(
        new NotFoundException('Guess not found'),
      );
    });
  });

  describe('UpdateGuessUseCase', () => {
    let useCase: UpdateGuessUseCase;

    beforeEach(() => {
      useCase = new UpdateGuessUseCase(guessRepository, matchRepository);
    });

    it('deve atualizar um palpite existente', async () => {
      const input: UpdateGuessInput = {
        guessId: 'guess-id',
        userId: 'user-id',
        guessedHomeScore: 3,
        guessedAwayScore: 1,
      };
      const currentGuess = createGuessEntity();
      const updatedGuess = createGuessEntity({
        guessedHomeScore: 3,
        guessedAwayScore: 1,
      });

      guessRepository.read.mockResolvedValue(currentGuess);
      matchRepository.read.mockResolvedValue(createMatchEntity());
      guessRepository.update.mockResolvedValue(updatedGuess);

      const result = await useCase.execute(input);

      expect(guessRepository.read).toHaveBeenCalledWith('guess-id');
      expect(matchRepository.read).toHaveBeenCalledWith('match-id');
      expect(guessRepository.update).toHaveBeenCalledWith(input);
      expect(result).toEqual({
        _id: 'guess-id',
        userId: 'user-id',
        matchId: 'match-id',
        guessedHomeScore: 3,
        guessedAwayScore: 1,
        pointsEarned: 0,
        createdAt: new Date('2026-06-01T00:00:00.000Z'),
        updatedAt: new Date('2026-06-01T00:00:00.000Z'),
      });
    });

    it('deve lançar exceção quando o placar da casa for negativo', async () => {
      await expect(
        useCase.execute({
          guessId: 'guess-id',
          userId: 'user-id',
          guessedHomeScore: -1,
        }),
      ).rejects.toThrow(
        new BadRequestException(
          'Home score must be greater than or equal to 0',
        ),
      );
    });

    it('deve lançar exceção quando o placar visitante for negativo', async () => {
      await expect(
        useCase.execute({
          guessId: 'guess-id',
          userId: 'user-id',
          guessedAwayScore: -1,
        }),
      ).rejects.toThrow(
        new BadRequestException(
          'Away score must be greater than or equal to 0',
        ),
      );
    });

    it('deve lançar exceção quando o palpite não for encontrado antes do update', async () => {
      guessRepository.read.mockResolvedValue(null);

      await expect(
        useCase.execute({
          guessId: 'guess-id',
          userId: 'user-id',
        }),
      ).rejects.toThrow(new NotFoundException('Guess not found!'));

      expect(guessRepository.update).not.toHaveBeenCalled();
    });

    it('deve lançar exceção quando o palpite não pertencer ao usuário', async () => {
      guessRepository.read.mockResolvedValue(
        createGuessEntity({
          userId: 'other-user',
        }),
      );

      await expect(
        useCase.execute({
          guessId: 'guess-id',
          userId: 'user-id',
        }),
      ).rejects.toThrow(new NotFoundException('Guess not found!'));
    });

    it('deve lançar exceção quando a partida vinculada não for encontrada', async () => {
      guessRepository.read.mockResolvedValue(createGuessEntity());
      matchRepository.read.mockResolvedValue(null);

      await expect(
        useCase.execute({
          guessId: 'guess-id',
          userId: 'user-id',
        }),
      ).rejects.toThrow(new NotFoundException('Match not found!'));
    });

    it('deve lançar exceção quando o jogo já tiver começado', async () => {
      guessRepository.read.mockResolvedValue(createGuessEntity());
      matchRepository.read.mockResolvedValue(
        createMatchEntity({
          matchDate: new Date('2020-01-01T00:00:00.000Z'),
        }),
      );

      await expect(
        useCase.execute({
          guessId: 'guess-id',
          userId: 'user-id',
        }),
      ).rejects.toThrow(
        new BadRequestException(
          'Guess can only be created or updated before the match starts',
        ),
      );
    });

    it('deve lançar exceção quando o update retornar nulo', async () => {
      guessRepository.read.mockResolvedValue(createGuessEntity());
      matchRepository.read.mockResolvedValue(createMatchEntity());
      guessRepository.update.mockResolvedValue(null);

      await expect(
        useCase.execute({
          guessId: 'guess-id',
          userId: 'user-id',
        }),
      ).rejects.toThrow(new NotFoundException('Guess not found!'));
    });
  });

  describe('DeleteGuessUseCase', () => {
    let useCase: DeleteGuessUseCase;

    beforeEach(() => {
      useCase = new DeleteGuessUseCase(guessRepository, matchRepository);
    });

    it('deve excluir um palpite do próprio usuário antes do início da partida', async () => {
      guessRepository.read.mockResolvedValue(createGuessEntity());
      matchRepository.read.mockResolvedValue(createMatchEntity());
      guessRepository.delete.mockResolvedValue(undefined);

      await useCase.execute({
        guessId: 'guess-id',
        userId: 'user-id',
      });

      expect(guessRepository.delete).toHaveBeenCalledWith('guess-id');
    });

    it('deve lançar exceção quando o palpite não for encontrado', async () => {
      guessRepository.read.mockResolvedValue(null);

      await expect(
        useCase.execute({
          guessId: 'guess-id',
          userId: 'user-id',
        }),
      ).rejects.toThrow(new NotFoundException('Guess not found!'));
    });

    it('deve lançar exceção quando o palpite não pertencer ao usuário', async () => {
      guessRepository.read.mockResolvedValue(
        createGuessEntity({
          userId: 'other-user',
        }),
      );

      await expect(
        useCase.execute({
          guessId: 'guess-id',
          userId: 'user-id',
        }),
      ).rejects.toThrow(new NotFoundException('Guess not found!'));
    });

    it('deve lançar exceção quando a partida vinculada não for encontrada', async () => {
      guessRepository.read.mockResolvedValue(createGuessEntity());
      matchRepository.read.mockResolvedValue(null);

      await expect(
        useCase.execute({
          guessId: 'guess-id',
          userId: 'user-id',
        }),
      ).rejects.toThrow(new NotFoundException('Match not found!'));
    });
  });

  describe('ListGuessUseCase', () => {
    let useCase: ListGuessUseCase;

    beforeEach(() => {
      useCase = new ListGuessUseCase(guessRepository);
    });

    it('deve listar todos os palpites', async () => {
      const guesses = [
        createGuessEntity(),
        createGuessEntity({
          _id: 'guess-id-2',
          userId: 'user-id-2',
          matchId: 'match-id-2',
        }),
      ];
      guessRepository.list.mockResolvedValue(guesses);

      const result = await useCase.execute();

      expect(guessRepository.list).toHaveBeenCalledTimes(1);
      expect(result).toEqual([
        {
          _id: 'guess-id',
          userId: 'user-id',
          matchId: 'match-id',
          guessedHomeScore: 2,
          guessedAwayScore: 1,
          pointsEarned: 0,
          createdAt: new Date('2026-06-01T00:00:00.000Z'),
          updatedAt: new Date('2026-06-01T00:00:00.000Z'),
        },
        {
          _id: 'guess-id-2',
          userId: 'user-id-2',
          matchId: 'match-id-2',
          guessedHomeScore: 2,
          guessedAwayScore: 1,
          pointsEarned: 0,
          createdAt: new Date('2026-06-01T00:00:00.000Z'),
          updatedAt: new Date('2026-06-01T00:00:00.000Z'),
        },
      ]);
    });
  });

  describe('ListMyGuessUseCase', () => {
    let useCase: ListMyGuessUseCase;

    beforeEach(() => {
      useCase = new ListMyGuessUseCase(guessRepository);
    });

    it('deve listar os palpites do usuário autenticado', async () => {
      const guesses = [createGuessEntity()];
      guessRepository.listByUser.mockResolvedValue(guesses);

      const result = await useCase.execute({ userId: 'user-id' });

      expect(guessRepository.listByUser).toHaveBeenCalledWith('user-id');
      expect(result).toEqual([
        {
          _id: 'guess-id',
          userId: 'user-id',
          matchId: 'match-id',
          guessedHomeScore: 2,
          guessedAwayScore: 1,
          pointsEarned: 0,
          createdAt: new Date('2026-06-01T00:00:00.000Z'),
          updatedAt: new Date('2026-06-01T00:00:00.000Z'),
        },
      ]);
    });
  });

  describe('ListGuessByMatchUseCase', () => {
    let useCase: ListGuessByMatchUseCase;

    beforeEach(() => {
      useCase = new ListGuessByMatchUseCase(guessRepository, matchRepository);
    });

    it('deve listar os palpites da partida quando ela existir', async () => {
      const guesses = [createGuessEntity()];
      matchRepository.read.mockResolvedValue(createMatchEntity());
      guessRepository.listByMatch.mockResolvedValue(guesses);

      const result = await useCase.execute({ matchId: 'match-id' });

      expect(matchRepository.read).toHaveBeenCalledWith('match-id');
      expect(guessRepository.listByMatch).toHaveBeenCalledWith('match-id');
      expect(result).toEqual([
        {
          _id: 'guess-id',
          userId: 'user-id',
          matchId: 'match-id',
          guessedHomeScore: 2,
          guessedAwayScore: 1,
          pointsEarned: 0,
          createdAt: new Date('2026-06-01T00:00:00.000Z'),
          updatedAt: new Date('2026-06-01T00:00:00.000Z'),
        },
      ]);
    });

    it('deve lançar exceção quando a partida não for encontrada', async () => {
      matchRepository.read.mockResolvedValue(null);

      await expect(useCase.execute({ matchId: 'match-id' })).rejects.toThrow(
        new NotFoundException('Match not found!'),
      );
    });
  });

  describe('CalculateGuessPointsUseCase', () => {
    let useCase: CalculateGuessPointsUseCase;

    beforeEach(() => {
      useCase = new CalculateGuessPointsUseCase(
        guessRepository,
        matchRepository,
      );
    });

    it('deve calcular e persistir os pontos dos palpites de uma partida finalizada', async () => {
      const guesses = [
        createGuessEntity({
          _id: 'guess-1',
          guessedHomeScore: 2,
          guessedAwayScore: 1,
        }),
        createGuessEntity({
          _id: 'guess-2',
          guessedHomeScore: 3,
          guessedAwayScore: 2,
        }),
        createGuessEntity({
          _id: 'guess-3',
          guessedHomeScore: 0,
          guessedAwayScore: 1,
        }),
      ];

      matchRepository.read.mockResolvedValue(
        createMatchEntity({
          status: MatchStatus.FINISHED,
          homeTeamScore: 2,
          awayTeamScore: 1,
        }),
      );
      guessRepository.listByMatch.mockResolvedValue(guesses);
      guessRepository.updatePoints
        .mockResolvedValueOnce(
          createGuessEntity({
            _id: 'guess-1',
            guessedHomeScore: 2,
            guessedAwayScore: 1,
            pointsEarned: 10,
          }),
        )
        .mockResolvedValueOnce(
          createGuessEntity({
            _id: 'guess-2',
            guessedHomeScore: 3,
            guessedAwayScore: 2,
            pointsEarned: 5,
          }),
        )
        .mockResolvedValueOnce(
          createGuessEntity({
            _id: 'guess-3',
            guessedHomeScore: 0,
            guessedAwayScore: 1,
            pointsEarned: 0,
          }),
        );

      const result = await useCase.execute({ matchId: 'match-id' });

      expect(guessRepository.updatePoints).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          guessId: 'guess-1',
          pointsEarned: 10,
          isCalculated: true,
          calculatedAt: expect.any(Date),
        }),
      );
      expect(guessRepository.updatePoints).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          guessId: 'guess-2',
          pointsEarned: 5,
          isCalculated: true,
          calculatedAt: expect.any(Date),
        }),
      );
      expect(guessRepository.updatePoints).toHaveBeenNthCalledWith(
        3,
        expect.objectContaining({
          guessId: 'guess-3',
          pointsEarned: 0,
          isCalculated: true,
          calculatedAt: expect.any(Date),
        }),
      );
      expect(result).toHaveLength(3);
    });

    it('deve ignorar palpites cujo updatePoints retornar nulo', async () => {
      matchRepository.read.mockResolvedValue(
        createMatchEntity({
          status: MatchStatus.FINISHED,
          homeTeamScore: 1,
          awayTeamScore: 1,
        }),
      );
      guessRepository.listByMatch.mockResolvedValue([createGuessEntity()]);
      guessRepository.updatePoints.mockResolvedValue(null);

      const result = await useCase.execute({ matchId: 'match-id' });

      expect(result).toEqual([]);
    });

    it('deve lançar exceção quando a partida não for encontrada', async () => {
      matchRepository.read.mockResolvedValue(null);

      await expect(useCase.execute({ matchId: 'match-id' })).rejects.toThrow(
        new NotFoundException('Match not found!'),
      );
    });

    it('deve lançar exceção quando a partida não estiver finalizada', async () => {
      matchRepository.read.mockResolvedValue(createMatchEntity());

      await expect(useCase.execute({ matchId: 'match-id' })).rejects.toThrow(
        new BadRequestException(
          'Guess points can only be calculated for finished matches',
        ),
      );
    });

    it('deve lançar exceção quando a partida finalizada não tiver placar', async () => {
      matchRepository.read.mockResolvedValue(
        createMatchEntity({
          status: MatchStatus.FINISHED,
          homeTeamScore: null,
          awayTeamScore: 1,
        }),
      );

      await expect(useCase.execute({ matchId: 'match-id' })).rejects.toThrow(
        new BadRequestException('Match score is required to calculate points'),
      );
    });
  });
});
