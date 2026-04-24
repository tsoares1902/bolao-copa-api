import { ApiTags } from '@nestjs/swagger';
import { Controller, Delete, HttpCode, Inject, Param } from '@nestjs/common';

import { DELETE_USER_USE_CASE_INTERFACE } from '@src/modules/user/application/contracts/tokens/user.tokens';
import type { DeleteUserUseCaseInterface } from '@src/modules/user/application/contracts/use-cases/delete-user.use-case.interface';

@ApiTags('User')
@Controller('user')
export class DeleteUserController {
  constructor(
    @Inject(DELETE_USER_USE_CASE_INTERFACE)
    private readonly deleteUserUseCase: DeleteUserUseCaseInterface,
  ) {}

  @Delete(':userId')
  @HttpCode(204)
  async handle(@Param('userId') userId: string): Promise<void> {
    await this.deleteUserUseCase.execute({ userId });
  }
}
