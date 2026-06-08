import { User } from 'generated/prisma/client';

export class LoginUserVO {
  elements!: {
    user: User;
    token: string;
  };
  status!: string;
}
