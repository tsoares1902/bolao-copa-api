import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import type { StadiumRepositoryInterface } from '@src/modules/stadium/application/contracts/repositories/stadium.repository.interface';
import type { DeleteStadiumUseCaseInterface } from '@src/modules/stadium/application/contracts/use-cases/delete-stadium.use-case.interface';
import { STADIUM_REPOSITORY_INTERFACE } from '@src/modules/stadium/application/contracts/tokens/stadium.tokens';
import type { DeleteStadiumInput } from '@src/modules/stadium/application/dto/input/delete-stadium.input';

@Injectable()
export class DeleteStadiumUseCase implements DeleteStadiumUseCaseInterface {
  constructor(
    @Inject(STADIUM_REPOSITORY_INTERFACE)
    private readonly stadiumRepository: StadiumRepositoryInterface,
  ) {}

  async execute(input: DeleteStadiumInput): Promise<void> {
    const stadium = await this.stadiumRepository.read(input.stadiumId);

    if (!stadium) {
      throw new NotFoundException('Stadium not found');
    }

    await this.stadiumRepository.delete(input.stadiumId);
  }
}
