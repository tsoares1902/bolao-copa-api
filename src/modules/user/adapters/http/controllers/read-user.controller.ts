import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, Inject, Param } from '@nestjs/common';

import { READ_USER_USE_CASE_INTERFACE } from '@src/modules/user/application/contracts/tokens/user.tokens';
import type { ReadUserUseCaseInterface } from '@src/modules/user/application/contracts/use-cases/read-user.use-case.interface';
import type { UserResponse } from '@src/modules/user/adapters/http/dto/response/user.response';
import { UserMapper } from '@src/modules/user/adapters/http/mappers/user.mapper';

@ApiTags('User')
@Controller('user')
export class ReadUserController {
  constructor(
    @Inject(READ_USER_USE_CASE_INTERFACE)
    private readonly readUserUseCase: ReadUserUseCaseInterface,
  ) {}

  @Get(':userId')
  async handle(@Param('userId') userId: string): Promise<UserResponse> {
    const output = await this.readUserUseCase.execute({ userId });

    return UserMapper.toResponse(output);
  }
}
