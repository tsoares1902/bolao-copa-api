import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import type { MatchRepositoryInterface } from '@src/modules/match/application/contracts/repositories/match.repository.interface';
import type { ReadMatchUseCaseInterface } from '@src/modules/match/application/contracts/use-cases/read-match.use-case.interface';
import { MATCH_REPOSITORY_INTERFACE } from '@src/modules/match/application/contracts/tokens/match.tokens';
import type { ReadMatchInput } from '@src/modules/match/application/dto/input/read-match.input';
import type { MatchOutput } from '@src/modules/match/application/dto/output/match.output';
import { MatchOutputMapper } from '@src/modules/match/application/mappers/match-output.mapper';

@Injectable()
export class ReadMatchUseCase implements ReadMatchUseCaseInterface {
  constructor(
    @Inject(MATCH_REPOSITORY_INTERFACE)
    private readonly matchRepository: MatchRepositoryInterface,
  ) {}

  async execute(input: ReadMatchInput): Promise<MatchOutput> {
    const match = await this.matchRepository.read(input.matchId);

    if (!match) {
      throw new NotFoundException('Match not found!');
    }

    return MatchOutputMapper.toOutput(match);
  }
}
