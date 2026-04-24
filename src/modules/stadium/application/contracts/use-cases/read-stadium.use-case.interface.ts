import { ReadStadiumInput } from '@src/modules/stadium/application/dto/input/read-stadium.input';
import { StadiumOutput } from '@src/modules/stadium/application/dto/output/stadium.output';

export interface ReadStadiumUseCaseInterface {
  execute(input: ReadStadiumInput): Promise<StadiumOutput>;
}
