import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Role } from '@prisma/client'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { Roles } from '../auth/decorators/roles.decorator'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { BusinessHubService } from './business-hub.service'
import {
  PayBusinessRegistrationDto,
  RegisterBusinessDto,
  SuspendBusinessRegistrationDto,
  UpsertBusinessHubSettingsDto,
  VerifyBusinessPassDto,
} from './dto/business-hub.dto'

@ApiTags('Business Hub')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('business-hub')
export class BusinessHubController {
  constructor(private readonly businessHubService: BusinessHubService) {}

  @Get('settings')
  @Roles(Role.RESIDENT)
  @ApiOperation({ summary: 'Get Business Hub settings for resident estate' })
  getSettings(@CurrentUser() user: any) {
    return this.businessHubService.getResidentSettings(user.id)
  }

  @Post('registrations')
  @Roles(Role.RESIDENT)
  @ApiOperation({ summary: 'Register resident business' })
  registerBusiness(@CurrentUser() user: any, @Body() dto: RegisterBusinessDto) {
    return this.businessHubService.registerBusiness(user.id, dto)
  }

  @Get('registrations')
  @Roles(Role.RESIDENT)
  @ApiOperation({ summary: 'Get resident Business Hub registrations' })
  getRegistrations(@CurrentUser() user: any) {
    return this.businessHubService.getResidentRegistrations(user.id)
  }

  @Post('registrations/pay')
  @Roles(Role.RESIDENT)
  @ApiOperation({ summary: 'Pay pending Business Hub registration' })
  payRegistration(@CurrentUser() user: any, @Body() dto: PayBusinessRegistrationDto) {
    return this.businessHubService.payRegistration(user.id, dto.registrationId)
  }

  @Get('registrations/:id/pass')
  @Roles(Role.RESIDENT)
  @ApiOperation({ summary: 'Get Business Hub passcode and QR code' })
  getPass(@CurrentUser() user: any, @Param('id') registrationId: string) {
    return this.businessHubService.getRegistrationPass(user.id, registrationId)
  }
}

@ApiTags('Admin Business Hub')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.SUPER_ADMIN)
@Controller('admin/business-hub')
export class AdminBusinessHubController {
  constructor(private readonly businessHubService: BusinessHubService) {}

  @Get('settings')
  @ApiOperation({ summary: 'Get Business Hub settings' })
  getSettings(@CurrentUser() user: any) {
    return this.businessHubService.getAdminSettings(user.id)
  }

  @Post('settings')
  @ApiOperation({ summary: 'Configure Business Hub settings' })
  upsertSettings(@CurrentUser() user: any, @Body() dto: UpsertBusinessHubSettingsDto) {
    return this.businessHubService.upsertSettings(user.id, dto)
  }

  @Get('registrations')
  @ApiOperation({ summary: 'Get estate Business Hub registrations' })
  getRegistrations(@CurrentUser() user: any) {
    return this.businessHubService.getEstateRegistrations(user.id)
  }

  @Patch('registrations/:id/suspend')
  @ApiOperation({ summary: 'Suspend Business Hub registration' })
  suspendRegistration(
    @CurrentUser() user: any,
    @Param('id') registrationId: string,
    @Body() dto: SuspendBusinessRegistrationDto,
  ) {
    return this.businessHubService.suspendRegistration(user.id, registrationId, dto)
  }

  @Patch('registrations/:id/activate')
  @ApiOperation({ summary: 'Activate Business Hub registration' })
  activateRegistration(@CurrentUser() user: any, @Param('id') registrationId: string) {
    return this.businessHubService.activateRegistration(user.id, registrationId)
  }
}

@ApiTags('Guard Business Hub')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.GUARD, Role.SUPER_GUARD, Role.ADMIN, Role.SUPER_ADMIN)
@Controller('guard/business-hub')
export class GuardBusinessHubController {
  constructor(private readonly businessHubService: BusinessHubService) {}

  @Post('verify')
  @ApiOperation({ summary: 'Verify Business Hub QR code or passcode' })
  verifyPass(@CurrentUser() user: any, @Body() dto: VerifyBusinessPassDto) {
    return this.businessHubService.verifyPass(user.id, dto)
  }
}
