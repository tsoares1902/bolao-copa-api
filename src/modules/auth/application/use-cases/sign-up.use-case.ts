import { ConflictException, Inject, Injectable } from '@nestjs/common';

import type { SignUpInput } from '@src/modules/auth/application/dto/input/sign-up.input';
import type { SignUpUseCaseInterface } from '@src/modules/auth/application/contracts/use-cases/sign-up.use-case.interface';
import { USER_REPOSITORY_INTERFACE } from '@src/modules/user/application/contracts/tokens/user.tokens';
import type { UserRepositoryInterface } from '@src/modules/user/application/contracts/repositories/user.repository.interface';
import {
  CREATE_ACTIVATION_CODE_USE_CASE_INTERFACE,
  HASH_SERVICE,
} from '@src/modules/auth/application/contracts/tokens/auth.tokens';
import type { CreateActivationCodeUseCaseInterface } from '@src/modules/auth/application/contracts/use-cases/create-activation-code.use-case.interface';
import type { HashServiceInterface } from '@src/modules/auth/application/contracts/services/hash.service.interface';

@Injectable()
export class SignUpUseCase implements SignUpUseCaseInterface {
  constructor(
    @Inject(USER_REPOSITORY_INTERFACE)
    private readonly userRepository: UserRepositoryInterface,
    @Inject(HASH_SERVICE)
    private readonly hashService: HashServiceInterface,

    @Inject(CREATE_ACTIVATION_CODE_USE_CASE_INTERFACE)
    private readonly createActivationCodeUseCase: CreateActivationCodeUseCaseInterface,
  ) {}

  async execute(input: SignUpInput): Promise<void> {
    const existingUser = await this.userRepository.findByPhone(
      input.phone.number,
    );

    if (existingUser) {
      throw new ConflictException('User already exists!');
    }

    const hashedPassword = await this.hashService.hash(input.password);

    await this.userRepository.create({
      name: input.name,
      alias: input.alias,
      password: hashedPassword,
      phone: input.phone,
      media: input.media,
      isActive: false,
    });

    await this.createActivationCodeUseCase.execute({
      phone: input.phone.number,
    });
  }
}
