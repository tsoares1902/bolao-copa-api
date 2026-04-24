import { Inject, Injectable } from '@nestjs/common';

import type { TeamRepositoryInterface } from '@src/modules/team/application/contracts/repositories/team.repository.interface';
import type { ListTeamUseCaseInterface } from '@src/modules/team/application/contracts/use-cases/list-team.use-case.interface';
import { TEAM_REPOSITORY_INTERFACE } from '@src/modules/team/application/contracts/tokens/team.tokens';
import type { TeamOutput } from '@src/modules/team/application/dto/output/team.output';

@Injectable()
export class ListTeamUseCase implements ListTeamUseCaseInterface {
  constructor(
    @Inject(TEAM_REPOSITORY_INTERFACE)
    private readonly teamRepository: TeamRepositoryInterface,
  ) {}

  async execute(): Promise<TeamOutput[]> {
    const teams = await this.teamRepository.list();

    return teams.map((team) => ({
      _id: team._id,
      name: team.name,
      isoCode: team.isoCode,
      flagEmoji: team.flagEmoji,
      createdAt: team.createdAt,
      updatedAt: team.updatedAt,
    }));
  }
}
