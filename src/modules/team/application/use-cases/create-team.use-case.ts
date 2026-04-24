import { Inject, Injectable } from '@nestjs/common';

import type { TeamRepositoryInterface } from '@src/modules/team/application/contracts/repositories/team.repository';
import type { CreateTeamUseCaseInterface } from '@src/modules/team/application/contracts/use-cases/create-team.use-case.interface';
import { TEAM_REPOSITORY_INTERFACE } from '@src/modules/team/application/contracts/tokens/team.tokens';
import type { CreateTeamInput } from '@src/modules/team/application/dto/input/create-team.input';
import type { TeamOutput } from '@src/modules/team/application/dto/output/team.output';

@Injectable()
export class CreateTeamUseCase implements CreateTeamUseCaseInterface {
  constructor(
    @Inject(TEAM_REPOSITORY_INTERFACE)
    private readonly teamRepository: TeamRepositoryInterface,
  ) {}

  async execute(input: CreateTeamInput): Promise<TeamOutput> {
    const normalizedIsoCode = input.isoCode.toUpperCase();

    const team = await this.teamRepository.create({
      ...input,
      isoCode: normalizedIsoCode,
    });

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
