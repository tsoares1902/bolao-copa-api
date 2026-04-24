import { CreateMatchInput } from '@src/modules/match/application/dto/input/create-match.input';
import { UpdateMatchInput } from '@src/modules/match/application/dto/input/update-match.input';
import { MatchEntity } from '@src/modules/match/domain/entities/match.entity';

export interface MatchRepositoryInterface {
  list(): Promise<MatchEntity[]>;
  create(input: CreateMatchInput): Promise<MatchEntity>;
  read(matchId: string): Promise<MatchEntity | null>;
  update(input: UpdateMatchInput): Promise<MatchEntity | null>;
  delete(matchId: string): Promise<void>;
}
