import { MatchOutput } from '@src/modules/match/application/dto/output/match.output';

export interface ListMatchUseCaseInterface {
  execute(): Promise<MatchOutput[]>;
}
