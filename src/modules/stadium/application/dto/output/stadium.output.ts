import type { MidiaEntity } from '@src/modules/stadium/domain/entities/stadium.entity';

export class StadiumOutput {
  _id!: string;
  name!: string;
  city!: string;
  capacity?: number;
  midia?: MidiaEntity;
  createdAt?: Date;
  updatedAt?: Date;
}
