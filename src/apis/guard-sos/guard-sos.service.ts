import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { CreateGuardSOSDto } from './dto/guard-sos.dto';
import { error, success } from '../../common/utils/response.util';

@Injectable()
export class GuardSosService {
    constructor(private prisma: PrismaService,) { }

    async createGuardSOS(
        userId: string,
        dto: CreateGuardSOSDto,
    ) {
        const guard = await this.prisma.guard.findFirst({
            where: { userId },
        })

        if (!guard) {
            return error(
                'Not Found',
                'Guard not found',
                HttpStatus.NOT_FOUND,
            )
        }

        const activeAlert = await this.prisma.guardSOS.findFirst({
            where: {
                guardId: guard.id,
                status: {
                    in: ['ACTIVE', 'ACKNOWLEDGED'],
                },
            },
        })

        if (activeAlert) {
            return error(
                'Conflict',
                'You already have an active SOS alert',
                HttpStatus.CONFLICT,
            )
        }

        const sos = await this.prisma.guardSOS.create({
            data: {
                guardId: guard.id,
                estateId: guard.estateId,
                category: dto.category,
                zone: dto.zone || guard.zone_assignment,
                message: dto.message,
                latitude: dto.latitude,
                longitude: dto.longitude,
            },
            include: {
                guard: {
                    select: {
                        id: true,
                        full_name: true,
                        zone_assignment: true,
                    },
                },
            },
        })

        return success(
            sos,
            'SOS Triggered',
            'Emergency alert sent successfully',
        )
    }

    // async getGuardSOSAlerts(userId: string) {
    //     const admin = await this.prisma.user.findFirst({
    //         where: { id: userId },
    //     })

    //     if (!admin) {
    //         return error(
    //             'Unauthorized',
    //             'Admin not found',
    //             HttpStatus.NOT_FOUND,
    //         )
    //     }

    //     const alerts = await this.prisma.guardSOS.findMany({
    //         where: {
    //             estateId: admin.estateId,
    //         },
    //         include: {
    //             guard: {
    //                 select: {
    //                     id: true,
    //                     // full_name: true,
    //                     // phone_number: true,
    //                     // zone_assignment: true,
    //                 },
    //             },
    //         },
    //         orderBy: {
    //             createdAt: 'desc',
    //         },
    //     })

    //     const guard =
    //         await this.prisma.guard.findFirst({
    //             where: {
    //                 id: alerts.guard.id,
    //                 estateId:
    //                     admin.estateId,
    //             },

    //             include: {
    //                 user: true,
    //             },
    //         })

