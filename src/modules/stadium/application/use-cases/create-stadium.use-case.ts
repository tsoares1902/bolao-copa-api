import { Inject, Injectable } from '@nestjs/common';

import type { StadiumRepositoryInterface } from '@src/modules/stadium/application/contracts/repositories/stadium.repository.interface';
import type { CreateStadiumUseCaseInterface } from '@src/modules/stadium/application/contracts/use-cases/create-stadium.use-case.interface';
import { STADIUM_REPOSITORY_INTERFACE } from '@src/modules/stadium/application/contracts/tokens/stadium.tokens';
import type { CreateStadiumInput } from '@src/modules/stadium/application/dto/input/create-stadium.input';
import type { StadiumOutput } from '@src/modules/stadium/application/dto/output/stadium.output';

@Injectable()
export class CreateStadiumUseCase implements CreateStadiumUseCaseInterface {
  constructor(
    @Inject(STADIUM_REPOSITORY_INTERFACE)
    private readonly stadiumRepository: StadiumRepositoryInterface,
  ) {}

  async execute(input: CreateStadiumInput): Promise<StadiumOutput> {
    const stadium = await this.stadiumRepository.create(input);

    return {
      _id: stadium._id,
      name: stadium.name,
      city: stadium.city,
      capacity: stadium.capacity,
      midia: stadium.midia,
      createdAt: stadium.createdAt,
      updatedAt: stadium.updatedAt,
    };
  }
}
