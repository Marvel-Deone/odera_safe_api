import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Role } from '@prisma/client'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { Roles } from '../auth/decorators/roles.decorator'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import {
  CreateShortletBookingDto,
  CreateShortletPropertyDto,
  UpdateShortletPropertyDto,
  UpsertShortletSettingsDto,
  VerifyShortletAccessDto,
} from './dto/shortlet.dto'
import { ShortletService } from './shortlet.service'

@ApiTags('Shortlet')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('shortlet')
export class ShortletController {
  constructor(private readonly shortletService: ShortletService) {}

  @Post('property')
  @Roles(Role.RESIDENT)
  @ApiOperation({ summary: 'Register and pay for a shortlet property from wallet' })
  registerProperty(@CurrentUser() user: any, @Body() dto: CreateShortletPropertyDto) {
    return this.shortletService.registerProperty(user.id, dto)
  }

  @Get('property')
  @Roles(Role.RESIDENT)
  @ApiOperation({ summary: 'Get resident shortlet properties' })
  getProperties(@CurrentUser() user: any) {
    return this.shortletService.getResidentProperties(user.id)
  }

  @Patch('property')
  @Roles(Role.RESIDENT)
  @ApiOperation({ summary: 'Update resident shortlet property details' })
  updateProperty(@CurrentUser() user: any, @Body() dto: UpdateShortletPropertyDto) {
    return this.shortletService.updateProperty(user.id, dto)
  }

  @Post('booking')
  @Roles(Role.RESIDENT)
  @ApiOperation({ summary: 'Create shortlet booking and generate guest pass' })
  createBooking(@CurrentUser() user: any, @Body() dto: CreateShortletBookingDto) {
    return this.shortletService.createBooking(user.id, dto)
  }

  @Get('bookings')
  @Roles(Role.RESIDENT)
  @ApiOperation({ summary: 'Get resident shortlet bookings' })
  getBookings(@CurrentUser() user: any) {
    return this.shortletService.getBookings(user.id)
  }

  @Get('bookings/:id')
  @Roles(Role.RESIDENT)
  @ApiOperation({ summary: 'Get shortlet booking by ID' })
  getBooking(@CurrentUser() user: any, @Param('id') bookingId: string) {
    return this.shortletService.getBooking(user.id, bookingId)
  }

  @Get('pass/:bookingId')
  @Roles(Role.RESIDENT)
  @ApiOperation({ summary: 'Get shortlet QR and SMS pass data' })
  getPass(@CurrentUser() user: any, @Param('bookingId') bookingId: string) {
    return this.shortletService.getPass(user.id, bookingId)
  }
}

@ApiTags('Admin Shortlet')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.SUPER_ADMIN)
@Controller('admin/shortlet')
export class AdminShortletController {
  constructor(private readonly shortletService: ShortletService) {}

  @Post('settings')
  @ApiOperation({ summary: 'Configure annual shortlet registration fee' })
  upsertSettings(@CurrentUser() user: any, @Body() dto: UpsertShortletSettingsDto) {
    return this.shortletService.upsertSettings(user.id, dto)
  }

  @Get('settings')
  @ApiOperation({ summary: 'Get annual shortlet registration fee settings' })
  getSettings(@CurrentUser() user: any) {
    return this.shortletService.getSettings(user.id)
  }

  @Get('properties')
  @ApiOperation({ summary: 'Get estate shortlet properties' })
  getEstateProperties(@CurrentUser() user: any) {
    return this.shortletService.getEstateProperties(user.id)
  }

  @Patch('property/:id/suspend')
  @ApiOperation({ summary: 'Suspend shortlet property' })
  suspendProperty(@CurrentUser() user: any, @Param('id') propertyId: string) {
    return this.shortletService.suspendProperty(user.id, propertyId)
  }

  @Patch('property/:id/activate')
  @ApiOperation({ summary: 'Activate shortlet property' })
  activateProperty(@CurrentUser() user: any, @Param('id') propertyId: string) {
    return this.shortletService.activateProperty(user.id, propertyId)
  }
}

@ApiTags('Guard Shortlet')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.GUARD, Role.ADMIN, Role.SUPER_ADMIN)
@Controller('guard/shortlet')
export class GuardShortletController {
  constructor(private readonly shortletService: ShortletService) {}

  @Post('verify')
  @ApiOperation({ summary: 'Verify shortlet guest using QR payload or SMS code' })
  verifyAccess(@CurrentUser() user: any, @Body() dto: VerifyShortletAccessDto) {
    return this.shortletService.verifyAccess(user.id, dto)
  }
}
