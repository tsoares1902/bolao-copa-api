import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, Inject, Param, Patch } from '@nestjs/common';

import { UPDATE_USER_USE_CASE_INTERFACE } from '@src/modules/user/application/contracts/tokens/user.tokens';
import type { UpdateUserUseCaseInterface } from '@src/modules/user/application/contracts/use-cases/update-user.use-case.interface';
import { UpdateUserRequest } from '@src/modules/user/adapters/http/dto/request/update-user.request';
import type { UserResponse } from '@src/modules/user/adapters/http/dto/response/user.response';
import { UserMapper } from '@src/modules/user/adapters/http/mappers/user.mapper';

@ApiTags('User')
@Controller('user')
export class UpdateUserController {
  constructor(
    @Inject(UPDATE_USER_USE_CASE_INTERFACE)
    private readonly updateUserUseCase: UpdateUserUseCaseInterface,
  ) {}

  @Patch(':userId')
  async handle(
    @Param('userId') userId: string,
    @Body() body: UpdateUserRequest,
  ): Promise<UserResponse> {
    const output = await this.updateUserUseCase.execute({
      userId,
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
