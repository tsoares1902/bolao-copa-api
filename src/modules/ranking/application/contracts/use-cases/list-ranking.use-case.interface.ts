import { RankingOutput } from '@src/modules/ranking/application/dto/output/ranking.output';

export interface ListRankingUseCaseInterface {
  execute(): Promise<RankingOutput[]>;
}
