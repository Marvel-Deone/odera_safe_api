import {
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common'

import { GuardLocationService } from './guard-location.service'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { CreateGuardLocationDto } from './dto/guard-location.dto'



@Controller('guard-locations')
export class GuardLocationController {
  constructor(
    private readonly guardLocationService: GuardLocationService,
  ) {}

  @Post()
  async createLocation(
    @CurrentUser() user: any,

    @Body()
    dto: CreateGuardLocationDto,
  ) {
    return this.guardLocationService.createLocation(
      user.id,
      dto,
    )
  }

  @Get('live')
  async getLiveLocations(
    @CurrentUser() user: any,
  ) {
    return this.guardLocationService.getLiveLocations(
      user.id,
    )
  }
}