import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import type { TeamRepositoryInterface } from '@src/modules/team/application/contracts/repositories/team.repository';
import type { UpdateTeamUseCaseInterface } from '@src/modules/team/application/contracts/use-cases/update-team.use-case.interface';
import { TEAM_REPOSITORY_INTERFACE } from '@src/modules/team/application/contracts/tokens/team.tokens';
import type { UpdateTeamInput } from '@src/modules/team/application/dto/input/update-team.input';
import type { TeamOutput } from '@src/modules/team/application/dto/output/team.output';

@Injectable()
export class UpdateTeamUseCase implements UpdateTeamUseCaseInterface {
  constructor(
    @Inject(TEAM_REPOSITORY_INTERFACE)
    private readonly teamRepository: TeamRepositoryInterface,
  ) {}

  async execute(input: UpdateTeamInput): Promise<TeamOutput> {
    const team = await this.teamRepository.update({
      ...input,
      isoCode: input.isoCode?.toUpperCase(),
    });

    if (!team) {
      throw new NotFoundException('Team not found!');
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
