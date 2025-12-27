import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AdminRole } from '@prisma/client';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  private readonly ROLE_HIERARCHY: Record<string, number> = {
    [AdminRole.EDITOR]: 1,       // Minimum level
    [AdminRole.MODERATOR]: 2,    // Medium level
    [AdminRole.SUPER_ADMIN]: 3,  // Highest level
  };

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<AdminRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user || !user.role) return false;

    if (user.role === AdminRole.SUPER_ADMIN) return true;

    const userLevel = this.ROLE_HIERARCHY[user.role] || 0;

    const requiredLevels = requiredRoles.map(role => this.ROLE_HIERARCHY[role] || 0);
    const minRequiredLevel = Math.min(...requiredLevels);

    if (userLevel >= minRequiredLevel) {
      return true;
    }

    throw new ForbiddenException('Bạn không đủ quyền hạn để thực hiện thao tác này.');
  }
}