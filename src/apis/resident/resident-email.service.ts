// import { HttpService } from '@nestjs/axios'
// import { Injectable, Logger } from '@nestjs/common'
// import { ConfigService } from '@nestjs/config'
// import axios from 'axios'
// import { firstValueFrom } from 'rxjs'

// @Injectable()
// export class ResidentEmailService {
//   private readonly logger = new Logger(ResidentEmailService.name)

//   constructor(
//     private readonly http: HttpService,
//     private readonly config: ConfigService,
//   ) {}

//   async sendOnboardingActivationEmail(input: {
//     toEmail: string
//     fullName?: string
//     houseNumber: string
//     activationCode: string
//     appDownloadLink: string
//   }) {
//     const toEmail = input.toEmail?.trim()

//     if (!toEmail) {
//       return {
//         accepted: false,
//         status: 'SKIPPED',
//         reason: 'No recipient email provided',
//       }
//     }

//     const subject = 'Your Odera Safe activation code'
//     const text = [
//       `Hello ${input.fullName ?? 'there'},`,
//       '',
//       `Your Odera Safe activation code for house ${input.houseNumber} is ${input.activationCode}.`,
//       `Download the app here: ${input.appDownloadLink}`,
//       '',
//       'Use this code to complete your onboarding.',
//     ].join('\n')

//     const html = [
//       `<p>Hello ${input.fullName ?? 'there'},</p>`,
//       `<p>Your Odera Safe activation code for house ${input.houseNumber} is <strong>${input.activationCode}</strong>.</p>`,
//       `<p>Download the app here: <a href="${input.appDownloadLink}">${input.appDownloadLink}</a></p>`,
//       '<p>Use this code to complete your onboarding.</p>',
//     ].join('')

//     const sendGridApiKey = this.config.get<string>('SENDGRID_API_KEY')?.trim()
//     const sendGridFromEmail = this.config.get<string>('SENDGRID_FROM_EMAIL')?.trim()

//     if (sendGridApiKey && sendGridFromEmail) {
//       try {
//         await firstValueFrom(
//           this.http.post(
//             'https://api.sendgrid.com/v3/mail/send',
//             {
//               personalizations: [{ to: [{ email: toEmail }] }],
//               from: { email: sendGridFromEmail },
//               subject,
//               content: [
//                 { type: 'text/plain', value: text },
//                 { type: 'text/html', value: html },
//               ],
//             },
//             {
//               headers: {
//                 Authorization: `Bearer ${sendGridApiKey}`,
//                 'Content-Type': 'application/json',
//               },
//               timeout: 15_000,
//             },
//           ),
//         )

//         return {
//           accepted: true,
//           status: 'SENT',
//           provider: 'sendgrid',
//           recipient: toEmail,
//         }
//       } catch (error: unknown) {
//         const message = axios.isAxiosError(error)
//           ? error.response?.data?.errors?.[0]?.message ?? error.message
//           : error instanceof Error
//             ? error.message
//             : 'Unknown email provider error'

//         this.logger.warn(`Email delivery failed for ${toEmail}: ${message}`)
//       }
//     }

//     const webhookUrl = this.config.get<string>('EMAIL_WEBHOOK_URL')?.trim()

//     if (webhookUrl) {
//       try {
//         const response = await firstValueFrom(
//           this.http.post(
//             webhookUrl,
//             {
//               toEmail,
//               subject,
//               text,
//               html,
//               template: 'resident-onboarding-activation',
//             },
//             {
//               timeout: 15_000,
//             },
//           ),
//         )

//         return {
//           accepted: true,
//           status: 'SENT',
//           provider: 'webhook',
//           recipient: toEmail,
//           providerResponse: response.data,
//         }
//       } catch (error: unknown) {
//         const message = axios.isAxiosError(error)
//           ? error.message
//           : error instanceof Error
//             ? error.message
//             : 'Unknown webhook error'

//         this.logger.warn(`Email webhook delivery failed for ${toEmail}: ${message}`)
//       }
//     }

//     return {
//       accepted: false,
//       status: 'SKIPPED',
//       reason: 'No email provider configured',
//       recipient: toEmail,
//     }
//   }
// }


import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Resend } from 'resend'

@Injectable()
export class ResidentEmailService {
    private readonly logger = new Logger(ResidentEmailService.name)
    private readonly resend: Resend

    constructor(private readonly config: ConfigService) {
        this.resend = new Resend(this.config.get<string>('RESEND_API_KEY'))
    }

