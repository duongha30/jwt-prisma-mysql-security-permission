import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  UseGuards,
  ValidationPipe,
  Delete,
  SetMetadata,
  Param,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { LoginUserVO } from './vo/login-user.vo';
import { PermitAll, RequiredPermission } from 'src/common/custom-decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @PermitAll()
  create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('login')
  @PermitAll()
  login(@Body() loginUserDto: LoginUserDto): Promise<LoginUserVO> {
    return this.userService.login(loginUserDto);
  }

  @Get('profile')
  async getProfile(@Req() req: Request) {
    return 'Profile';
  }

  @Delete(':id')
  @RequiredPermission('DEL')
  async delete(@Param('id') id: string) {
    return `delete user with id: ${id}`;
  }
}
