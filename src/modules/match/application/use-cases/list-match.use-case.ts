import { Inject, Injectable } from '@nestjs/common';

import type { MatchRepositoryInterface } from '@src/modules/match/application/contracts/repositories/match.repository.interface';
import type { ListMatchUseCaseInterface } from '@src/modules/match/application/contracts/use-cases/list-match.use-case.interface';
import { MATCH_REPOSITORY_INTERFACE } from '@src/modules/match/application/contracts/tokens/match.tokens';
import type { MatchOutput } from '@src/modules/match/application/dto/output/match.output';
import { MatchOutputMapper } from '@src/modules/match/application/mappers/match-output.mapper';

@Injectable()
export class ListMatchUseCase implements ListMatchUseCaseInterface {
  constructor(
    @Inject(MATCH_REPOSITORY_INTERFACE)
    private readonly matchRepository: MatchRepositoryInterface,
  ) {}

  async execute(): Promise<MatchOutput[]> {
    const matches = await this.matchRepository.list();

    return MatchOutputMapper.toOutputList(matches);
  }
}
