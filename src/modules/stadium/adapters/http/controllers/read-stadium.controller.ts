import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, Inject, Param } from '@nestjs/common';

import { READ_STADIUM_USE_CASE_INTERFACE } from '@src/modules/stadium/application/contracts/tokens/stadium.tokens';
import type { ReadStadiumUseCaseInterface } from '@src/modules/stadium/application/contracts/use-cases/read-stadium.use-case.interface';
import type { StadiumResponse } from '@src/modules/stadium/adapters/http/dto/response/stadium.response';
import { StadiumMapper } from '@src/modules/stadium/adapters/http/mappers/stadium.mapper';

@ApiTags('Stadium')
@Controller('stadium')
export class ReadStadiumController {
  constructor(
    @Inject(READ_STADIUM_USE_CASE_INTERFACE)
    private readonly readStadiumUseCase: ReadStadiumUseCaseInterface,
  ) {}

  @Get(':stadiumId')
  async handle(
    @Param('stadiumId') stadiumId: string,
  ): Promise<StadiumResponse> {
    const output = await this.readStadiumUseCase.execute({ stadiumId });

    return StadiumMapper.toResponse(output);
  }
}
