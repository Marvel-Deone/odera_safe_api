// src/apis/performance/performance.service.ts

import { HttpStatus, Injectable } from '@nestjs/common'
import { PrismaService } from '../../database/prisma/prisma.service'
import { error, success } from '../../common/utils/response.util'

@Injectable()
export class PerformanceService {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async generatePerformanceSnapshots(
        estateId: string,
        periodStart: Date,
        periodEnd: Date,
    ) {
        const guards =
            await this.prisma.guard.findMany({
                where: {
                    estateId,
                    is_active: true,
                },
            })

        const snapshots: any[] = []

        for (const guard of guards) {
            const attendanceScore =
                await this.calculateAttendanceScore(
                    guard.id,
                    periodStart,
                    periodEnd,
                )

            const patrolScore =
                await this.calculatePatrolScore(
                    guard.id,
                    periodStart,
                    periodEnd,
                )

            const sosScore =
                await this.calculateSOSScore(
                    guard.id,
                    periodStart,
                    periodEnd,
                )

            const incidentScore =
                await this.calculateIncidentScore(
                    guard.id,
                    periodStart,
                    periodEnd,
                )

            const swapScore =
                await this.calculateSwapScore(
                    guard.id,
                    periodStart,
                    periodEnd,
                )

            const penaltyScore =
                await this.calculatePenaltyScore(
                    guard.id,
                    periodStart,
                    periodEnd,
                )

            const totalScore =
                attendanceScore * 0.30 +
                patrolScore * 0.25 +
                sosScore * 0.10 +
                incidentScore * 0.10 +
                swapScore * 0.10 +
                penaltyScore * 0.10

            snapshots.push({
                guardId: guard.id,
                guardName: guard.full_name,
                guardZone: guard.zone_assignment,
                estateId,
                periodStart,
                periodEnd,

                attendanceScore,
                patrolScore,
                sosScore,
                incidentScore,
                swapScore,
                penaltyScore,

                totalScore: Number(
                    totalScore.toFixed(2),
                ),
            })
        }

        // Sort descending by total score
        snapshots.sort(
            (a, b) =>
                b.totalScore - a.totalScore,
        )

        // Assign ranks + badges
        for (
            let i = 0;
            i < snapshots.length;
            i++
        ) {
            snapshots[i].rank = i + 1
            snapshots[i].badge =
                this.getBadge(
                    snapshots[i].totalScore,
                    snapshots[i].rank,
                )
        }

        // IMPORTANT:
        // guardPerformanceSnapshot model does not exist
        // until you run:
        //
        // npx prisma migrate dev --name add_guard_performance_snapshot
        // npx prisma generate
        //
        // Uncomment these lines AFTER migration.

        /*
        await this.prisma.guardPerformanceSnapshot.deleteMany({
          where: {
            estateId,
            periodStart,
            periodEnd,
          },
        })
    
        await this.prisma.guardPerformanceSnapshot.createMany({
          data: snapshots,
        })
        */

        return snapshots
    }

    async generateForAdmin(
        userId: string,
        periodStart: Date,
        periodEnd: Date,
    ) {
        const admin = await this.prisma.user.findFirst({
            where: {
                id: userId,
            },
        })

        if (!admin) {
            return error(
                'Unauthorized',
                'Admin not found',
                HttpStatus.NOT_FOUND,
            )
        }

        const snapshots =
            await this.generatePerformanceSnapshots(
                admin.estateId,
                periodStart,
                periodEnd,
            )

        return success(
            snapshots,
            'Performance Generated',
            'Performance snapshots generated successfully',
        )
    }

    async getEstateRankings(userId: string) {
        const admin = await this.prisma.user.findFirst({
            where: {
                id: userId,
            },
        })

        if (!admin) {
            return error(
                'Unauthorized',
                'Admin not found',
                HttpStatus.NOT_FOUND,
            )
        }

        // Default period = current month
        const periodStart = new Date()
        periodStart.setDate(1)
        periodStart.setHours(0, 0, 0, 0)

        const periodEnd = new Date()

        const snapshots =
            await this.generatePerformanceSnapshots(
                admin.estateId,
                periodStart,
                periodEnd,
            )

        return success(
            snapshots,
            'Estate Rankings',
            'Performance rankings fetched successfully',
        )
    }

    async getGuardPerformance(
        userId: string,
        guardId: string,
    ) {
        const admin = await this.prisma.user.findFirst({
            where: {
                id: userId,
            },
        })

        if (!admin) {
            return error(
                'Unauthorized',
                'Admin not found',
                HttpStatus.NOT_FOUND,
            )
        }

        const rankings =
            await this.generatePerformanceSnapshots(
                admin.estateId,
                new Date(
                    new Date().getFullYear(),
                    new Date().getMonth(),
                    1,
                ),
                new Date(),
            )

        const guardSnapshot = rankings.find(
            (item) => item.guardId === guardId,
        )

        if (!guardSnapshot) {
            return error(
                'Not Found',
                'Performance record not found',
                HttpStatus.NOT_FOUND,
            )
        }

        return success(
            guardSnapshot,
            'Guard Performance',
            'Guard performance fetched successfully',
        )
    }

