import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import type { MatchRepositoryInterface } from '@src/modules/match/application/contracts/repositories/match.repository.interface';
import type { UpdateMatchUseCaseInterface } from '@src/modules/match/application/contracts/use-cases/update-match.use-case.interface';
import { MATCH_REPOSITORY_INTERFACE } from '@src/modules/match/application/contracts/tokens/match.tokens';
import type { UpdateMatchInput } from '@src/modules/match/application/dto/input/update-match.input';
import type { MatchOutput } from '@src/modules/match/application/dto/output/match.output';
import { MatchOutputMapper } from '@src/modules/match/application/mappers/match-output.mapper';
import { validateMatchGroup } from '@src/modules/match/application/helpers/validate-match-group.helper';
import { validateMatchTeams } from '@src/modules/match/application/helpers/validate-match-teams.helper';
import type { TeamRepositoryInterface } from '@src/modules/team/application/contracts/repositories/team.repository.interface';
import { TEAM_REPOSITORY_INTERFACE } from '@src/modules/team/application/contracts/tokens/team.tokens';

@Injectable()
export class UpdateMatchUseCase implements UpdateMatchUseCaseInterface {
  constructor(
    @Inject(MATCH_REPOSITORY_INTERFACE)
    private readonly matchRepository: MatchRepositoryInterface,

    @Inject(TEAM_REPOSITORY_INTERFACE)
    private readonly teamRepository: TeamRepositoryInterface,
  ) {}

  async execute(input: UpdateMatchInput): Promise<MatchOutput> {
    const currentMatch = await this.matchRepository.read(input.matchId);

    if (!currentMatch) {
      throw new NotFoundException('Match not found');
    }

    const nextPhase = input.phase ?? currentMatch.phase;
    const nextGroupName = input.groupName ?? currentMatch.groupName;

    validateMatchGroup({
      phase: nextPhase,
      groupName: nextGroupName,
    });

    const nextHomeTeamId = input.homeTeamId ?? currentMatch.homeTeamId;
    const nextAwayTeamId = input.awayTeamId ?? currentMatch.awayTeamId;

    await validateMatchTeams({
      homeTeamId: nextHomeTeamId,
      awayTeamId: nextAwayTeamId,
      teamRepository: this.teamRepository,
    });

    const match = await this.matchRepository.update(input);

    if (!match) {
      throw new NotFoundException('Match not found');
    }

    return MatchOutputMapper.toOutput(match);
  }
}
