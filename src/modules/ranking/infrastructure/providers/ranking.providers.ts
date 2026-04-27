import {
  LIST_RANKING_USE_CASE_INTERFACE,
  RANKING_REPOSITORY_INTERFACE,
} from '@src/modules/ranking/application/contracts/tokens/ranking.tokens';

import { RankingRepository } from '@src/modules/ranking/infrastructure/repositories/ranking.repository';
import { ListRankingUseCase } from '@src/modules/ranking/application/use-cases/list-ranking.use-case';

export const rankingProviders = [
  {
    provide: RANKING_REPOSITORY_INTERFACE,
    useClass: RankingRepository,
  },
  {
    provide: LIST_RANKING_USE_CASE_INTERFACE,
    useClass: ListRankingUseCase,
  },
];
