import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Role } from '@prisma/client'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { Roles } from '../auth/decorators/roles.decorator'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import {
  CreateResidentAssociateDto,
  UpdateResidentAssociateDto,
} from './dto/resident-associate.dto'
import { ResidentAssociateService } from './resident-associate.service'

@ApiTags('Resident Associates')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.RESIDENT)
@Controller('resident-associates')
export class ResidentAssociateController {
  constructor(private readonly residentAssociateService: ResidentAssociateService) {}

  @Post()
  @ApiOperation({ summary: 'Create staff or co-resident profile' })
  create(@CurrentUser() user: any, @Body() dto: CreateResidentAssociateDto) {
    return this.residentAssociateService.create(user.id, dto)
  }

  @Get()
  @ApiOperation({ summary: 'Get resident staff and co-residents' })
  findMine(@CurrentUser() user: any) {
    return this.residentAssociateService.findMine(user.id)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update staff or co-resident profile' })
  update(
    @CurrentUser() user: any,
    @Param('id') associateId: string,
    @Body() dto: UpdateResidentAssociateDto,
  ) {
    return this.residentAssociateService.update(user.id, associateId, dto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete staff or co-resident profile' })
  remove(@CurrentUser() user: any, @Param('id') associateId: string) {
    return this.residentAssociateService.remove(user.id, associateId)
  }
}
