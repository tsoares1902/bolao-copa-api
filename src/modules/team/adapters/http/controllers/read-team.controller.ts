import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, Inject, Param } from '@nestjs/common';
import { READ_TEAM_USE_CASE_INTERFACE } from '@src/modules/team/application/contracts/tokens/team.tokens';
import type { ReadTeamUseCaseInterface } from '@src/modules/team/application/contracts/use-cases/read-team.use-case.interface';
import type { TeamResponse } from '@src/modules/team/adapters/http/dto/response/team.response';
import { TeamMapper } from '@src/modules/team/adapters/http/mappers/team.mapper';

@ApiTags('Team')
@Controller('team')
export class ReadTeamController {
  constructor(
    @Inject(READ_TEAM_USE_CASE_INTERFACE)
    private readonly readTeamUseCase: ReadTeamUseCaseInterface,
  ) {}

  @Get(':teamId')
  async handle(@Param('teamId') teamId: string): Promise<TeamResponse> {
    const output = await this.readTeamUseCase.execute({ _id: teamId });

    return TeamMapper.toResponse(output);
  }
}
