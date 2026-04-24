import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import type { StadiumRepositoryInterface } from '@src/modules/stadium/application/contracts/repositories/stadium.repository.interface';
import type { UpdateStadiumUseCaseInterface } from '@src/modules/stadium/application/contracts/use-cases/update-stadium.use-case.interface';
import { STADIUM_REPOSITORY_INTERFACE } from '@src/modules/stadium/application/contracts/tokens/stadium.tokens';
import type { UpdateStadiumInput } from '@src/modules/stadium/application/dto/input/update-stadium.input';
import type { StadiumOutput } from '@src/modules/stadium/application/dto/output/stadium.output';

@Injectable()
export class UpdateStadiumUseCase implements UpdateStadiumUseCaseInterface {
  constructor(
    @Inject(STADIUM_REPOSITORY_INTERFACE)
    private readonly stadiumRepository: StadiumRepositoryInterface,
  ) {}

  async execute(input: UpdateStadiumInput): Promise<StadiumOutput> {
    const stadium = await this.stadiumRepository.update(input);

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
