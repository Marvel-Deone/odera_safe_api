import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { createHmac } from 'crypto'

type PaystackResponse<T = any> = {
  status: boolean
  message: string
  data: T
}

@Injectable()
export class PaystackService {
  private readonly baseUrl = 'https://api.paystack.co'

  constructor(private readonly config: ConfigService) {}

  private get secretKey() {
    return this.config.get<string>('PAYSTACK_SECRET_KEY')
  }

  private get callbackUrl() {
    return this.config.get<string>('PAYSTACK_CALLBACK_URL')
  }

  private get preferredDedicatedAccountBank() {
    return this.config.get<string>('PAYSTACK_PREFERRED_BANK') ?? 'wema-bank'
  }

  private async request<T>(
    path: string,
    method: 'GET' | 'POST',
    body?: Record<string, any>,
  ): Promise<PaystackResponse<T>> {
    if (!this.secretKey) {
      throw new Error('PAYSTACK_SECRET_KEY environment variable is not set')
    }

    const response = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    })

    const data = (await response.json()) as PaystackResponse<T>

    if (!response.ok || !data.status) {
      throw new Error(data.message || 'Paystack request failed')
    }

    return data
  }

  initializeTransaction(
    email: string,
    amount: number,
    reference: string,
    metadata: Record<string, any>,
  ) {
    return this.request<{
      authorization_url: string
      access_code: string
      reference: string
    }>('/transaction/initialize', 'POST', {
      email,
      amount: Math.round(amount * 100),
      reference,
      callback_url: this.callbackUrl,
      metadata,
    })
  }

  verifyTransaction(reference: string) {
    return this.request<{
      id: number
      status: string
      reference: string
      amount: number
      paid_at: string
      metadata: Record<string, any>
    }>(`/transaction/verify/${reference}`, 'GET')
  }

  createCustomer(
    email: string,
    firstName: string,
    lastName: string,
    phone?: string,
  ) {
    return this.request<{
      id: number
      customer_code: string
      email: string
    }>('/customer', 'POST', {
      email,
      first_name: firstName,
      last_name: lastName,
      phone,
    })
  }

  createDedicatedVirtualAccount(customerCode: string, preferredBank?: string) {
    return this.request<{
      account_name: string
      account_number: string
      bank: {
        name: string
        slug: string
      }
      customer: {
        customer_code: string
      }
    }>('/dedicated_account', 'POST', {
      customer: customerCode,
      preferred_bank: preferredBank ?? this.preferredDedicatedAccountBank,
    })
  }

  createTransferRecipient(
    accountName: string,
    accountNumber: string,
    bankCode: string,
  ) {
    return this.request<{
      recipient_code: string
    }>('/transferrecipient', 'POST', {
      type: 'nuban',
      name: accountName,
      account_number: accountNumber,
      bank_code: bankCode,
      currency: 'NGN',
    })
  }

  initiateTransfer(
    amount: number,
    recipientCode: string,
    reference: string,
    reason: string,
  ) {
    return this.request<{
      transfer_code: string
      reference: string
      status: string
    }>('/transfer', 'POST', {
      source: 'balance',
      amount: Math.round(amount * 100),
      recipient: recipientCode,
      reference,
      reason,
    })
  }

  verifyWebhookSignature(rawBody: Buffer | string, signature?: string) {
    if (!this.secretKey || !signature) {
      return false
    }

    const hash = createHmac('sha512', this.secretKey)
      .update(rawBody)
      .digest('hex')

    return hash === signature
  }
}
