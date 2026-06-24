import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Role } from '@prisma/client'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { Roles } from '../auth/decorators/roles.decorator'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import {
  CreateHeavyVehiclePassDto,
  HeavyVehicleAccessDto,
  RejectHeavyVehiclePassDto,
} from './dto/heavy-vehicle.dto'
import { HeavyVehicleService } from './heavy-vehicle.service'

@ApiTags('Heavy Vehicle Access')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('heavy-vehicles')
export class HeavyVehicleController {
  constructor(private readonly heavyVehicleService: HeavyVehicleService) {}

  @Post()
  @Roles(Role.RESIDENT)
  @ApiOperation({ summary: 'Resident requests a heavy vehicle pass' })
  createPass(@CurrentUser() user: any, @Body() dto: CreateHeavyVehiclePassDto) {
    return this.heavyVehicleService.createPass(user.id, dto)
  }

  @Get()
  @Roles(Role.RESIDENT)
  @ApiOperation({ summary: 'Get resident heavy vehicle passes' })
  getMyPasses(@CurrentUser() user: any) {
    return this.heavyVehicleService.getMyPasses(user.id)
  }

  @Post(':passId/retry-payment')
  @Roles(Role.RESIDENT)
  @ApiOperation({ summary: 'Retry wallet payment for a heavy vehicle pass' })
  retryPayment(@CurrentUser() user: any, @Param('passId') passId: string) {
    return this.heavyVehicleService.retryPayment(user.id, passId)
  }

  @Post('access')
  @Roles(Role.GUARD, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Validate heavy vehicle pass at gate' })
  validateAccess(@CurrentUser() user: any, @Body() dto: HeavyVehicleAccessDto) {
    return this.heavyVehicleService.validateAccess(user.id, dto)
  }
}

@ApiTags('Admin Heavy Vehicle Access')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.SUPER_ADMIN)
@Controller('admin/heavy-vehicles')
export class AdminHeavyVehicleController {
  constructor(private readonly heavyVehicleService: HeavyVehicleService) {}

  @Get()
  @ApiOperation({ summary: 'Get estate heavy vehicle requests' })
  getEstatePasses(@CurrentUser() user: any) {
    return this.heavyVehicleService.getEstatePasses(user.id)
  }

  @Patch(':passId/approve')
  @ApiOperation({ summary: 'Approve heavy vehicle pass request' })
  approvePass(@CurrentUser() user: any, @Param('passId') passId: string) {
    return this.heavyVehicleService.approvePass(user.id, passId)
  }

  @Patch(':passId/reject')
  @ApiOperation({ summary: 'Reject heavy vehicle pass request' })
  rejectPass(
    @CurrentUser() user: any,
    @Param('passId') passId: string,
    @Body() dto: RejectHeavyVehiclePassDto,
  ) {
    return this.heavyVehicleService.rejectPass(user.id, passId, dto)
  }
}
