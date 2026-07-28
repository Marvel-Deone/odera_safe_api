import { HttpService } from '@nestjs/axios'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import axios from 'axios'
import { firstValueFrom } from 'rxjs'
import { formatPhoneNumber } from '../../common/utils/phone.util'

@Injectable()
export class ResidentWhatsappService {
  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {}

  async sendOnboardingActivationMessage(input: {
    whatsappPhone: string
    houseNumber: string
    activationCode: string
    appDownloadLink: string
  }) {
    const token = this.config
      .getOrThrow<string>('WHATSAPP_ACCESS_TOKEN')
      .trim()

    const phoneNumberId = this.config
      .getOrThrow<string>('WHATSAPP_PHONE_NUMBER_ID')
      .trim()

    const apiVersion = (
      this.config.get<string>('WHATSAPP_GRAPH_API_VERSION') ??
      this.config.get<string>('WHATSAPP_API_VERSION') ??
      'v25.0'
    ).trim()

    const templateName = this.config
      .getOrThrow<string>('WHATSAPP_TEMPLATE_NAME')
      .trim()

    const templateLanguage = (
      this.config.get<string>('WHATSAPP_TEMPLATE_LANGUAGE') ?? 'en_US'
    ).trim()

    const recipient = formatPhoneNumber(input.whatsappPhone)

    try {
      const response = await firstValueFrom(
        this.http.post(
          `https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`,
          {
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: recipient,
            type: 'template',
            template: {
              name: templateName,
              language: {
                code: templateLanguage,
              },
              components: [
                {
                  type: 'body',
                  parameters: [
                    {
                      type: 'text',
                      text: input.houseNumber,
                    },
                    {
                      type: 'text',
                      text: input.activationCode,
                    },
                    {
                      type: 'text',
                      text: input.appDownloadLink,
                    },
                  ],
                },
              ],
            },
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            timeout: 15_000,
          },
        ),
      )

      return {
        accepted: true,
        status: 'ACCEPTED',
        messageId: response.data.messages?.[0]?.id,
        recipient,
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const metaError = error.response?.data?.error

        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_GATEWAY,
            status: 'error',
            title: 'WhatsApp Message Failed',
            message:
              metaError?.error_data?.details ??
              metaError?.message ??
              error.message,
            data: {
              recipient,
              providerStatus: error.response?.status,
              providerCode: metaError?.code,
              providerSubcode: metaError?.error_subcode,
              fbtraceId: metaError?.fbtrace_id,
            },
          },
          HttpStatus.BAD_GATEWAY,
        )
      }

      throw error
    }
  }
}
