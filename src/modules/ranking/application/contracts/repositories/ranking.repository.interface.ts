import { RankingEntity } from '@src/modules/ranking/domain/entities/ranking.entity';

export interface RankingRepositoryInterface {
  list(): Promise<RankingEntity[]>;
}
