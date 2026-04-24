import { StadiumOutput } from '@src/modules/stadium/application/dto/output/stadium.output';
import { StadiumResponse } from '@src/modules/stadium/adapters/http/dto/response/stadium.response';

export class StadiumMapper {
  static toResponse(output: StadiumOutput): StadiumResponse {
    return {
      _id: output._id,
      name: output.name,
      city: output.city,
      capacity: output.capacity,
      midia: output.midia
        ? {
            photoUrl: output.midia.photoUrl,
          }
        : undefined,
      createdAt: output.createdAt,
      updatedAt: output.updatedAt,
    };
  }

  static toResponseList(outputs: StadiumOutput[]): StadiumResponse[] {
    return outputs.map((output) => this.toResponse(output));
  }
}
