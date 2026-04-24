import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import type { TeamRepositoryInterface } from '@src/modules/team/application/contracts/repositories/team.repository.interface';
import type { DeleteTeamUseCaseInterface } from '@src/modules/team/application/contracts/use-cases/delete-team.use-case.interface';
import { TEAM_REPOSITORY_INTERFACE } from '@src/modules/team/application/contracts/tokens/team.tokens';
import type { DeleteTeamInput } from '@src/modules/team/application/dto/input/delete-team.input';

@Injectable()
export class DeleteTeamUseCase implements DeleteTeamUseCaseInterface {
  constructor(
    @Inject(TEAM_REPOSITORY_INTERFACE)
    private readonly teamRepository: TeamRepositoryInterface,
  ) {}

  async execute(input: DeleteTeamInput): Promise<void> {
    const team = await this.teamRepository.read(input._id);

    if (!team) {
      throw new NotFoundException('Team not found!');
    }

    await this.teamRepository.delete(input._id);
  }
}
