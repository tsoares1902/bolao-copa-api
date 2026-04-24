import type { MidiaEntity } from '@src/modules/stadium/domain/entities/stadium.entity';

export class UpdateStadiumInput {
  stadiumId!: string;
  name?: string;
  city?: string;
  capacity?: number;
  midia?: MidiaEntity;
}
