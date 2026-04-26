import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, Inject, Post } from '@nestjs/common';

import { CREATE_TEAM_USE_CASE_INTERFACE } from '@src/modules/team/application/contracts/tokens/team.tokens';
import type { CreateTeamUseCaseInterface } from '@src/modules/team/application/contracts/use-cases/create-team.use-case.interface';
import { CreateTeamRequest } from '@src/modules/team/adapters/http/dto/request/create-team.request';
import type { TeamResponse } from '@src/modules/team/adapters/http/dto/response/team.response';
import { TeamMapper } from '@src/modules/team/adapters/http/mappers/team.mapper';

@ApiTags('Team')
@Controller('team')
export class CreateTeamController {
  constructor(
    @Inject(CREATE_TEAM_USE_CASE_INTERFACE)
    private readonly createTeamUseCase: CreateTeamUseCaseInterface,
  ) {}

  @Post()
  async handle(@Body() body: CreateTeamRequest): Promise<TeamResponse> {
    const output = await this.createTeamUseCase.execute({
      name: body.name,
      isoCode: body.isoCode,
      flagEmoji: body.flagEmoji,
    });

    return TeamMapper.toResponse(output);
  }
}
