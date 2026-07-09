import { Injectable } from '@nestjs/common'
import axios from 'axios'
import { formatPhoneNumber } from '../../common/utils/phone.util'

@Injectable()
export class ResidentWhatsappService {
  buildOnboardingActivationMessage(data: {
    houseNumber: string
    activationCode: string
    appDownloadLink: string
  }) {
    return [
      'Welcome to OderaSafe.',
      `House Number: ${data.houseNumber}`,
      `One-time activation code: ${data.activationCode}`,
      `Download the app: ${data.appDownloadLink}`,
    ].join('\n')
  }

  async sendOnboardingActivationMessage(data: {
    whatsappPhone: string
    houseNumber: string
    activationCode: string
    appDownloadLink: string
  }) {
    const formattedPhone = formatPhoneNumber(data.whatsappPhone)
    const message = this.buildOnboardingActivationMessage(data)
    const webhookUrl = process.env.WHATSAPP_ONBOARDING_WEBHOOK_URL

    if (!webhookUrl) {
      return {
        provider: 'not_configured',
        sent: false,
        to: formattedPhone,
        message,
      }
    }

    const response = await axios.post(webhookUrl, {
      to: formattedPhone,
      message,
      type: 'resident_onboarding_activation',
    })

    return {
      provider: 'webhook',
      sent: true,
      to: formattedPhone,
      response: response.data,
    }
  }
}
