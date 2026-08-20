// import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

// import { Reflector } from '@nestjs/core';

// import { ROLES_KEY } from '../decorators/roles.decorator';
// import { LevyStatus, Role } from '@prisma/client';
// import { PrismaService } from '../../../database/prisma/prisma.service';
// import { SKIP_LEVY_CHECK_KEY } from '../decorators/skip-levy-check.decorator';

// @Injectable()
// export class RolesGuard implements CanActivate {
//     constructor(
//         private reflector: Reflector,
//         private prisma: PrismaService,
//     ) {}

//     async canActivate(context: ExecutionContext): Promise<boolean> {
//         const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
//             ROLES_KEY,
//             [context.getHandler(), context.getClass()],
//         );

//         const request = context.switchToHttp().getRequest();
//         const { user } = request;

//         const roleAllowed =
//             !requiredRoles ||
//             requiredRoles.includes(user.role) ||
//             (user.role === Role.SUPER_GUARD &&
//                 requiredRoles.includes(Role.GUARD));

//         if (!roleAllowed) {
//             return false;
//         }

//         if (user.role !== Role.RESIDENT) {
//             return true;
//         }

//         const skipLevyCheck = this.reflector.getAllAndOverride<boolean>(
//             SKIP_LEVY_CHECK_KEY,
//             [context.getHandler(), context.getClass()],
//         );

//         if (skipLevyCheck) {
//             return true;
//         }

//         if (this.isLevyAllowedRoute(request.method, request.path)) {
//             return true;
//         }

//         const resident = await this.prisma.resident.findFirst({
//             where: { userId: user.id },
//             select: { id: true, approvedAt: true },
//         });

//         if (!resident?.approvedAt) {
//             return true;
//         }

//         const restrictionStartsAt =
//             resident.approvedAt.getTime() + 24 * 60 * 60 * 1000;

//         if (Date.now() < restrictionStartsAt) {
//             return true;
//         }

//         const dueOutstandingCount = await this.prisma.levyAssignment.count({
//             where: {
//                 residentId: resident.id,
//                 status: { not: LevyStatus.PAID },
//                 levy: { dueDate: { lte: new Date() } },
//             },
//         });

//         await this.prisma.resident.update({
//             where: { id: resident.id },
//             data: { levyCleared: dueOutstandingCount === 0 },
//         });

//         return dueOutstandingCount === 0;
//     }

//     private isLevyAllowedRoute(method: string, path: string) {
//         const normalized = path.replace(/^\/+/, '');

//         if (method === 'GET' && normalized === 'finance/wallet') {
//             return true;
//         }

//         if (method === 'POST' && normalized === 'finance/wallet/fund') {
//             return true;
//         }

//         if (method === 'GET' && normalized === 'finance/payments/outstanding') {
//             return true;
//         }

//         if (
//             method === 'POST' &&
//             /^finance\/payments\/[^/]+\/(wallet|paystack)$/.test(normalized)
//         ) {
//             return true;
//         }

//         return false;
//     }
// }

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { Reflector } from '@nestjs/core';

