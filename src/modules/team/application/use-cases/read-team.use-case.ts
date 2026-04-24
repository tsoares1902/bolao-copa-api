import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import type { TeamRepositoryInterface } from '@src/modules/team/application/contracts/repositories/team.repository';
import type { ReadTeamUseCaseInterface } from '@src/modules/team/application/contracts/use-cases/read-team.use-case.interface';
import { TEAM_REPOSITORY_INTERFACE } from '@src/modules/team/application/contracts/tokens/team.tokens';
import type { ReadTeamInput } from '@src/modules/team/application/dto/input/read-team.input';
import type { TeamOutput } from '@src/modules/team/application/dto/output/team.output';

@Injectable()
export class ReadTeamUseCase implements ReadTeamUseCaseInterface {
  constructor(
    @Inject(TEAM_REPOSITORY_INTERFACE)
    private readonly teamRepository: TeamRepositoryInterface,
  ) {}

  async execute(input: ReadTeamInput): Promise<TeamOutput> {
    const team = await this.teamRepository.read(input._id);

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    return {
      _id: team._id,
      name: team.name,
      isoCode: team.isoCode,
      flagEmoji: team.flagEmoji,
      createdAt: team.createdAt,
      updatedAt: team.updatedAt,
    };
  }
}
