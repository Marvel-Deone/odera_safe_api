import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Role } from '@prisma/client'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { Roles } from '../auth/decorators/roles.decorator'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { CreateVehicleDto, RejectVehicleDto, UpdateVehicleDto, VehicleAccessDto } from './dto/vehicle.dto'
import { VehicleService } from './vehicle.service'

@ApiTags('Vehicle Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('vehicles')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Post()
  @Roles(Role.RESIDENT)
  @ApiOperation({ summary: 'Resident registers a vehicle for review' })
  createVehicle(@CurrentUser() user: any, @Body() dto: CreateVehicleDto) {
    return this.vehicleService.createVehicle(user.id, dto)
  }

  @Get()
  @Roles(Role.RESIDENT)
  @ApiOperation({ summary: 'Get resident vehicles' })
  getMyVehicles(@CurrentUser() user: any) {
    return this.vehicleService.getMyVehicles(user.id)
  }

  @Patch(':vehicleId')
  @Roles(Role.RESIDENT)
  @ApiOperation({ summary: 'Edit rejected or payment failed vehicle details' })
  updateVehicle(
    @CurrentUser() user: any,
    @Param('vehicleId') vehicleId: string,
    @Body() dto: UpdateVehicleDto,
  ) {
    return this.vehicleService.updateVehicle(user.id, vehicleId, dto)
  }

  @Patch(':vehicleId/resubmit')
  @Roles(Role.RESIDENT)
  @ApiOperation({ summary: 'Resubmit rejected or payment failed vehicle' })
  resubmitVehicle(
    @CurrentUser() user: any,
    @Param('vehicleId') vehicleId: string,
    @Body() dto: UpdateVehicleDto,
  ) {
    return this.vehicleService.resubmitVehicle(user.id, vehicleId, dto)
  }

  @Post('access')
  @Roles(Role.GUARD, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Validate active vehicle by plate number' })
  validateAccess(@CurrentUser() user: any, @Body() dto: VehicleAccessDto) {
    return this.vehicleService.validateAccess(user.id, dto)
  }
}

@ApiTags('Admin Vehicle Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.SUPER_ADMIN)
@Controller('admin/vehicles')
export class AdminVehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Get()
  @ApiOperation({ summary: 'Get estate vehicles for admin review' })
  getEstateVehicles(@CurrentUser() user: any) {
    return this.vehicleService.getEstateVehicles(user.id)
  }

  @Patch(':vehicleId/approve')
  @ApiOperation({ summary: 'Approve vehicle and charge wallet if free limit is exceeded' })
  approveVehicle(@CurrentUser() user: any, @Param('vehicleId') vehicleId: string) {
    return this.vehicleService.approveVehicle(user.id, vehicleId)
  }

  @Patch(':vehicleId/retry-approval')
  @ApiOperation({ summary: 'Retry approval for vehicle with failed registration payment' })
  retryApproval(@CurrentUser() user: any, @Param('vehicleId') vehicleId: string) {
    return this.vehicleService.approveVehicle(user.id, vehicleId, true)
  }

  @Patch(':vehicleId/reject')
  @ApiOperation({ summary: 'Reject vehicle registration' })
  rejectVehicle(
    @CurrentUser() user: any,
    @Param('vehicleId') vehicleId: string,
    @Body() dto: RejectVehicleDto,
  ) {
    return this.vehicleService.rejectVehicle(user.id, vehicleId, dto)
  }

  @Patch(':vehicleId/suspend')
  @ApiOperation({ summary: 'Suspend an active vehicle' })
  suspendVehicle(@CurrentUser() user: any, @Param('vehicleId') vehicleId: string) {
    return this.vehicleService.suspendVehicle(user.id, vehicleId)
  }
}
