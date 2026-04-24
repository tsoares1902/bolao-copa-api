import { randomUUID } from 'crypto';

export function generateRefreshToken(): string {
  return randomUUID();
}
