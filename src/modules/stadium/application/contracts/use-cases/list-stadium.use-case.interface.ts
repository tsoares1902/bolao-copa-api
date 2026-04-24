import { StadiumOutput } from '@src/modules/stadium/application/dto/output/stadium.output';

export interface ListStadiumUseCaseInterface {
  execute(): Promise<StadiumOutput[]>;
}
