import { CreateUserInput } from '@src/modules/user/application/dto/input/create-user.input';
import { UpdateUserInput } from '@src/modules/user/application/dto/input/update-user.input';
import { UserEntity } from '@src/modules/user/domain/entities/user.entity';

export interface UserRepositoryInterface {
  list(): Promise<UserEntity[]>;
  create(input: CreateUserInput): Promise<UserEntity>;
  read(userId: string): Promise<UserEntity | null>;
  findByPhone(phone: string): Promise<UserEntity | null>;
  update(input: UpdateUserInput): Promise<UserEntity | null>;
  delete(userId: string): Promise<void>;
  activateByPhone(phone: string): Promise<void>;
}
