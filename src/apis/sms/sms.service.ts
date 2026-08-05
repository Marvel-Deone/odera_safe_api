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
//     const url = `${process.env.TERMII_BASE_URL}/api/v1/sms/send`

//     console.log('Termii URL:', url)
//     console.log('Sender ID:', process.env.TERMII_SENDER_ID)

//     const response = await axios.post(
//       url,
//       {
//         api_key: process.env.TERMII_API_KEY,
//         to: formatPhoneNumber(phone),
//         from: process.env.TERMII_SENDER_ID,
//         sms: message,
//         type: 'plain',
//         channel: 'generic',
//       },
//     )

//     return success(
//       response.data,
//       'SMS Sent',
//       'SMS sent successfully',
//     )
//   }
// }

import { Injectable } from '@nestjs/common';
import AfricasTalking from 'africastalking';

@Injectable()
export class SmsService {
  private readonly sms;

  constructor() {
    const africastalking = AfricasTalking({
      apiKey: process.env.AFRICASTALKING_API_KEY!,
      username: process.env.AFRICASTALKING_USERNAME!,
    });

    this.sms = africastalking.SMS;
  }

  async sendSms(phone: string, message: string) {
    return this.sms.send({
      to: [phone],
      message,
    });
  }
}