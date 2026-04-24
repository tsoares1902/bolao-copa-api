import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import type { StadiumRepositoryInterface } from '@src/modules/stadium/application/contracts/repositories/stadium.repository.interface';
import type { ReadStadiumUseCaseInterface } from '@src/modules/stadium/application/contracts/use-cases/read-stadium.use-case.interface';
import { STADIUM_REPOSITORY_INTERFACE } from '@src/modules/stadium/application/contracts/tokens/stadium.tokens';
import type { ReadStadiumInput } from '@src/modules/stadium/application/dto/input/read-stadium.input';
import type { StadiumOutput } from '@src/modules/stadium/application/dto/output/stadium.output';

@Injectable()
export class ReadStadiumUseCase implements ReadStadiumUseCaseInterface {
  constructor(
    @Inject(STADIUM_REPOSITORY_INTERFACE)
    private readonly stadiumRepository: StadiumRepositoryInterface,
  ) {}

  async execute(input: ReadStadiumInput): Promise<StadiumOutput> {
    const stadium = await this.stadiumRepository.read(input.stadiumId);

    if (!stadium) {
      throw new NotFoundException('Stadium not found');
    }

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
