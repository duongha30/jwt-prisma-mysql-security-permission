import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { LoginUserVO } from './vo/login-user.vo';
import { LoginGuard } from 'src/login.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto): Promise<LoginUserVO> {
    return this.userService.login(loginUserDto);
  }

  @Get('profile')
  @UseGuards(LoginGuard)
  async getProfile(@Req() req: Request) {
    return 'Profile';
  }
}
