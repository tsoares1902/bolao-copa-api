import { CreateStadiumInput } from '@src/modules/stadium/application/dto/input/create-stadium.input';
import { StadiumOutput } from '@src/modules/stadium/application/dto/output/stadium.output';

export interface CreateStadiumUseCaseInterface {
  execute(input: CreateStadiumInput): Promise<StadiumOutput>;
}
