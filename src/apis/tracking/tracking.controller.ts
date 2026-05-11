// import {
//     Controller,
//     Post,
//     Param,
//     UseGuards,
//     Body,
//     Get,
// } from '@nestjs/common'

// import { TrackingService } from './tracking.service'
// import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
// import { RolesGuard } from '../auth/guards/roles.guard'
// import { UpdateLocationDto } from './dto/location.dto'

// @ApiTags('Tracking Management')

// @Controller('tracking')
// export class TrackingController {
//     constructor(
//         private readonly trackingService: TrackingService,
//     ) { }

//     @Post('start/:visitorId')
//     @ApiOperation({
//         summary:
//             'Track visitor movement in the estate',
//     })
//     async startTracking(
//         @Param('visitorId')
//         visitorId: string,
//     ) {
//         return this.trackingService.startTracking(
//             visitorId,
//         )
//     }

//     @Post('location')
//     @ApiOperation({
//         summary:
//             'Update visitor location in the estate',
//     })
//     async updateLocation(
//         @Body()
//         dto: UpdateLocationDto,
//     ) {
//         return this.trackingService.updateLocation(
//             dto,
//         )
//     }

//     @Get('live')
//     @ApiOperation({
//         summary:
//             'Live tracking of visitor movement in the estate',
//     })
//     async getLiveTracking() {
//         return this.trackingService.getLiveTracking()
//     }

//     @Post('stop/:sessionId')
//     @ApiOperation({
//         summary:
//             'Stop visitor movement tracking',
//     })
//     async stopTracking(
//         @Param('sessionId')
//         sessionId: string,
//     ) {
//         return this.trackingService.stopTracking(
//             sessionId,
//         )
//     }
// }

import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common'

import {
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'

import { TrackingService } from './tracking.service'

import { UpdateLocationDto } from './dto/location.dto'

@ApiTags('Tracking Management')

@Controller('tracking')
export class TrackingController {
  constructor(
    private readonly trackingService: TrackingService,
  ) {}

  @Post('start/:visitorId')
  @ApiOperation({
    summary:
      'Start visitor movement tracking',
  })
  async startTracking(
    @Param('visitorId')
    visitorId: string,
  ) {
    return this.trackingService.startTracking(
      visitorId,
    )
  }

  @Get('validate/:token')
  @ApiOperation({
    summary:
      'Validate visitor tracking token',
  })
  async validateToken(
    @Param('token')
    token: string,
  ) {
    return this.trackingService.validateTrackingToken(
      token,
    )
  }

  @Post('location')
  @ApiOperation({
    summary:
      'Update visitor location',
  })
  async updateLocation(
    @Body()
    dto: UpdateLocationDto,
  ) {
    return this.trackingService.updateLocation(
      dto,
    )
  }

  @Get('live')
  @ApiOperation({
    summary:
      'Get live visitor tracking',
  })
  async getLiveTracking() {
    return this.trackingService.getLiveTracking()
  }

  @Post('stop/:sessionId')
  @ApiOperation({
    summary:
      'Stop visitor tracking',
  })
  async stopTracking(
    @Param('sessionId')
    sessionId: string,
  ) {
    return this.trackingService.stopTracking(
      sessionId,
    )
  }
  @Post(':sessionId/history')
  @ApiOperation({
    summary:
      'Get tracking history',
  })
  async getTrackingHistory(
    @Param('sessionId')
    sessionId: string,
  ) {
    return this.trackingService.getTrackingHistory(
      sessionId,
    )
  }
}