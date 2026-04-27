import { Inject, Injectable } from '@nestjs/common';

import { RANKING_REPOSITORY_INTERFACE } from '@src/modules/ranking/application/contracts/tokens/ranking.tokens';
import { RankingOutput } from '@src/modules/ranking/application/dto/output/ranking.output';
import { RankingOutputMapper } from '@src/modules/ranking/application/mappers/ranking-output.mapper';
import type { RankingRepositoryInterface } from '@src/modules/ranking/application/contracts/repositories/ranking.repository.interface';
import type { ListRankingUseCaseInterface } from '@src/modules/ranking/application/contracts/use-cases/list-ranking.use-case.interface';

@Injectable()
export class ListRankingUseCase implements ListRankingUseCaseInterface {
  constructor(
    @Inject(RANKING_REPOSITORY_INTERFACE)
    private readonly rankingRepository: RankingRepositoryInterface,
  ) {}

  async execute(): Promise<RankingOutput[]> {
    const rankings = await this.rankingRepository.list();

    return RankingOutputMapper.toOutputList(rankings);
  }
}
