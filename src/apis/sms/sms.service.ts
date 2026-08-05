// import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';

// @Injectable()
// export class SmsService {
//     constructor(
//         private configService: ConfigService,
//     ) { }

//     async sendSms(phone: string, message: string) {
//         const deviceId = process.env.TEXTBEE_DEVICE_ID;
//         const apiKey = process.env.TEXTBEE_API_KEY;

//         // try {
//         //     const response = await axios.post(
//         //         `https://api.textbee.dev/api/v1/gateway/devices/${deviceId}/send-sms`,
//         //         {
//         //             recipients: [phone],
//         //             message,
//         //         },
//         //         {
//         //             headers: {
//         //                 'x-api-key': apiKey,
//         //                 'Content-Type': 'application/json',
//         //             },
//         //         },
//         //     );

//         //     return response.data;
//         // } catch (error) {
//         //     console.error(error.response?.data || error.message);
//         //     throw error;
//         // }
//     }

//     async sendTrackingLink({
//         phone,
//         visitorName,
//         trackingToken,
//     }: {
//         phone: string
//         visitorName: string
//         trackingToken: string
//     }) {
//         const trackingUrl =
//             `${this.configService.get('FRONTEND_URL')}/track/${trackingToken}`

//         const message = `
//             Hello ${visitorName},

//             Estate security requires temporary location sharing during your visit.

//             Open this secure link to enable tracking:
//             ${trackingUrl}

//             Thank you.
//         `

//         // await this.sendSMS(
//         //     phone,
//         //     message,
//         // )
//     }
// }


// import { Injectable } from '@nestjs/common'

// import axios from 'axios'

// import { success } from '../../common/utils/response.util'

// import { formatPhoneNumber } from '../../common/utils/phone.util'

// @Injectable()
// export class SmsService {
//   async sendSms(
//     phone: string,
//     message: string,
//   ) {
//     console.log(`${process.env.TERMII_BASE_URL}/api/sms/send`)
//     const response =
//       await axios.post(
//         `${process.env.TERMII_BASE_URL}/api/sms/send`,
//         {
//           api_key:
//             process.env
//               .TERMII_API_KEY,

//           to:
//             formatPhoneNumber(
//               phone,
//             ),

//           from:
//             process.env
//               .TERMII_SENDER_ID,

//           sms: message,

//           type: 'plain',

//           channel:
//             'generic',
//         },
//       )

//     return success(
//       response.data,
//       'SMS Sent',
//       'SMS sent successfully',
//     )
//   }
// }

import { Injectable } from '@nestjs/common'
import axios from 'axios'

import { success } from '../../common/utils/response.util'
import { formatPhoneNumber } from '../../common/utils/phone.util'

@Injectable()
export class SmsService {
  async sendSms(
    phone: string,
    message: string,
  ) {
    const url = `${process.env.TERMII_BASE_URL}/api/v1/sms/send`

    console.log('Termii URL:', url)
    console.log('Sender ID:', process.env.TERMII_SENDER_ID)

    const response = await axios.post(
      url,
      {
        api_key: process.env.TERMII_API_KEY,
        to: formatPhoneNumber(phone),
        from: process.env.TERMII_SENDER_ID,
        sms: message,
        type: 'plain',
        channel: 'generic',
      },
    )

    return success(
      response.data,
      'SMS Sent',
      'SMS sent successfully',
    )
  }
}