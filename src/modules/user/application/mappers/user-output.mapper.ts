import { UserOutput } from '@src/modules/user/application/dto/output/user.output';
import { UserEntity } from '@src/modules/user/domain/entities/user.entity';

export class UserOutputMapper {
  static toOutput(user: UserEntity): UserOutput {
    return {
      _id: user._id,
      name: user.name,
      alias: user.alias,
      phone: user.phone,
      media: user.media,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  static toOutputList(users: UserEntity[]): UserOutput[] {
    return users.map((user) => this.toOutput(user));
  }
}