    /* =========================================================
       GUARD METHOD
    ========================================================= */

    async getMyPerformance(userId: string) {
        const guard = await this.prisma.guard.findFirst({
            where: {
                userId,
            },
        })

        if (!guard) {
            return error(
                'Not Found',
                'Guard not found',
                HttpStatus.NOT_FOUND,
            )
        }

        const periodStart = new Date()
        periodStart.setDate(1)
        periodStart.setHours(0, 0, 0, 0)

        const rankings =
            await this.generatePerformanceSnapshots(
                guard.estateId,
                periodStart,
                new Date(),
            )

        const mySnapshot = rankings.find(
            (item) => item.guardId === guard.id,
        )

        if (!mySnapshot) {
            return error(
                'Not Found',
                'Performance record not found',
                HttpStatus.NOT_FOUND,
            )
        }

        return success(
            mySnapshot,
            'My Performance',
            'Performance data fetched successfully',
        )
    }

    // Attendance score (0-100)
    private async calculateAttendanceScore(
        guardId: string,
        periodStart: Date,
        periodEnd: Date,
    ): Promise<number> {
        const shifts =
            await this.prisma.guardShift.count({
                where: {
                    guardId,
                    shiftDate: {
                        gte: periodStart,
                        lte: periodEnd,
                    },
                    status: {
                        not: 'CANCELLED',
                    },
                },
            })

        if (shifts === 0) return 100

        const attendance =
            await this.prisma.guardAttendance.count({
                where: {
                    guardId,
                    clockInAt: {
                        gte: periodStart,
                        lte: periodEnd,
                    },
                    attendanceStatus: 'PRESENT',
                },
            })

        return Math.round(
            (attendance / shifts) * 100,
        )
    }

    // Patrol completion score
    private async calculatePatrolScore(
        guardId: string,
        periodStart: Date,
        periodEnd: Date,
    ): Promise<number> {
        const scans =
            await this.prisma.patrolScan.count({
                where: {
                    guardId,
                    scannedAt: {
                        gte: periodStart,
                        lte: periodEnd,
                    },
                },
            })

        // Simple scoring:
        // 20 scans = 100%
        return Math.min(
            100,
            Math.round((scans / 20) * 100),
        )
    }

    // SOS score
    private async calculateSOSScore(
        guardId: string,
        periodStart: Date,
        periodEnd: Date,
    ): Promise<number> {
        const sos =
            await this.prisma.guardSOS.count({
                where: {
                    guardId,
                    createdAt: {
                        gte: periodStart,
                        lte: periodEnd,
                    },
                },
            })

        // Fewer SOS incidents = better score
        return Math.max(0, 100 - sos * 10)
    }

    // Incident reporting score
    private async calculateIncidentScore(
        guardId: string,
        periodStart: Date,
        periodEnd: Date,
    ): Promise<number> {
        const incidents =
            await this.prisma.incident.count({
                where: {
                    guardId,
                    createdAt: {
                        gte: periodStart,
                        lte: periodEnd,
                    },
                },
            })

        // 5 reports = full score
        return Math.min(
            100,
            Math.round(
                (incidents / 5) * 100,
            ),
        )
    }

    // Shift swap reliability score
    private async calculateSwapScore(
        guardId: string,
        periodStart: Date,
        periodEnd: Date,
    ): Promise<number> {
        const total =
            await this.prisma.shiftSwapRequest.count({
                where: {
                    requesterGuardId: guardId,
                    createdAt: {
                        gte: periodStart,
                        lte: periodEnd,
                    },
                },
            })

        if (total === 0) return 100

        const approved =
            await this.prisma.shiftSwapRequest.count({
                where: {
                    requesterGuardId: guardId,
                    createdAt: {
                        gte: periodStart,
                        lte: periodEnd,
                    },
                    status: 'APPROVED',
                },
            })

        return Math.round(
            (approved / total) * 100,
        )
    }

    // Penalty score (lower missed alerts = better)
    private async calculatePenaltyScore(
        guardId: string,
        periodStart: Date,
        periodEnd: Date,
    ): Promise<number> {
        const missed =
            await this.prisma.missedCheckpointAlert.count({
                where: {
                    guardId,
                    createdAt: {
                        gte: periodStart,
                        lte: periodEnd,
                    },
                },
            })

        return Math.max(
            0,
            100 - missed * 15,
        )
    }

    private getBadge(
        score: number,
        rank: number,
    ): string | null {
        if (rank === 1)
            return 'Top Performer'

        if (score >= 95)
            return 'Elite Guard'

        if (score >= 90)
            return 'Patrol Champion'

        if (score >= 80)
            return 'Reliable Officer'

        return null
    }
}