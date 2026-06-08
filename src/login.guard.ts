import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class LoginGuard implements CanActivate {
  constructor(private jwtService: JwtService) { }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    if (!authHeader) {
      throw new UnauthorizedException('No authorization header provided');
    }
    const token = authHeader.split(' ')[0];
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
