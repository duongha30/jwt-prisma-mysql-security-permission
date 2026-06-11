import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionGuard implements CanActivate {
  @Inject(UserService)
  userService: UserService;

  @Inject(Reflector)
  private reflector: Reflector;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Get user info from request
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) {
      throw new UnauthorizedException('User not found in request context');
    }

    // check if user has permission
    const hasPermission = await this.userService.getPermissionsByUserId(
      user.id,
    );
    console.log('hasPermission', hasPermission);
    if (!hasPermission.length) {
      throw new UnauthorizedException('User does not have any permission');
    }

    const requiredPermissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );
    if (!requiredPermissions || requiredPermissions.length === 0) {
      throw new UnauthorizedException('No permissions required for this route');
    }

    if (
      !requiredPermissions.some((permission) =>
        hasPermission.includes(permission),
      )
    ) {
      throw new UnauthorizedException(
        'User does not have the required permissions',
      );
    }

    return true;
  }
}
