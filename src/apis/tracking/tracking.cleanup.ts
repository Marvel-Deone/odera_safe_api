import { Injectable } from '@nestjs/common'

import { Cron, CronExpression } from '@nestjs/schedule'

import { PrismaService } from '../../database/prisma/prisma.service'

@Injectable()
export class TrackingCleanupService {
    constructor(
        private prisma: PrismaService,
    ) {}

    // every day at midnight
    @Cron(
        CronExpression.EVERY_DAY_AT_MIDNIGHT,
    )
    async cleanupOldLocations() {
        const result =
            await this.prisma.visitorLocation.deleteMany({
                where: {
                    createdAt: {
                        lt: new Date(
                            Date.now() -
                                30 *
                                    24 *
                                    60 *
                                    60 *
                                    1000,
                        ),
                    },
                },
            })

        console.log(
            `Deleted ${result.count} old locations`,
        )
    }
}