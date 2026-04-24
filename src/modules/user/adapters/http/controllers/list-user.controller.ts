import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, Inject } from '@nestjs/common';

import { LIST_USER_USE_CASE_INTERFACE } from '@src/modules/user/application/contracts/tokens/user.tokens';
import type { ListUserUseCaseInterface } from '@src/modules/user/application/contracts/use-cases/list-user.use-case.interface';
import type { UserResponse } from '@src/modules/user/adapters/http/dto/response/user.response';
import { UserMapper } from '@src/modules/user/adapters/http/mappers/user.mapper';

@ApiTags('User')
@Controller('user')
export class ListUserController {
  constructor(
    @Inject(LIST_USER_USE_CASE_INTERFACE)
    private readonly listUserUseCase: ListUserUseCaseInterface,
  ) {}

  @Get()
  async handle(): Promise<UserResponse[]> {
    const output = await this.listUserUseCase.execute();

    return UserMapper.toResponseList(output);
  }
}
