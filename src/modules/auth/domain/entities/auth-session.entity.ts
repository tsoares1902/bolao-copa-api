export class AuthSessionEntity {
  _id?: string;
  userId!: string;
  refreshToken!: string;
  expiresAt!: Date;
  isRevoked!: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
