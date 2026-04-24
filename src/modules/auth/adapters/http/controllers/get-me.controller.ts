import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, Inject, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';

import { GET_ME_USE_CASE_INTERFACE } from '@src/modules/auth/application/contracts/tokens/auth.tokens';
import type { GetMeUseCaseInterface } from '@src/modules/auth/application/contracts/use-cases/get-me.use-case.interface';
import { AccessTokenGuard } from '@src/modules/auth/adapters/http/guards/access-token.guard';
import type { UserResponse } from '@src/modules/user/adapters/http/dto/response/user.response';
import { UserMapper } from '@src/modules/user/adapters/http/mappers/user.mapper';

type AuthenticatedRequest = Request & {
  user: {
    userId: string;
    phone?: string;
  };
};

@ApiTags('Auth')
@Controller('auth')
export class GetMeController {
  constructor(
    @Inject(GET_ME_USE_CASE_INTERFACE)
    private readonly getMeUseCase: GetMeUseCaseInterface,
  ) {}

  @Get('me')
  @UseGuards(AccessTokenGuard)
  async handle(@Req() request: AuthenticatedRequest): Promise<UserResponse> {
    const output = await this.getMeUseCase.execute(request.user.userId);

    return UserMapper.toResponse(output);
  }
}
