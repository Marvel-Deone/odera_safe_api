import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SmsService {
    constructor(
        private configService: ConfigService,
    ) { }

    async sendTrackingLink({
        phone,
        visitorName,
        trackingToken,
    }: {
        phone: string
        visitorName: string
        trackingToken: string
    }) {
        const trackingUrl =
            `${this.configService.get('FRONTEND_URL')}/track/${trackingToken}`

        const message = `
            Hello ${visitorName},

            Estate security requires temporary location sharing during your visit.

            Open this secure link to enable tracking:
            ${trackingUrl}

            Thank you.
        `

        // await this.sendSMS(
        //     phone,
        //     message,
        // )
    }
}
