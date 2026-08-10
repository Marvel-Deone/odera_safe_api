import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Role } from '@prisma/client'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { Roles } from '../auth/decorators/roles.decorator'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import {
  CreateEstateStreetDto,
  CreateHeavyVehicleCategoryDto,
  UpdateEstateDetailsDto,
  UpdateEstateSettingsDto,
  UpdateEstateStreetDto,
  UpdateHeavyVehicleCategoryDto,
} from './dto/estate-config.dto'
import { EstateConfigService } from './estate-config.service'
import { SkipLevyCheck } from '../auth/decorators/skip-levy-check.decorator'

@ApiTags('Public Estates')
@Controller('estates')
export class PublicEstateController {
  constructor(private readonly estateConfigService: EstateConfigService) {}

  @Get()
  @ApiOperation({ summary: 'Get all estates' })
  getEstates() {
    return this.estateConfigService.getPublicEstates()
  }

  @Get(':estateId/streets')
  @ApiOperation({ summary: 'Get estate streets by estate ID' })
  getEstateStreets(@Param('estateId') estateId: string) {
    return this.estateConfigService.getPublicEstateStreets(estateId)
  }
}

@ApiTags('Admin Estate Configuration')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.SUPER_ADMIN)
@Controller('admin/estate')
export class AdminEstateConfigController {
  constructor(private readonly estateConfigService: EstateConfigService) { }

  @Get()
  @ApiOperation({ summary: 'Get estate configuration dashboard data' })
  getEstateConfiguration(@CurrentUser() user: any) {
    return this.estateConfigService.getEstateConfiguration(user.id)
  }

  @Patch()
  @ApiOperation({ summary: 'Update estate details' })
  updateEstateDetails(@CurrentUser() user: any, @Body() dto: UpdateEstateDetailsDto) {
    return this.estateConfigService.updateEstateDetails(user.id, dto)
  }

  @Get('settings')
  @ApiOperation({ summary: 'Get vehicle registration settings' })
  getSettings(@CurrentUser() user: any) {
    return this.estateConfigService.getSettings(user.id)
  }

  @Patch('settings')
  @ApiOperation({ summary: 'Update vehicle registration settings' })
  updateSettings(@CurrentUser() user: any, @Body() dto: UpdateEstateSettingsDto) {
    return this.estateConfigService.updateSettings(user.id, dto)
  }

  @Post('streets')
  @ApiOperation({ summary: 'Create estate street' })
  createStreet(@CurrentUser() user: any, @Body() dto: CreateEstateStreetDto) {
    return this.estateConfigService.createStreet(user.id, dto)
  }

  @Get('streets')
  @ApiOperation({ summary: 'Get estate streets' })
  getStreets(@CurrentUser() user: any) {
    return this.estateConfigService.getStreets(user.id)
  }

  @Patch('streets/:streetId')
  @ApiOperation({ summary: 'Update estate street' })
  updateStreet(
    @CurrentUser() user: any,
    @Param('streetId') streetId: string,
    @Body() dto: UpdateEstateStreetDto,
  ) {
    return this.estateConfigService.updateStreet(user.id, streetId, dto)
  }

  @Delete('streets/:streetId')
  @ApiOperation({ summary: 'Delete estate street' })
  deleteStreet(@CurrentUser() user: any, @Param('streetId') streetId: string) {
    return this.estateConfigService.deleteStreet(user.id, streetId)
  }

  @Post('heavy-vehicle-categories')
  @ApiOperation({ summary: 'Create heavy vehicle category' })
  createHeavyVehicleCategory(
    @CurrentUser() user: any,
    @Body() dto: CreateHeavyVehicleCategoryDto,
  ) {
    return this.estateConfigService.createHeavyVehicleCategory(user.id, dto)
  }

  @Get('heavy-vehicle-categories')
  @ApiOperation({ summary: 'Get heavy vehicle categories' })
  getHeavyVehicleCategories(@CurrentUser() user: any) {
    return this.estateConfigService.getHeavyVehicleCategories(user.id)
  }

  @Patch('heavy-vehicle-categories/:categoryId')
  @ApiOperation({ summary: 'Update heavy vehicle category' })
  updateHeavyVehicleCategory(
    @CurrentUser() user: any,
    @Param('categoryId') categoryId: string,
    @Body() dto: UpdateHeavyVehicleCategoryDto,
  ) {
    return this.estateConfigService.updateHeavyVehicleCategory(user.id, categoryId, dto)
  }

  @Delete('heavy-vehicle-categories/:categoryId')
  @ApiOperation({ summary: 'Delete heavy vehicle category' })
  deleteHeavyVehicleCategory(@CurrentUser() user: any, @Param('categoryId') categoryId: string) {
    return this.estateConfigService.deleteHeavyVehicleCategory(user.id, categoryId)
  }
}

@ApiTags('Resident Estate Configuration')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('resident/estate')
export class EstateConfigController {
  constructor(private readonly estateConfigService: EstateConfigService) { }

  @Get('streets')
  @ApiOperation({ summary: 'Get estate streets for resident' })
  @SkipLevyCheck()
  getResidentStreets(@CurrentUser() user: any) {
    return this.estateConfigService.getResidentStreets(user.id)
  }
}
