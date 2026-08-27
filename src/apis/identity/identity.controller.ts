import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { IdentityService } from './identity.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SkipLevyCheck } from '../auth/decorators/skip-levy-check.decorator';
import { NinVerificationDto } from './dto/verify-nin.dto';

@ApiTags('Identity')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('identity')
export class IdentityController {
  constructor(private readonly identityService: IdentityService) {}

  @Post('verify-nin')
  @SkipLevyCheck()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Verify NIN',
    description:
      'Verifies a Nigerian NIN against QoreID using the supplied first name and last name.',
  })
  @ApiBody({
    type: NinVerificationDto,
  })
  @ApiResponse({
    status: 200,
    description: 'NIN verification successful',
  })
  async verifyNin(@Body() dto: NinVerificationDto) {
    return this.identityService.verifyNin(dto);
  }
}
