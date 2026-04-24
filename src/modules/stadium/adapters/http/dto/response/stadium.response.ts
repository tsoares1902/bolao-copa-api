import type { MidiaResponse } from '@src/modules/stadium/adapters/http/dto/response/midia.response';

export class StadiumResponse {
  _id!: string;
  name!: string;
  city!: string;
  capacity?: number;
  midia?: MidiaResponse;
  createdAt?: Date;
  updatedAt?: Date;
}
