import { Injectable } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { BookingStatus, LogCategory, Role, ShortletStatus } from '@prisma/client'
import { PrismaService } from '../../database/prisma/prisma.service'

@Injectable()
export class ShortletScheduler {
  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_HOUR)
  async expireBookingsAndProperties() {
    await this.completeExpiredBookings()
    await this.expireShortletProperties()
  }

  private async completeExpiredBookings() {
    const bookings = await this.prisma.shortletBooking.findMany({
      where: {
        checkOutDate: { lt: new Date() },
        status: { in: [BookingStatus.ACTIVE, BookingStatus.CHECKED_IN] },
      },
      include: {
        property: {
          include: { resident: true },
        },
      },
    })

    for (const booking of bookings) {
      await this.prisma.$transaction(async (tx) => {
        await tx.shortletBooking.update({
          where: { id: booking.id },
          data: { status: BookingStatus.COMPLETED },
        })

        await tx.activityLog.create({
          data: {
            estateId: booking.property.resident.estateId,
            category: LogCategory.SYSTEM,
            action: 'SHORTLET_BOOKING_COMPLETED',
            description: `Shortlet booking for ${booking.guestName} completed after checkout`,
            actorId: null,
            actorRole: null as Role | null,
            metadata: { bookingId: booking.id, propertyId: booking.propertyId },
          },
        })
      })
    }
  }

  private async expireShortletProperties() {
    const properties = await this.prisma.shortletProperty.findMany({
      where: {
        status: ShortletStatus.ACTIVE,
        OR: [
          { expiresAt: { lt: new Date() } },
          { annualFeeExpiresAt: { lt: new Date() } },
        ],
      },
      include: { resident: true },
    })

    for (const property of properties) {
      await this.prisma.$transaction(async (tx) => {
        await tx.shortletProperty.update({
          where: { id: property.id },
          data: {
            status: ShortletStatus.EXPIRED,
            annualFeePaid: false,
          },
        })

        await tx.activityLog.create({
          data: {
            estateId: property.resident.estateId,
            category: LogCategory.SYSTEM,
            action: 'SHORTLET_PROPERTY_EXPIRED',
            description: `Shortlet property ${property.listingUrl} expired`,
            actorId: null,
            actorRole: null as Role | null,
            metadata: { propertyId: property.id, residentId: property.residentId },
          },
        })
      })
    }
  }
}
