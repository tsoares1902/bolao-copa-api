import { Inject, Injectable } from '@nestjs/common';

import type { MatchRepositoryInterface } from '@src/modules/match/application/contracts/repositories/match.repository.interface';
import type { CreateMatchUseCaseInterface } from '@src/modules/match/application/contracts/use-cases/create-match.use-case.interface';
import { MATCH_REPOSITORY_INTERFACE } from '@src/modules/match/application/contracts/tokens/match.tokens';
import type { CreateMatchInput } from '@src/modules/match/application/dto/input/create-match.input';
import type { MatchOutput } from '@src/modules/match/application/dto/output/match.output';
import { MatchStatus } from '@src/modules/match/domain/enums/match-status.enum';
import { MatchOutputMapper } from '@src/modules/match/application/mappers/match-output.mapper';
import { validateMatchGroup } from '@src/modules/match/application/helpers/validate-match-group.helper';
import { validateMatchTeams } from '@src/modules/match/application/helpers/validate-match-teams.helper';
import type { TeamRepositoryInterface } from '@src/modules/team/application/contracts/repositories/team.repository.interface';
import { TEAM_REPOSITORY_INTERFACE } from '@src/modules/team/application/contracts/tokens/team.tokens';

@Injectable()
export class CreateMatchUseCase implements CreateMatchUseCaseInterface {
  constructor(
    @Inject(MATCH_REPOSITORY_INTERFACE)
    private readonly matchRepository: MatchRepositoryInterface,

    @Inject(TEAM_REPOSITORY_INTERFACE)
    private readonly teamRepository: TeamRepositoryInterface,
  ) {}

  async execute(input: CreateMatchInput): Promise<MatchOutput> {
    validateMatchGroup({
      phase: input.phase,
      groupName: input.groupName,
    });

    await validateMatchTeams({
      homeTeamId: input.homeTeamId,
      awayTeamId: input.awayTeamId,
      teamRepository: this.teamRepository,
    });

    const match = await this.matchRepository.create({
      ...input,
      homeTeamScore: input.homeTeamScore ?? null,
      awayTeamScore: input.awayTeamScore ?? null,
      status: input.status ?? MatchStatus.SCHEDULED,
    });

    return MatchOutputMapper.toOutput(match);
  }
}
