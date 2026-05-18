import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class PatrolMonitoringService {
    constructor(
        private prisma: PrismaService,
    ) { }

    @Cron('*/5 * * * *')
    async monitorMissedCheckpoints() {
        const checkpoints =
            await this.prisma.patrolCheckpoint.findMany({
                where: {
                    isActive: true,
                },
            })

        for (const checkpoint of checkpoints) {
            const lastScan =
                await this.prisma.patrolScan.findFirst({
                    where: {
                        checkpointId: checkpoint.id,
                        isValid: true,
                    },
                    orderBy: {
                        scannedAt: 'desc',
                    },
                })

            const now = new Date()

            const expectedWindowMs =
                checkpoint.requiredFrequency * 60 * 1000

            const referenceTime = lastScan
                ? lastScan.scannedAt
                : checkpoint.createdAt

            const diff =
                now.getTime() -
                new Date(referenceTime).getTime()

            const isMissed =
                diff > expectedWindowMs

            if (!isMissed) continue

            // avoid duplicate active alerts
            const existingAlert =
                await this.prisma.missedCheckpointAlert.findFirst({
                    where: {
                        checkpointId: checkpoint.id,
                        status: 'ACTIVE',
                    },
                })

            if (existingAlert) continue

            await this.prisma.missedCheckpointAlert.create({
                data: {
                    estateId: checkpoint.estateId,
                    checkpointId: checkpoint.id,
                    expectedAt: new Date(
                        new Date(referenceTime).getTime() +
                        expectedWindowMs,
                    ),
                },
            })
        }
    }
}
