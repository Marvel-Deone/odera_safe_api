import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common'

import { Reflector } from '@nestjs/core'

import { ROLES_KEY } from '../decorators/roles.decorator'
import { Role } from '@prisma/client'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
      ROLES_KEY,
      [
        context.getHandler(),
        context.getClass(),
      ],
    )

    // route has no roles
    if (!requiredRoles) {
      return true
    }

    const { user } = context.switchToHttp().getRequest()

    if (requiredRoles.includes(user.role)) {
      return true
    }

    return (
      user.role === Role.SUPER_GUARD &&
      requiredRoles.includes(Role.GUARD)
    )
  }
}
