import { UserOutput } from '@src/modules/user/application/dto/output/user.output';
import { UserResponse } from '@src/modules/user/adapters/http/dto/response/user.response';

export class UserMapper {
  static toResponse(output: UserOutput): UserResponse {
    return {
      _id: output._id,
      name: output.name,
      alias: output.alias,
      phone: output.phone,
      media: output.media,
      isActive: output.isActive,
      createdAt: output.createdAt,
      updatedAt: output.updatedAt,
    };
  }

  static toResponseList(outputs: UserOutput[]): UserResponse[] {
    return outputs.map((output) => this.toResponse(output));
  }
}
