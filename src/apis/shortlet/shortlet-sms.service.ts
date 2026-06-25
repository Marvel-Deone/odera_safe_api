import { Injectable } from '@nestjs/common'

@Injectable()
export class ShortletSmsService {
  buildGuestPassMessage(data: {
    guestName: string
    checkInDate: Date
    checkOutDate: Date
    smsCode: string
    estateName: string
  }) {
    return [
      `Hello ${data.guestName},`,
      `Your ${data.estateName} shortlet guest pass is ready.`,
      `Check-in: ${data.checkInDate.toISOString()}`,
      `Check-out: ${data.checkOutDate.toISOString()}`,
      `SMS Code: ${data.smsCode}`,
    ].join('\n')
  }

  async sendGuestPass(data: {
    phone: string
    guestName: string
    checkInDate: Date
    checkOutDate: Date
    smsCode: string
    estateName: string
  }) {
    const message = this.buildGuestPassMessage(data)

    return {
      provider: 'pending',
      phone: data.phone,
      message,
      sent: false,
    }
  }
}