import { ROLES_KEY } from '../decorators/roles.decorator';
import { LevyStatus, Role } from '@prisma/client';
import { PrismaService } from '../../../database/prisma/prisma.service';
import { SKIP_LEVY_CHECK_KEY } from '../decorators/skip-levy-check.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
    private readonly monthlyResidentLevyCategory = 'MONTHLY_RESIDENT_LEVY';

    constructor(
        private readonly reflector: Reflector,
        private readonly prisma: PrismaService,
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

        // Levy restrictions only apply to residents.
        if (user.role !== Role.RESIDENT) {
            return true;
        }

        const isCoResident = await this.prisma.isCoResidentUser(user.id);

        if (isCoResident && this.isResidentFinanceRoute(request.path)) {
            return false;
        }

        const skipLevyCheck = this.reflector.getAllAndOverride<boolean>(
            SKIP_LEVY_CHECK_KEY,
            [context.getHandler(), context.getClass()],
        );

        if (skipLevyCheck) {
            return true;
        }

        // Residents must always be able to access
        // wallet and levy/payment endpoints.
        if (this.isLevyAllowedRoute(request.method, request.path)) {
            return true;
        }

        const resident = await this.prisma.resident.findFirst({
            where: {
                userId: user.id,
            },
            select: {
                id: true,
                estateId: true,
                approvedAt: true,
                kycStatus: true,
                levyCleared: true,
            },
        });

        // No approved KYC means levy restriction does not apply.
        if (!resident?.approvedAt) {
            return true;
        }

        const now = new Date();

        const estateSettings = await this.prisma.estateSettings.findUnique({
            where: {
                estateId: resident.estateId,
            },
            select: {
                applyKycLevyGracePeriod: true,
            },
        });

        const applyKycLevyGracePeriod =
            estateSettings?.applyKycLevyGracePeriod ?? true;

        if (applyKycLevyGracePeriod) {
            /*
             * Resident gets a 24-hour grace period after KYC approval.
             *
             * During this period:
             * - Admin levies may exist.
             * - Admin levies may even be due.
             * - Resident still has full access.
             */
            const restrictionStartsAt = new Date(
                resident.approvedAt.getTime() + 24 * 60 * 60 * 1000,
            );

            if (now < restrictionStartsAt) {
                // Keep the state consistent during the grace period.
                if (!resident.levyCleared) {
                    await this.prisma.resident.update({
                        where: {
                            id: resident.id,
                        },
                        data: {
                            levyCleared: true,
                        },
                    });
                }

                return true;
            }
        }

        /*
         * IMPORTANT:
         *
         * Only ADMIN-created levies participate in restriction.
         *
         * The system-generated MONTHLY_RESIDENT_LEVY is automatically
         * cleared and must NEVER cause access restriction.
         */
        const dueOutstandingAdminLevy =
            await this.prisma.levyAssignment.findFirst({
                where: {
                    residentId: resident.id,

                    status: {
                        not: LevyStatus.PAID,
                    },

                    levy: {
                        category: {
                            not: this.monthlyResidentLevyCategory,
                        },

                        dueDate: {
                            lte: now,
                        },
                    },
                },

                select: {
                    id: true,
                },
            });

        const levyCleared = !dueOutstandingAdminLevy;

        /*
         * levyCleared represents whether the resident is currently
         * subject to levy-based access restriction.
         */
        if (resident.levyCleared !== levyCleared) {
            await this.prisma.resident.update({
                where: {
                    id: resident.id,
                },
                data: {
                    levyCleared,
                },
            });
        }

        /*
         * No unpaid, due admin levy:
         * resident has full access.
         */
        if (levyCleared) {
            return true;
        }

        /*
         * At least one unpaid admin levy is due and the
         * 24-hour KYC grace period has expired.
         *
         * Resident is now restricted to wallet + levy routes.
         */
        return false;
    }

    private isLevyAllowedRoute(method: string, path: string): boolean {
        const normalized = this.normalizeRoutePath(path);

        // Wallet
        if (method === 'GET' && normalized === 'finance/wallet') {
            return true;
        }

        if (method === 'POST' && normalized === 'finance/wallet/fund') {
            return true;
        }

        // Outstanding levies
        if (method === 'GET' && normalized === 'finance/payments/outstanding') {
            return true;
        }

        // Levy payment
        if (
            method === 'POST' &&
            /^finance\/payments\/[^/]+\/(wallet|paystack)$/.test(normalized)
        ) {
            return true;
        }

        return false;
    }

    private isResidentFinanceRoute(path: string): boolean {
        const normalized = this.normalizeRoutePath(path);

        return (
            normalized === 'finance/payments/outstanding' ||
            normalized === 'finance/monthly-levies/pay-outstanding' ||
            normalized === 'finance/wallet' ||
            normalized === 'finance/wallet/fund' ||
            normalized === 'finance/withdrawals' ||
            normalized === 'auth/change-pin' ||
            normalized === 'auth/reset-pin' ||
            /^finance\/payments\/[^/]+\/(wallet|paystack)$/.test(normalized)
        );
    }

    private normalizeRoutePath(path: string): string {
        return path
            .replace(/^\/+/, '')
            .replace(/^_dds8\/+/, '')
            .replace(/^v\d+\/+/, '');
    }
}
