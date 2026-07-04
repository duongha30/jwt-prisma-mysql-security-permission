import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { IS_PERMIT_ALL } from './common/custom-decorator';

@Injectable()
export class LoginGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  @Inject()
  private reflector: Reflector;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPermitAll = this.reflector.getAllAndOverride(IS_PERMIT_ALL, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPermitAll) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'] as string | undefined;
    if (!authHeader) {
      throw new UnauthorizedException('No authorization header provided');
    }
    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    try {
      const decodedUser = this.jwtService.verify(token);
      request.user = decodedUser;
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
