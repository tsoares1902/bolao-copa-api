import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import type { MatchRepositoryInterface } from '@src/modules/match/application/contracts/repositories/match.repository.interface';
import type { DeleteMatchUseCaseInterface } from '@src/modules/match/application/contracts/use-cases/delete-match.use-case.interface';
import { MATCH_REPOSITORY_INTERFACE } from '@src/modules/match/application/contracts/tokens/match.tokens';
import type { DeleteMatchInput } from '@src/modules/match/application/dto/input/delete-match.input';

@Injectable()
export class DeleteMatchUseCase implements DeleteMatchUseCaseInterface {
  constructor(
    @Inject(MATCH_REPOSITORY_INTERFACE)
    private readonly matchRepository: MatchRepositoryInterface,
  ) {}

  async execute(input: DeleteMatchInput): Promise<void> {
    const match = await this.matchRepository.read(input.matchId);

    if (!match) {
      throw new NotFoundException('Match not found');
    }

    await this.matchRepository.delete(input.matchId);
  }
}
