import { UpdateStadiumInput } from '@src/modules/stadium/application/dto/input/update-stadium.input';
import { StadiumOutput } from '@src/modules/stadium/application/dto/output/stadium.output';

export interface UpdateStadiumUseCaseInterface {
  execute(input: UpdateStadiumInput): Promise<StadiumOutput>;
}
