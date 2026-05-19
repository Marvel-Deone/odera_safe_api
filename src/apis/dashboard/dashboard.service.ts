import { Injectable, HttpStatus } from '@nestjs/common'
import { PrismaService } from '../../database/prisma/prisma.service'
import { success } from '../../common/utils/response.util'
import { ResidentStatus, Role } from '@prisma/client'
import dayjs from 'dayjs'

type MonthlyData = {
  month: string
  count: number
}

type DailyData = {
  day: string
  count: number
}

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getAdminDashboard() {
    const todayStart = dayjs().startOf('day').toDate()
    const todayEnd = dayjs().endOf('day').toDate()

    // =====================
    // STATS
    // =====================

    const totalResidents = await this.prisma.resident.count()

    const pendingKyc = await this.prisma.resident.count({
      where: {
        status: ResidentStatus.PENDING,
      },
    })

    const activeResidents = await this.prisma.resident.count({
      where: {
        status: ResidentStatus.ACTIVE,
      },
    })

    const visitorsToday = await this.prisma.visitor.count({
      where: {
        visit_date: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    })

    // there's no "online" tracking yet
    // so for now we fake it as total guards
    const guardsOnline = await this.prisma.user.count({
      where: {
        role: Role.GUARD,
      },
    })

    // =====================
    // CHARTS
    // =====================

    // Monthly onboarding (last 6 months)
    const monthlyOnboardingRaw =
      await this.prisma.resident.groupBy({
        by: ['createdAt'],
      })

    // We'll manually bucket it
    const monthlyOnboarding = this.generateMonthlyBuckets(
      monthlyOnboardingRaw,
    )

    // Visitor traffic (last 7 days)
    const visitorTrafficRaw =
      await this.prisma.visitor.groupBy({
        by: ['visit_date'],
      })

    const visitorTraffic =
      this.generateDailyBuckets(visitorTrafficRaw)

    // Security incidents (placeholder)
    const securityIncidents =
      this.generateEmptyMonthlyData()

    return success(
      {
        stats: {
          totalResidents,
          pendingKyc,
          activeResidents,
          visitorsToday,
          guardsOnline,
        },
        charts: {
          monthlyOnboarding,
          visitorTraffic,
          securityIncidents,
        },
      },
      'Dashboard Loaded',
      'Admin dashboard analytics fetched successfully',
      HttpStatus.OK,
    )
  }

  // =====================
  // HELPERS
  // =====================

  private generateMonthlyBuckets(data: any[]) {
    const months: MonthlyData[] = []

    for (let i = 5; i >= 0; i--) {
      const month = dayjs().subtract(i, 'month')
      const label = month.format('MMM')

      const count = data.filter((d) =>
        dayjs(d.createdAt).isSame(month, 'month'),
      ).length

      months.push({
        month: label,
        count,
      })
    }

    return months
  }

  private generateDailyBuckets(data: any[]) {
    const days: DailyData[] = []

    for (let i = 6; i >= 0; i--) {
      const day = dayjs().subtract(i, 'day')
      const label = day.format('ddd')

      const count = data.filter((d) =>
        dayjs(d.visitDate).isSame(day, 'day'),
      ).length

      days.push({
        day: label,
        count,
      })
    }

    return days
  }

  private generateEmptyMonthlyData() {
    const months: { month: string; count: number }[] = []

    for (let i = 5; i >= 0; i--) {
      const month = dayjs().subtract(i, 'month')

      months.push({
        month: month.format('MMM'),
        count: 0,
      })
    }

    return months
  }
}