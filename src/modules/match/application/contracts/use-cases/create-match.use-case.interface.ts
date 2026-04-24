import { CreateMatchInput } from '@src/modules/match/application/dto/input/create-match.input';
import { MatchOutput } from '@src/modules/match/application/dto/output/match.output';

export interface CreateMatchUseCaseInterface {
  execute(input: CreateMatchInput): Promise<MatchOutput>;
}
