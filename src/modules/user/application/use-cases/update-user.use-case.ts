import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { USER_REPOSITORY_INTERFACE } from '@src/modules/user/application/contracts/tokens/user.tokens';
import type { UserRepositoryInterface } from '@src/modules/user/application/contracts/repositories/user.repository.interface';
import { UpdateUserUseCaseInterface } from '@src/modules/user/application/contracts/use-cases/update-user.use-case.interface';
import { UpdateUserInput } from '@src/modules/user/application/dto/input/update-user.input';
import { UserOutput } from '@src/modules/user/application/dto/output/user.output';
import { UserOutputMapper } from '@src/modules/user/application/mappers/user-output.mapper';

@Injectable()
export class UpdateUserUseCase implements UpdateUserUseCaseInterface {
  constructor(
    @Inject(USER_REPOSITORY_INTERFACE)
    private readonly userRepository: UserRepositoryInterface,
  ) {}

  async execute(input: UpdateUserInput): Promise<UserOutput> {
    const user = await this.userRepository.update({
      ...input,
      password: input.password
        ? await bcrypt.hash(input.password, 10)
        : undefined,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return UserOutputMapper.toOutput(user);
  }
}
