import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, Inject, Post } from '@nestjs/common';

import { CREATE_MATCH_USE_CASE_INTERFACE } from '@src/modules/match/application/contracts/tokens/match.tokens';
import type { CreateMatchUseCaseInterface } from '@src/modules/match/application/contracts/use-cases/create-match.use-case.interface';
import type { CreateMatchRequest } from '@src/modules/match/adapters/http/dto/request/create-match.request';
import type { MatchResponse } from '@src/modules/match/adapters/http/dto/response/match.response';
import { MatchMapper } from '@src/modules/match/adapters/http/mappers/match.mapper';

@ApiTags('Match')
@Controller('match')
export class CreateMatchController {
  constructor(
    @Inject(CREATE_MATCH_USE_CASE_INTERFACE)
    private readonly createMatchUseCase: CreateMatchUseCaseInterface,
  ) {}

  @Post()
  async handle(@Body() body: CreateMatchRequest): Promise<MatchResponse> {
    const output = await this.createMatchUseCase.execute({
      homeTeamId: body.homeTeamId,
      awayTeamId: body.awayTeamId,
      stadiumId: body.stadiumId,
      matchDate: new Date(body.matchDate),
      phase: body.phase,
      groupName: body.groupName,
      homeTeamScore: body.homeTeamScore,
      awayTeamScore: body.awayTeamScore,
      status: body.status,
    });

    return MatchMapper.toResponse(output);
  }
}
