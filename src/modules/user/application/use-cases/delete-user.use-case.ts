import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { USER_REPOSITORY_INTERFACE } from '@src/modules/user/application/contracts/tokens/user.tokens';
import type { UserRepositoryInterface } from '@src/modules/user/application/contracts/repositories/user.repository.interface';
import { DeleteUserUseCaseInterface } from '@src/modules/user/application/contracts/use-cases/delete-user.use-case.interface';
import { DeleteUserInput } from '@src/modules/user/application/dto/input/delete-user.input';

@Injectable()
export class DeleteUserUseCase implements DeleteUserUseCaseInterface {
  constructor(
    @Inject(USER_REPOSITORY_INTERFACE)
    private readonly userRepository: UserRepositoryInterface,
  ) {}

  async execute(input: DeleteUserInput): Promise<void> {
    const user = await this.userRepository.read(input.userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.delete(input.userId);
  }
}
