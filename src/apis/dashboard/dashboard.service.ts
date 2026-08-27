import { Injectable, HttpStatus } from '@nestjs/common';
import {
  FinanceRecordType,
  IncidentStatus,
  KycStatus,
  LevyStatus,
  ResidentStatus,
  Role,
  SupportTicketStatus,
  VisitorStatus,
  WalletTransactionStatus,
} from '@prisma/client';
import dayjs from 'dayjs';
import { success } from '../../common/utils/response.util';
import { PrismaService } from '../../database/prisma/prisma.service';

type Bucket = {
  label: string;
  count: number;
};

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getAdminDashboard() {
    const todayStart = dayjs().startOf('day').toDate();
    const todayEnd = dayjs().endOf('day').toDate();

    const [
      totalResidents,
      pendingKyc,
      activeResidents,
      visitorsToday,
      guardsOnline,
      monthlyOnboarding,
      visitorTraffic,
      securityIncidents,
    ] = await Promise.all([
      this.prisma.resident.count(),
      this.prisma.resident.count({
        where: { status: ResidentStatus.PENDING },
      }),
      this.prisma.resident.count({
        where: { status: ResidentStatus.ACTIVE },
      }),
      this.prisma.visitor.count({
        where: { visit_date: { gte: todayStart, lte: todayEnd } },
      }),
      this.prisma.user.count({
        where: { role: { in: [Role.GUARD, Role.SUPER_GUARD] } },
      }),
      this.countMonthly('resident', 'createdAt', 6),
      this.countDaily('visitor', 'visit_date', 7),
      this.countMonthly('incident', 'createdAt', 6),
    ]);

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
    );
  }

  async getSuperAdminDashboard() {
    const todayStart = dayjs().startOf('day').toDate();
    const todayEnd = dayjs().endOf('day').toDate();

    const [
      totalEstates,
      totalUsers,
      admins,
      residents,
      coResidents,
      guards,
      activeResidents,
      pendingResidents,
      completedKyc,
      pendingKyc,
      incompleteProfiles,
      visitorsToday,
      checkedInVisitors,
      openIncidents,
      resolvedIncidents,
      openSupportTickets,
      resolvedSupportTickets,
      totalVehicles,
      pendingLevies,
      paidLevies,
      walletBalance,
      successfulWalletTransactions,
      estateIncome,
      estateExpense,
      residentGrowth,
      visitorTraffic,
      incidentTrend,
      supportTicketTrend,
      recentResidents,
      recentVisitors,
      recentIncidents,
      recentSupportTickets,
      recentFinanceRecords,
    ] = await Promise.all([
      this.prisma.estate.count(),
      this.prisma.user.count(),
      this.prisma.user.count({
        where: { role: { in: [Role.ADMIN, Role.SUPER_ADMIN] } },
      }),
      this.prisma.resident.count(),
      this.prisma.residentAssociate.count(),
      this.prisma.user.count({
        where: { role: { in: [Role.GUARD, Role.SUPER_GUARD] } },
      }),
      this.prisma.resident.count({
        where: { status: ResidentStatus.ACTIVE },
      }),
      this.prisma.resident.count({
        where: {
          status: { in: [ResidentStatus.PENDING, ResidentStatus.UNDER_REVIEW] },
        },
      }),
      this.prisma.resident.count({
        where: { kycStatus: KycStatus.COMPLETED },
      }),
      this.prisma.resident.count({
        where: {
          kycStatus: { in: [KycStatus.NOT_SUBMITTED, KycStatus.PENDING] },
        },
      }),
      this.prisma.resident.count({
        where: { completeProfile: false },
      }),
      this.prisma.visitor.count({
        where: { visit_date: { gte: todayStart, lte: todayEnd } },
      }),
      this.prisma.visitor.count({
        where: { status: VisitorStatus.CHECKED_IN },
      }),
      this.prisma.incident.count({
        where: { status: { not: IncidentStatus.CLOSED } },
      }),
      this.prisma.incident.count({
        where: { status: IncidentStatus.CLOSED },
      }),
      this.prisma.supportTicket.count({
        where: { status: SupportTicketStatus.OPEN },
      }),
      this.prisma.supportTicket.count({
        where: { status: SupportTicketStatus.RESOLVED },
      }),
      this.prisma.vehicle.count(),
      this.prisma.levyAssignment.aggregate({
        where: { status: { not: LevyStatus.PAID } },
        _count: { _all: true },
        _sum: { amount: true, paidAmount: true },
      }),
      this.prisma.levyAssignment.aggregate({
        where: { status: LevyStatus.PAID },
        _count: { _all: true },
        _sum: { amount: true, paidAmount: true },
      }),
      this.prisma.wallet.aggregate({
        _sum: { balance: true },
      }),
      this.prisma.walletTransaction.aggregate({
        where: { status: WalletTransactionStatus.SUCCESS },
        _count: { _all: true },
        _sum: { amount: true },
      }),
      this.prisma.estateFinanceRecord.aggregate({
        where: { type: FinanceRecordType.INCOME },
        _sum: { amount: true },
      }),
      this.prisma.estateFinanceRecord.aggregate({
        where: { type: FinanceRecordType.EXPENSE },
        _sum: { amount: true },
      }),
      this.countMonthly('resident', 'createdAt', 6),
      this.countDaily('visitor', 'visit_date', 7),
      this.countMonthly('incident', 'createdAt', 6),
      this.countMonthly('supportTicket', 'createdAt', 6),
      this.prisma.resident.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { estate: true, apartmentType: true },
      }),
      this.prisma.visitor.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { resident: true, estate: true },
      }),
      this.prisma.incident.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          estate: true,
          reportedByResident: true,
          reportedByGuard: true,
        },
      }),
      this.prisma.supportTicket.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { estate: true, createdBy: true },
      }),
      this.prisma.estateFinanceRecord.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { estate: true, recordedBy: true },
      }),
    ]);

    return success(
      {
        stats: {
          estates: totalEstates,
          users: totalUsers,
          admins,
          residents,
          coResidents,
          guards,
          activeResidents,
          pendingResidents,
          completedKyc,
          pendingKyc,
          incompleteProfiles,
          visitorsToday,
          checkedInVisitors,
          openIncidents,
          resolvedIncidents,
          openSupportTickets,
          resolvedSupportTickets,
          totalVehicles,
        },
        finance: {
          walletBalance: this.toNumber(walletBalance._sum.balance),
          successfulWalletTransactions: {
            count: successfulWalletTransactions._count._all,
            amount: this.toNumber(successfulWalletTransactions._sum.amount),
          },
          levies: {
            pending: {
              count: pendingLevies._count._all,
              assignedAmount: this.toNumber(pendingLevies._sum.amount),
              paidAmount: this.toNumber(pendingLevies._sum.paidAmount),
            },
            paid: {
              count: paidLevies._count._all,
              assignedAmount: this.toNumber(paidLevies._sum.amount),
              paidAmount: this.toNumber(paidLevies._sum.paidAmount),
            },
          },
          estateRecords: {
            income: this.toNumber(estateIncome._sum.amount),
            expense: this.toNumber(estateExpense._sum.amount),
          },
        },
        charts: {
          residentGrowth,
          visitorTraffic,
          incidentTrend,
          supportTicketTrend,
        },
        recent: {
          residents: recentResidents,
          visitors: recentVisitors,
          incidents: recentIncidents,
          supportTickets: recentSupportTickets,
          financeRecords: recentFinanceRecords,
        },
      },
      'Super Admin Dashboard Loaded',
      'Super admin dashboard data fetched successfully',
      HttpStatus.OK,
    );
  }

  private async countMonthly(
    model: 'resident' | 'incident' | 'supportTicket',
    dateField: string,
    months: number,
  ): Promise<Bucket[]> {
    return Promise.all(
      Array.from({ length: months }, async (_, index) => {
        const month = dayjs().subtract(months - index - 1, 'month');
        const start = month.startOf('month').toDate();
        const end = month.endOf('month').toDate();

        return {
          label: month.format('MMM'),
          count: await (this.prisma[model] as any).count({
            where: { [dateField]: { gte: start, lte: end } },
          }),
        };
      }),
    );
  }

  private async countDaily(
    model: 'visitor',
    dateField: string,
    days: number,
  ): Promise<Bucket[]> {
    return Promise.all(
      Array.from({ length: days }, async (_, index) => {
        const day = dayjs().subtract(days - index - 1, 'day');
        const start = day.startOf('day').toDate();
        const end = day.endOf('day').toDate();

        return {
          label: day.format('ddd'),
          count: await (this.prisma[model] as any).count({
            where: { [dateField]: { gte: start, lte: end } },
          }),
        };
      }),
    );
  }

  private toNumber(value: unknown) {
    return value === null || value === undefined ? 0 : Number(value);
  }
}
