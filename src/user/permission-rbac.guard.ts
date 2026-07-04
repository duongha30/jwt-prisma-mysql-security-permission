import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserService } from './user.service';
import { Reflector } from '@nestjs/core';
import {
  IS_PERMIT_ALL,
  IS_REQUIRED_PERMISSION,
} from 'src/common/custom-decorator';

@Injectable()
export class PermissionRbacGuard implements CanActivate {
  @Inject(UserService)
  private userService: UserService;

  @Inject(Reflector)
  private reflector: Reflector;
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPermitAll = this.reflector.getAllAndOverride(IS_PERMIT_ALL, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPermitAll) {
      return true;
    }

    const userContext = context.switchToHttp().getRequest().user;
    if (!userContext) {
      throw new BadRequestException('No user context found');
    }

    const userPermissions = await this.userService.getPermissionsByUserId(
      userContext.id,
    );
    if (!userPermissions || userPermissions.length === 0) {
      throw new UnauthorizedException('User does not have any permission');
    }
    console.log('userPermissions', userPermissions);

    const requiredPermission = this.reflector.getAllAndOverride(
      IS_REQUIRED_PERMISSION,
      [context.getHandler(), context.getClass()],
    );
    console.log('requiredPermission', requiredPermission);

    const hasPermission = requiredPermission.some((rp) =>
      userPermissions.includes(rp),
    );
    console.log('hasPermission', hasPermission);

    return hasPermission;
  }
}
