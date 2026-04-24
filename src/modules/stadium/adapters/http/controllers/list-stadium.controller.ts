import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, Inject } from '@nestjs/common';

import { LIST_STADIUM_USE_CASE_INTERFACE } from '@src/modules/stadium/application/contracts/tokens/stadium.tokens';
import type { ListStadiumUseCaseInterface } from '@src/modules/stadium/application/contracts/use-cases/list-stadium.use-case.interface';
import type { StadiumResponse } from '@src/modules/stadium/adapters/http/dto/response/stadium.response';
import { StadiumMapper } from '@src/modules/stadium/adapters/http/mappers/stadium.mapper';

@ApiTags('Stadium')
@Controller('stadium')
export class ListStadiumController {
  constructor(
    @Inject(LIST_STADIUM_USE_CASE_INTERFACE)
    private readonly listStadiumUseCase: ListStadiumUseCaseInterface,
  ) {}

  @Get()
  async handle(): Promise<StadiumResponse[]> {
    const output = await this.listStadiumUseCase.execute();

    return StadiumMapper.toResponseList(output);
  }
}
