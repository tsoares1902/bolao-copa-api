import { UpdateMatchInput } from '@src/modules/match/application/dto/input/update-match.input';
import { MatchOutput } from '@src/modules/match/application/dto/output/match.output';

export interface UpdateMatchUseCaseInterface {
  execute(input: UpdateMatchInput): Promise<MatchOutput>;
}
