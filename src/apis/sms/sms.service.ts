import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SmsService {
    constructor(
        private configService: ConfigService,
    ) { }

    async sendSms(phone: string, message: string) {
        const deviceId = process.env.TEXTBEE_DEVICE_ID;
        const apiKey = process.env.TEXTBEE_API_KEY;

        // try {
        //     const response = await axios.post(
        //         `https://api.textbee.dev/api/v1/gateway/devices/${deviceId}/send-sms`,
        //         {
        //             recipients: [phone],
        //             message,
        //         },
        //         {
        //             headers: {
        //                 'x-api-key': apiKey,
        //                 'Content-Type': 'application/json',
        //             },
        //         },
        //     );

        //     return response.data;
        // } catch (error) {
        //     console.error(error.response?.data || error.message);
        //     throw error;
        // }
    }

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
