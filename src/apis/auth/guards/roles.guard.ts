import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { Reflector } from '@nestjs/core';

import { ROLES_KEY } from '../decorators/roles.decorator';
import { LevyStatus, Role } from '@prisma/client';
import { PrismaService } from '../../../database/prisma/prisma.service';
import { SKIP_LEVY_CHECK_KEY } from '../decorators/skip-levy-check.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private prisma: PrismaService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
            ROLES_KEY,
            [context.getHandler(), context.getClass()],
        );

        const request = context.switchToHttp().getRequest();
        const { user } = request;

        const roleAllowed =
            !requiredRoles ||
            requiredRoles.includes(user.role) ||
            (user.role === Role.SUPER_GUARD &&
                requiredRoles.includes(Role.GUARD));

        if (!roleAllowed) {
            return false;
        }

        if (user.role !== Role.RESIDENT) {
            return true;
        }

        const skipLevyCheck = this.reflector.getAllAndOverride<boolean>(
            SKIP_LEVY_CHECK_KEY,
            [context.getHandler(), context.getClass()],
        );

        if (skipLevyCheck) {
            return true;
        }

        if (this.isLevyAllowedRoute(request.method, request.path)) {
            return true;
        }

        const resident = await this.prisma.resident.findFirst({
            where: { userId: user.id },
            select: { id: true, approvedAt: true },
        });

        if (!resident?.approvedAt) {
            return true;
        }

        const restrictionStartsAt =
            resident.approvedAt.getTime() + 24 * 60 * 60 * 1000;

        if (Date.now() < restrictionStartsAt) {
            return true;
        }

        const dueOutstandingCount = await this.prisma.levyAssignment.count({
            where: {
                residentId: resident.id,
                status: { not: LevyStatus.PAID },
                levy: { dueDate: { lte: new Date() } },
            },
        });

        await this.prisma.resident.update({
            where: { id: resident.id },
            data: { levyCleared: dueOutstandingCount === 0 },
        });

        return dueOutstandingCount === 0;
    }

    private isLevyAllowedRoute(method: string, path: string) {
        const normalized = path.replace(/^\/+/, '');

        if (method === 'GET' && normalized === 'finance/wallet') {
            return true;
        }

        if (method === 'POST' && normalized === 'finance/wallet/fund') {
            return true;
        }

        if (method === 'GET' && normalized === 'finance/payments/outstanding') {
            return true;
        }

        if (
            method === 'POST' &&
            /^finance\/payments\/[^/]+\/(wallet|paystack)$/.test(normalized)
        ) {
            return true;
        }

        return false;
    }
}
