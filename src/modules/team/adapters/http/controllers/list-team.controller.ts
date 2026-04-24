import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, Inject } from '@nestjs/common';
import { LIST_TEAM_USE_CASE_INTERFACE } from '@src/modules/team/application/contracts/tokens/team.tokens';
import type { ListTeamUseCaseInterface } from '@src/modules/team/application/contracts/use-cases/list-team.use-case.interface';
import type { TeamResponse } from '@src/modules/team/adapters/http/dto/response/team.response';
import { TeamMapper } from '@src/modules/team/adapters/http/mappers/team.mapper';

@ApiTags('Team')
@Controller('team')
export class ListTeamController {
  constructor(
    @Inject(LIST_TEAM_USE_CASE_INTERFACE)
    private readonly listTeamUseCase: ListTeamUseCaseInterface,
  ) {}

  @Get()
  async handle(): Promise<TeamResponse[]> {
    const output = await this.listTeamUseCase.execute();

    return TeamMapper.toResponseList(output);
  }
}
