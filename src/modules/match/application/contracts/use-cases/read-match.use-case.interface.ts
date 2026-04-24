import { ReadMatchInput } from '@src/modules/match/application/dto/input/read-match.input';
import { MatchOutput } from '@src/modules/match/application/dto/output/match.output';

export interface ReadMatchUseCaseInterface {
  execute(input: ReadMatchInput): Promise<MatchOutput>;
}
