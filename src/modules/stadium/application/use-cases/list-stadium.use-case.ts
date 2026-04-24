import { Inject, Injectable } from '@nestjs/common';

import type { StadiumRepositoryInterface } from '@src/modules/stadium/application/contracts/repositories/stadium.repository.interface';
import type { ListStadiumUseCaseInterface } from '@src/modules/stadium/application/contracts/use-cases/list-stadium.use-case.interface';
import { STADIUM_REPOSITORY_INTERFACE } from '@src/modules/stadium/application/contracts/tokens/stadium.tokens';
import type { StadiumOutput } from '@src/modules/stadium/application/dto/output/stadium.output';

@Injectable()
export class ListStadiumUseCase implements ListStadiumUseCaseInterface {
  constructor(
    @Inject(STADIUM_REPOSITORY_INTERFACE)
    private readonly stadiumRepository: StadiumRepositoryInterface,
  ) {}

  async execute(): Promise<StadiumOutput[]> {
    const stadiums = await this.stadiumRepository.list();

    return stadiums.map((stadium) => ({
      _id: stadium._id,
      name: stadium.name,
      city: stadium.city,
      capacity: stadium.capacity,
      midia: stadium.midia,
      createdAt: stadium.createdAt,
      updatedAt: stadium.updatedAt,
    }));
  }
}
