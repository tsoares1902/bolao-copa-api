import { ListRankingUseCase } from '@src/modules/ranking/application/use-cases/list-ranking.use-case';
import { RankingOutputMapper } from '@src/modules/ranking/application/mappers/ranking-output.mapper';
import { RankingMapper } from '@src/modules/ranking/adapters/http/mappers/ranking.mapper';
import type { RankingRepositoryInterface } from '@src/modules/ranking/application/contracts/repositories/ranking.repository.interface';
import type { RankingEntity } from '@src/modules/ranking/domain/entities/ranking.entity';
import type { RankingOutput } from '@src/modules/ranking/application/dto/output/ranking.output';

type RankingRepositoryMock = jest.Mocked<RankingRepositoryInterface>;

const createRankingRepositoryMock = (): RankingRepositoryMock => ({
  list: jest.fn(),
});

const createRankingEntity = (
  overrides: Partial<RankingEntity> = {},
): RankingEntity => ({
  userId: 'user-id',
  name: 'Joao',
  alias: 'joao',
  totalPoints: 12,
  totalGuesses: 5,
  position: 1,
  ...overrides,
});

const createRankingOutput = (
  overrides: Partial<RankingOutput> = {},
): RankingOutput => ({
  userId: 'user-id',
  name: 'Joao',
  alias: 'joao',
  totalPoints: 12,
  totalGuesses: 5,
  position: 1,
  ...overrides,
});

describe('RankingUseCase', () => {
  let rankingRepository: RankingRepositoryMock;

  beforeEach(() => {
    rankingRepository = createRankingRepositoryMock();
  });

  describe('ListRankingUseCase', () => {
    let useCase: ListRankingUseCase;

    beforeEach(() => {
      useCase = new ListRankingUseCase(rankingRepository);
    });

    describe('execute', () => {
      it('deve listar o ranking mapeando as entidades retornadas pelo repositório', async () => {
        const rankings = [
          createRankingEntity(),
          createRankingEntity({
            userId: 'user-id-2',
            name: 'Maria',
            alias: undefined,
            totalPoints: 10,
            totalGuesses: 4,
            position: 2,
          }),
        ];

        rankingRepository.list.mockResolvedValue(rankings);

        const result = await useCase.execute();

        expect(rankingRepository.list).toHaveBeenCalledTimes(1);
        expect(result).toEqual([
          {
            userId: 'user-id',
            name: 'Joao',
            alias: 'joao',
            totalPoints: 12,
            totalGuesses: 5,
            position: 1,
          },
          {
            userId: 'user-id-2',
            name: 'Maria',
            alias: undefined,
            totalPoints: 10,
            totalGuesses: 4,
            position: 2,
          },
        ]);
      });

      it('deve retornar uma lista vazia quando o repositório não tiver ranking', async () => {
        rankingRepository.list.mockResolvedValue([]);

        const result = await useCase.execute();

        expect(rankingRepository.list).toHaveBeenCalledTimes(1);
        expect(result).toEqual([]);
      });
    });
  });

  describe('RankingOutputMapper', () => {
    it('deve mapear uma entidade de ranking para output', () => {
      const ranking = createRankingEntity({
        alias: undefined,
        totalPoints: 8,
        totalGuesses: 3,
        position: 4,
      });

      const result = RankingOutputMapper.toOutput(ranking);

      expect(result).toEqual({
        userId: 'user-id',
        name: 'Joao',
        alias: undefined,
        totalPoints: 8,
        totalGuesses: 3,
        position: 4,
      });
    });

    it('deve mapear uma lista de entidades de ranking para output', () => {
      const rankings = [
        createRankingEntity(),
        createRankingEntity({
          userId: 'user-id-2',
          name: 'Maria',
          totalPoints: 9,
          totalGuesses: 4,
          position: 2,
        }),
      ];

      const result = RankingOutputMapper.toOutputList(rankings);

      expect(result).toEqual([
        {
          userId: 'user-id',
          name: 'Joao',
          alias: 'joao',
          totalPoints: 12,
          totalGuesses: 5,
          position: 1,
        },
        {
          userId: 'user-id-2',
          name: 'Maria',
          alias: 'joao',
          totalPoints: 9,
          totalGuesses: 4,
          position: 2,
        },
      ]);
    });
  });

  describe('RankingMapper', () => {
    it('deve mapear um output de ranking para response', () => {
      const output = createRankingOutput({
        alias: undefined,
        totalPoints: 7,
        totalGuesses: 2,
        position: 5,
      });

      const result = RankingMapper.toResponse(output);

      expect(result).toEqual({
        userId: 'user-id',
        name: 'Joao',
        alias: undefined,
        totalPoints: 7,
        totalGuesses: 2,
        position: 5,
      });
    });

    it('deve mapear uma lista de outputs de ranking para response', () => {
      const outputs = [
        createRankingOutput(),
        createRankingOutput({
          userId: 'user-id-2',
          name: 'Maria',
          alias: 'maria',
          totalPoints: 11,
          totalGuesses: 4,
          position: 2,
        }),
      ];

      const result = RankingMapper.toResponseList(outputs);

      expect(result).toEqual([
        {
          userId: 'user-id',
          name: 'Joao',
          alias: 'joao',
          totalPoints: 12,
          totalGuesses: 5,
          position: 1,
        },
        {
          userId: 'user-id-2',
          name: 'Maria',
          alias: 'maria',
          totalPoints: 11,
          totalGuesses: 4,
          position: 2,
        },
      ]);
    });
  });
});
