import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, Inject, Post } from '@nestjs/common';

import { CREATE_STADIUM_USE_CASE_INTERFACE } from '@src/modules/stadium/application/contracts/tokens/stadium.tokens';
import type { CreateStadiumUseCaseInterface } from '@src/modules/stadium/application/contracts/use-cases/create-stadium.use-case.interface';
import type { CreateStadiumRequest } from '@src/modules/stadium/adapters/http/dto/request/create-stadium.request';
import type { StadiumResponse } from '@src/modules/stadium/adapters/http/dto/response/stadium.response';
import { StadiumMapper } from '@src/modules/stadium/adapters/http/mappers/stadium.mapper';

@ApiTags('Stadium')
@Controller('stadium')
export class CreateStadiumController {
  constructor(
    @Inject(CREATE_STADIUM_USE_CASE_INTERFACE)
    private readonly createStadiumUseCase: CreateStadiumUseCaseInterface,
  ) {}

  @Post()
  async handle(@Body() body: CreateStadiumRequest): Promise<StadiumResponse> {
    const output = await this.createStadiumUseCase.execute({
      name: body.name,
      city: body.city,
      capacity: body.capacity,
      midia: {
        photoUrl: body.midia.photoUrl,
      },
    });

    return StadiumMapper.toResponse(output);
  }
}
