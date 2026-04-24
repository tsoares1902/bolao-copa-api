import { ApiTags } from '@nestjs/swagger';
import { Controller, Delete, HttpCode, Inject, Param } from '@nestjs/common';

import { DELETE_TEAM_USE_CASE_INTERFACE } from '@src/modules/team/application/contracts/tokens/team.tokens';
import type { DeleteTeamUseCaseInterface } from '@src/modules/team/application/contracts/use-cases/delete-team.use-case.interface';

@ApiTags('Team')
@Controller('team')
export class DeleteTeamController {
  constructor(
    @Inject(DELETE_TEAM_USE_CASE_INTERFACE)
    private readonly deleteTeamUseCase: DeleteTeamUseCaseInterface,
  ) {}

  @Delete(':teamId')
  @HttpCode(204)
  async handle(@Param('teamId') teamId: string): Promise<void> {
    await this.deleteTeamUseCase.execute({ _id: teamId });
  }
}
