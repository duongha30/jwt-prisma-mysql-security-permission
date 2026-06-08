import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { LoginGuard } from 'src/login.guard';

@Module({
  controllers: [UserController],
  providers: [UserService, LoginGuard],
})
export class UserModule {}
