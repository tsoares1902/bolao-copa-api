import { StadiumEntity } from '@src/modules/stadium/domain/entities/stadium.entity';
import { CreateStadiumInput } from '@src/modules/stadium/application/dto/input/create-stadium.input';
import { UpdateStadiumInput } from '@src/modules/stadium/application/dto/input/update-stadium.input';

export interface StadiumRepositoryInterface {
  list(): Promise<StadiumEntity[]>;
  create(input: CreateStadiumInput): Promise<StadiumEntity>;
  read(stadiumId: string): Promise<StadiumEntity | null>;
  update(input: UpdateStadiumInput): Promise<StadiumEntity | null>;
  delete(stadiumId: string): Promise<void>;
}
