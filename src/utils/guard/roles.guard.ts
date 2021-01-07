import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleType } from '../enums/roles.enum';
import { GuardTypes } from '../enums/rolesGuard.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const acceptableRolesMethods: string[] =
      this.reflector.get<string[]>('roles', context.getHandler()) || [];
    const acceptableRolesClass: string[] =
      this.reflector.get<string[]>('roles', context.getClass()) || [];
    const acceptableRoles: string[] = [
      ...acceptableRolesMethods,
      ...acceptableRolesClass,
    ];

    if (!acceptableRoles.length) {
      throw new UnauthorizedException(
        'It is mandatory to define at least one role for this endpoint',
      );
    }

    const {
      user: { role },
    } = context.switchToHttp().getRequest();
    if (!this.matches(role as RoleType, acceptableRoles)) {
      const message = `Forbidden resource to rol ${role}`;
      throw new UnauthorizedException({ message });
    }
    return true;
  }

  matches(consumerRole: RoleType, possibleRoles): boolean {
    if (possibleRoles.includes(GuardTypes.ANY)) return true;
    if (possibleRoles.includes(consumerRole)) return true;
    return false;
  }
}