    async sendOnboardingActivationEmail(input: {
        toEmail: string
        fullName?: string
        houseNumber: string
        activationCode: string
        appDownloadLink: string
    }) {
        const toEmail = input.toEmail?.trim()

        if (!toEmail) {
            return {
                accepted: false,
                status: 'SKIPPED',
                reason: 'No recipient email provided',
            }
        }

        const from = this.config.get<string>('RESEND_FROM_EMAIL')?.trim()

        if (!from) {
            return {
                accepted: false,
                status: 'SKIPPED',
                reason: 'RESEND_FROM_EMAIL not configured',
            }
        }

        const subject = 'Welcome to Odera Safe • Your Activation Code'

        const text = [
            `Hello ${input.fullName ?? 'there'},`,
            '',
            `Your Odera Safe activation code for house ${input.houseNumber} is ${input.activationCode}.`,
            `Download the app here: ${input.appDownloadLink}`,
            '',
            'Use this code to complete your onboarding.',
        ].join('\n')

        // const html = `
        //   <p>Hello ${input.fullName ?? 'there'},</p>
        //   <p>
        //     Your Odera Safe activation code for house
        //     <strong>${input.houseNumber}</strong> is
        //     <strong>${input.activationCode}</strong>.
        //   </p>
        //   <p>
        //     Download the app here:
        //     <a href="${input.appDownloadLink}">
        //       ${input.appDownloadLink}
        //     </a>
        //   </p>
        //   <p>Use this code to complete your onboarding.</p>
        // `

        const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Odera Safe Activation</title>
    </head>

    <body style="margin:0;padding:0;background:#f5f7fb;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
        Your Odera Safe activation code is ready. Complete your resident onboarding in just a few steps.
    </div>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f5f7fb;padding:40px 16px;">
    <tr>
    <td align="center">

    <table role="presentation" width="600" cellspacing="0" cellpadding="0"
    style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,.08);">

    <!-- Header -->
    <tr>
    <td
    style="background:#a41818;padding:36px;text-align:center;color:#ffffff;">

    <h1 style="margin:0;font-size:30px;font-weight:700;">
    Odera Safe
    </h1>

    <p style="margin-top:10px;font-size:16px;color:#cbd5e1;">
    Resident Activation
    </p>

    </td>
    </tr>

    <!-- Body -->
    <tr>
    <td style="padding:40px;">

    <p style="margin-top:0;font-size:18px;">
    Hello <strong>${input.fullName ?? 'Resident'}</strong>,
    </p>

    <p style="line-height:1.7;color:#475569;">
    Welcome to <strong>Odera Safe</strong>.
    Your resident onboarding has been created successfully for house
    <strong>${input.houseNumber}</strong>.
    </p>

    <p style="line-height:1.7;color:#475569;">
    Use the activation code below to complete your registration in the mobile app.
    </p>

    <!-- Code -->

    <table width="100%" cellspacing="0" cellpadding="0"
    style="margin:32px 0;">
    <tr>
    <td align="center"
    style="
    background:#eef4ff;
    border:2px dashed #a41818;
    border-radius:12px;
    padding:28px;
    ">

    <div
    style="
    font-size:38px;
    font-weight:700;
    letter-spacing:10px;
    color:#a41818;
    ">
    ${input.activationCode}
    </div>

    <div
    style="
    margin-top:10px;
    font-size:13px;
    color:#64748b;
    ">
    Activation Code
    </div>

    </td>
    </tr>
    </table>

    <!-- Button -->

    <table cellspacing="0" cellpadding="0" align="center">
    <tr>
    <td
    style="
    border-radius:8px;
    background:#a41818;
    ">
    <a
    href="${input.appDownloadLink}"
    style="
    display:inline-block;
    padding:16px 32px;
    font-size:16px;
    font-weight:bold;
    color:#ffffff;
    text-decoration:none;
    ">
    Download the App
    </a>
    </td>
    </tr>
    </table>

    <p style="margin-top:40px;line-height:1.7;color:#475569;">
    For your security, never share this activation code with anyone.
    If you did not request this onboarding, please ignore this email.
    </p>

    </td>
    </tr>

    <!-- Footer -->

    <tr>
    <td
    style="
    background:#f8fafc;
    padding:24px;
    text-align:center;
    font-size:13px;
    color:#64748b;
    ">

    <p style="margin:0;">
    © ${new Date().getFullYear()} Odera Safe
    </p>

    <p style="margin-top:8px;">
    Making estates safer, smarter and connected.
    </p>

    </td>
    </tr>

    </table>

    </td>
    </tr>
    </table>

    </body>
    </html>
    `

        try {
            const { data, error } = await this.resend.emails.send({
                from,
                to: toEmail,
                subject,
                text,
                html,
            })

            if (error) {
                this.logger.warn(
                    `Email delivery failed for ${toEmail}: ${error.message}`,
                )

                return {
                    accepted: false,
                    status: 'FAILED',
                    reason: error.message,
                }
            }

            return {
                accepted: true,
                status: 'SENT',
                provider: 'resend',
                recipient: toEmail,
                emailId: data?.id,
            }
        } catch (error) {
            const message =
                error instanceof Error ? error.message : 'Unknown Resend error'

            this.logger.error(`Email delivery failed for ${toEmail}: ${message}`)

            return {
                accepted: false,
                status: 'FAILED',
                reason: message,
            }
        }
    }
}