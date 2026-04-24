import { ConflictException, Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { USER_REPOSITORY_INTERFACE } from '@src/modules/user/application/contracts/tokens/user.tokens';
import type { UserRepositoryInterface } from '@src/modules/user/application/contracts/repositories/user.repository.interface';
import { CreateUserUseCaseInterface } from '@src/modules/user/application/contracts/use-cases/create-user.use-case.interface';
import { CreateUserInput } from '@src/modules/user/application/dto/input/create-user.input';
import { UserOutput } from '@src/modules/user/application/dto/output/user.output';
import { UserOutputMapper } from '@src/modules/user/application/mappers/user-output.mapper';

@Injectable()
export class CreateUserUseCase implements CreateUserUseCaseInterface {
  constructor(
    @Inject(USER_REPOSITORY_INTERFACE)
    private readonly userRepository: UserRepositoryInterface,
  ) {}

  async execute(input: CreateUserInput): Promise<UserOutput> {
    const existingUser = await this.userRepository.findByPhone(
      input.phone.number,
    );

    if (existingUser) {
      throw new ConflictException('User already exists!');
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);

    const user = await this.userRepository.create({
      ...input,
      password: hashedPassword,
      isActive: input.isActive ?? false,
    });

    return UserOutputMapper.toOutput(user);
  }
}
