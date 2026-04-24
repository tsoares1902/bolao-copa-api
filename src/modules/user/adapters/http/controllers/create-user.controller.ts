import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, Inject, Post } from '@nestjs/common';

import { CREATE_USER_USE_CASE_INTERFACE } from '@src/modules/user/application/contracts/tokens/user.tokens';
import type { CreateUserUseCaseInterface } from '@src/modules/user/application/contracts/use-cases/create-user.use-case.interface';
import { CreateUserRequest } from '@src/modules/user/adapters/http/dto/request/create-user.request';
import type { UserResponse } from '@src/modules/user/adapters/http/dto/response/user.response';
import { UserMapper } from '@src/modules/user/adapters/http/mappers/user.mapper';

@ApiTags('User')
@Controller('user')
export class CreateUserController {
  constructor(
    @Inject(CREATE_USER_USE_CASE_INTERFACE)
    private readonly createUserUseCase: CreateUserUseCaseInterface,
  ) {}

  @Post()
  async handle(@Body() body: CreateUserRequest): Promise<UserResponse> {
    const output = await this.createUserUseCase.execute({
      name: body.name,
      alias: body.alias,
      password: body.password,
      phone: body.phone,
      media: body.media,
      isActive: body.isActive,
    });

    return UserMapper.toResponse(output);
  }
}
