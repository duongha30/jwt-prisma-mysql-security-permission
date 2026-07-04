import { SetMetadata } from '@nestjs/common';

export const IS_PERMIT_ALL = 'isPermitAll';
export const PermitAll = () => SetMetadata(IS_PERMIT_ALL, true);

export const IS_REQUIRED_PERMISSION = 'isRequiredPermission';
export const RequiredPermission = (...permissions: string[]) =>
  SetMetadata(IS_REQUIRED_PERMISSION, permissions);
