export class MidiaEntity {
  photoUrl!: string;
}

export class StadiumEntity {
  _id!: string;
  name!: string;
  city!: string;
  capacity?: number;
  midia?: MidiaEntity;
  createdAt?: Date;
  updatedAt?: Date;
}
