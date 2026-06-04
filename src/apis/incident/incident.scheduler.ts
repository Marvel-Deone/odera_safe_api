import {
  Injectable,
} from '@nestjs/common'

import {
  Cron,
  CronExpression,
} from '@nestjs/schedule'
import { PrismaService } from '../../database/prisma/prisma.service'
import { IncidentGateway } from './incident.gateway'

@Injectable()
export class IncidentScheduler {
  constructor(
    private readonly prisma: PrismaService,

    private readonly incidentGateway: IncidentGateway,
  ) {}

  @Cron(
    CronExpression.EVERY_MINUTE,
  )
  async checkBreachedTickets() {
    const breached =
      await this.prisma.incident.updateMany({
        where: {
          slaDeadline: {
            lt: new Date(),
          },

          status: {
            not: 'RESOLVED',
          },
        },

        data: {
          status: 'BREACHED',
        },
      })

    if (breached.count > 0) {
      this.incidentGateway.emitIncidentBreached(
        breached,
      )
    }
  }
}