import { SetMetadata } from '@nestjs/common';
import { AdminRole } from '@prisma/client';

// Key to store metadata
export const ROLES_KEY = 'roles';

// Decorator definition
export const Roles = (...roles: AdminRole[]) => SetMetadata(ROLES_KEY, roles);