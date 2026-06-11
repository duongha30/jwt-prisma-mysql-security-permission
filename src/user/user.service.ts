import { HttpException, Injectable } from '@nestjs/common';
import { Prisma, User } from 'generated/prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { createHash } from 'crypto';
import { LoginUserVO } from './vo/login-user.vo';
import { JwtService } from '@nestjs/jwt';

function md5(string: string) {
  const hash = createHash('md5');
  hash.update(string);
  return hash.digest('hex');
}

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async create(createUserDTO: CreateUserDto): Promise<User> {
    const { username, email, password } = createUserDTO;
    const existingUser = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (existingUser) {
      throw new HttpException('User already exists', 400);
    }
    return await this.prisma.user.create({
      data: { username, email, password: md5(password) },
    });
  }

  async login(loginUserDTO: LoginUserDto): Promise<LoginUserVO> {
    const { email, password } = loginUserDTO;
    const foundUser = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (!foundUser) {
      throw new HttpException('User not found', 404);
    }
    if (foundUser.password !== md5(password)) {
      throw new HttpException('Invalid username or password', 400);
    }

    const token = this.jwtService.sign({
      id: foundUser.id,
      email: foundUser.email,
      iat: Math.floor(Date.now() / 1000),
    });

    const loginUserVO = new LoginUserVO();
    loginUserVO.elements = {
      user: foundUser,
      token,
    };
    loginUserVO.status = 'success';
    return loginUserVO;
  }

  async getPermissionsByUserId(userId: number): Promise<string[]> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        userPermissions: {
          include: {
            permission: true, // all permissions where userId=[userId in param]
          },
        },
      },
    });

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    const permissionsSet = new Set<string>();
    user.userPermissions.forEach((role) => {
      permissionsSet.add(role.permission.name);
    });

    return Array.from(permissionsSet);
  }
}
