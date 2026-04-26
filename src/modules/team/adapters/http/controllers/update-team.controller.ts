import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, Inject, Param, Patch } from '@nestjs/common';

import { UPDATE_TEAM_USE_CASE_INTERFACE } from '@src/modules/team/application/contracts/tokens/team.tokens';
import type { UpdateTeamUseCaseInterface } from '@src/modules/team/application/contracts/use-cases/update-team.use-case.interface';
import { UpdateTeamRequest } from '@src/modules/team/adapters/http/dto/request/update-team.request';
import type { TeamResponse } from '@src/modules/team/adapters/http/dto/response/team.response';
import { TeamMapper } from '@src/modules/team/adapters/http/mappers/team.mapper';

@ApiTags('Team')
@Controller('team')
export class UpdateTeamController {
  constructor(
    @Inject(UPDATE_TEAM_USE_CASE_INTERFACE)
    private readonly updateTeamUseCase: UpdateTeamUseCaseInterface,
  ) {}

  @Patch(':teamId')
  async handle(
    @Param('teamId') teamId: string,
    @Body() body: UpdateTeamRequest,
  ): Promise<TeamResponse> {
    const output = await this.updateTeamUseCase.execute({
      _id: teamId,
      name: body.name,
      isoCode: body.isoCode,
      flagEmoji: body.flagEmoji,
    });

    return TeamMapper.toResponse(output);
  }
}