    //     return success(
    //         {
    //             alerts,
    //             guard: {
    //                 id: guard?.id,
    //                 full_name: guard?.user.full_name,
    //                 phone_number: guard?.user.phone_number,
    //                 zone_assignment: guard?.zone_assignment,
    //             }
    //         },
    //         'SOS Alerts',
    //         'SOS alerts fetched successfully',
    //     )
    // }
    async getGuardSOSAlerts(userId: string) {
        const admin = await this.prisma.user.findFirst({
            where: { id: userId },
        })

        if (!admin) {
            return error(
                'Unauthorized',
                'Admin not found',
                HttpStatus.NOT_FOUND,
            )
        }

        const alerts = await this.prisma.guardSOS.findMany({
            where: {
                estateId: admin.estateId,
            },
            include: {
                guard: {
                    select: {
                        id: true,
                        full_name: true,
                        phone: true,
                        zone_assignment: true,
                        // employee_id: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        })

        return success(
            alerts,
            'SOS Alerts',
            'SOS alerts fetched successfully',
        )
    }
    async getGuardSOSById(
        userId: string,
        sosId: string,
    ) {
        const admin = await this.prisma.user.findFirst({
            where: { id: userId },
        })

        if (!admin) {
            return error(
                'Unauthorized',
                'Admin not found',
                HttpStatus.NOT_FOUND,
            )
        }

        const sos = await this.prisma.guardSOS.findFirst({
            where: {
                id: sosId,
                estateId: admin.estateId,
            },
            include: {
                guard: {
                    select: {
                        id: true,
                        full_name: true,
                        phone: true,
                        zone_assignment: true,
                        // employee_id: true,
                    },
                },
            },
        })

        if (!sos) {
            return error(
                'Not Found',
                'SOS alert not found',
                HttpStatus.NOT_FOUND,
            )
        }

        return success(
            sos,
            'SOS Alert',
            'SOS alert fetched successfully',
        )
    }

    async acknowledgeGuardSOS(
        userId: string,
        sosId: string,
    ) {
        const admin = await this.prisma.user.findFirst({
            where: { id: userId },
        })

        if (!admin) {
            return error(
                'Unauthorized',
                'Admin not found',
                HttpStatus.NOT_FOUND,
            )
        }

        const sos = await this.prisma.guardSOS.findFirst({
            where: {
                id: sosId,
                estateId: admin.estateId,
            },
        })

        if (!sos) {
            return error(
                'Not Found',
                'SOS alert not found',
                HttpStatus.NOT_FOUND,
            )
        }

        if (sos.status !== 'ACTIVE') {
            return error(
                'Invalid Status',
                'Only active alerts can be acknowledged',
                HttpStatus.BAD_REQUEST,
            )
        }

        const updated = await this.prisma.guardSOS.update({
            where: {
                id: sos.id,
            },
            data: {
                status: 'ACKNOWLEDGED',
                acknowledgedAt: new Date(),
                acknowledgedBy: userId,
            },
            include: {
                guard: {
                    select: {
                        id: true,
                        full_name: true,
                        zone_assignment: true,
                    },
                },
            },
        })

        return success(
            updated,
            'SOS Acknowledged',
            'SOS alert acknowledged successfully',
        )
    }

    async resolveGuardSOS(
        userId: string,
        sosId: string,
        dto: {
            resolutionNote?: string
        },
    ) {
        const admin = await this.prisma.user.findFirst({
            where: { id: userId },
        })

        if (!admin) {
            return error(
                'Unauthorized',
                'Admin not found',
                HttpStatus.NOT_FOUND,
            )
        }

        const sos = await this.prisma.guardSOS.findFirst({
            where: {
                id: sosId,
                estateId: admin.estateId,
            },
        })

        if (!sos) {
            return error(
                'Not Found',
                'SOS alert not found',
                HttpStatus.NOT_FOUND,
            )
        }

        if (
            !['ACTIVE', 'ACKNOWLEDGED'].includes(
                sos.status,
            )
        ) {
            return error(
                'Invalid Status',
                'Only active or acknowledged alerts can be resolved',
                HttpStatus.BAD_REQUEST,
            )
        }

        const updated = await this.prisma.guardSOS.update({
            where: {
                id: sos.id,
            },
            data: {
                status: 'RESOLVED',
                resolvedAt: new Date(),
                resolvedBy: userId,
                resolutionNote: dto.resolutionNote,
            },
            include: {
                guard: {
                    select: {
                        id: true,
                        full_name: true,
                        zone_assignment: true,
                    },
                },
            },
        })

        return success(
            updated,
            'SOS Resolved',
            'SOS alert resolved successfully',
        )
    }

    async cancelGuardSOS(
        userId: string,
        sosId: string,
    ) {
        const guard = await this.prisma.guard.findFirst({
            where: { userId },
        })

        if (!guard) {
            return error(
                'Not Found',
                'Guard not found',
                HttpStatus.NOT_FOUND,
            )
        }

        const sos = await this.prisma.guardSOS.findFirst({
            where: {
                id: sosId,
                guardId: guard.id,
            },
        })

        if (!sos) {
            return error(
                'Not Found',
                'SOS alert not found',
                HttpStatus.NOT_FOUND,
            )
        }

        if (
            !['ACTIVE', 'ACKNOWLEDGED'].includes(
                sos.status,
            )
        ) {
            return error(
                'Invalid Status',
                'Only active or acknowledged alerts can be cancelled',
                HttpStatus.BAD_REQUEST,
            )
        }

        const updated = await this.prisma.guardSOS.update({
            where: {
                id: sos.id,
            },
            data: {
                status: 'CANCELLED',
                resolvedAt: new Date(),
                resolvedBy: guard.userId,
            },
        })

        return success(
            updated,
            'SOS Cancelled',
            'SOS alert cancelled successfully',
        )
    }
}
