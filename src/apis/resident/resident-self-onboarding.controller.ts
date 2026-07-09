import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'
import { ResidentSelfOnboardingDto } from './dto/resident.dto'
import { ResidentSelfOnboardingService } from './resident-self-onboarding.service'

@ApiTags('Resident Self Onboarding')
@Controller('residents')
export class ResidentSelfOnboardingController {
  constructor(
    private readonly residentSelfOnboardingService: ResidentSelfOnboardingService,
  ) {}

  @Post('self-onboarding')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Public resident self-onboarding',
    description:
      'Creates a resident self-onboarding request and sends a one-time activation code to WhatsApp.',
  })
  @ApiBody({ type: ResidentSelfOnboardingDto })
  register(@Body() dto: ResidentSelfOnboardingDto) {
    return this.residentSelfOnboardingService.register(dto)
  }
}
