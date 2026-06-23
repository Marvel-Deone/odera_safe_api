import {
  Body,
  Controller,
  Post,
} from '@nestjs/common'

import {
  ApiTags,
  ApiOperation,
} from '@nestjs/swagger'

import { SmsService } from './sms.service'
import { SendSmsDto } from './dto/sms-dto'


@ApiTags('SMS')
@Controller('sms')
export class SmsController {
  constructor(
    private readonly smsService: SmsService,
  ) {}

  @Post('test')
  @ApiOperation({
    summary:
      'Send test SMS',
  })
  sendTestSms(
    @Body()
    dto: SendSmsDto,
  ) {
    return this.smsService.sendSms(
      dto.phone,
      dto.message,
    )
  }
}