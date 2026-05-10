// import {
//   Controller,
//   Get,
//   UseGuards,
// } from '@nestjs/common'

// import {
//   ApiBearerAuth,
//   ApiOperation,
//   ApiTags,
// } from '@nestjs/swagger'

// import { Role } from '@prisma/client'

// import { GuardService } from './guard.service'

// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

// import { RolesGuard } from '../auth/guards/roles.guard'

// import { Roles } from '../auth/decorators/roles.decorator'

// import { CurrentUser } from '../auth/decorators/current-user.decorator'

// @ApiTags('Guard Operations')

// @ApiBearerAuth()

// @UseGuards(
//   JwtAuthGuard,
//   RolesGuard,
// )

// @Controller('guards')
// export class GuardController {
//   constructor(
//     private readonly guardService: GuardService,
//   ) {}

//   /*
// |--------------------------------------------------------------------------
// | DASHBOARD
// |--------------------------------------------------------------------------
// */

//   @Get('dashboard')

//   @Roles(
//     Role.GUARD,
//     Role.ADMIN,
//   )

//   @ApiOperation({
//     summary:
//       'Get guard dashboard',
//   })
//   async getDashboard(
//     @CurrentUser()
//     user: any,
//   ) {
//     return this.guardService.getDashboard(
//       user.id,
//     )
//   }

//   /*
// |--------------------------------------------------------------------------
// | ACTIVITY FEED
// |--------------------------------------------------------------------------
// */

//   @Get('activity-feed')

//   @Roles(
//     Role.GUARD,
//     Role.ADMIN,
//   )

//   @ApiOperation({
//     summary:
//       'Get gate activity feed',
//   })
//   async getActivityFeed(
//     @CurrentUser()
//     user: any,
//   ) {
//     return this.guardService.getActivityFeed(
//       user.id,
//     )
//   }
// }

// guards.controller.ts

import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common'

import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'

import { Role } from '@prisma/client'

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

import { RolesGuard } from '../auth/guards/roles.guard'

import { Roles } from '../auth/decorators/roles.decorator'

import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { GuardService } from './guard.service'

@ApiTags('Guards')
@ApiBearerAuth()

@UseGuards(
  JwtAuthGuard,
  RolesGuard,
)

@Controller()
export class GuardController {
  constructor(
    private readonly guardsService: GuardService,
  ) {}

  /*
|--------------------------------------------------------------------------
| ADMIN ROUTES
|--------------------------------------------------------------------------
*/

  @Post('admin/guards')
  @Roles(Role.ADMIN)

  @HttpCode(HttpStatus.OK)

  @ApiOperation({
    summary: 'Create guard',
  })
  async createGuard(
    @CurrentUser() user: any,

    @Body()
    dto: any,
  ) {
    return this.guardsService.createGuard(
      user.id,
      dto,
    )
  }

  @Get('admin/guards')
  @Roles(Role.ADMIN)

  @ApiOperation({
    summary: 'Get guards',
  })
  async getGuards(
    @CurrentUser() user: any,
  ) {
    return this.guardsService.getGuards(
      user.id,
    )
  }

  @Get('admin/guards/:guardId')
  @Roles(Role.ADMIN)

  @ApiOperation({
    summary: 'Get guard by ID',
  })
  async getGuardById(
    @CurrentUser() user: any,

    @Param('guardId')
    guardId: string,
  ) {
    return this.guardsService.getGuardById(
      user.id,
      guardId,
    )
  }

  @Patch(
    'admin/guards/:guardId/suspend',
  )
  @Roles(Role.ADMIN)

  @HttpCode(HttpStatus.OK)

  @ApiOperation({
    summary: 'Suspend guard',
  })
  async suspendGuard(
    @CurrentUser() user: any,

    @Param('guardId')
    guardId: string,
  ) {
    return this.guardsService.suspendGuard(
      user.id,
      guardId,
    )
  }

  @Patch(
    'admin/guards/:guardId/activate',
  )
  @Roles(Role.ADMIN)

  @HttpCode(HttpStatus.OK)

  @ApiOperation({
    summary: 'Activate guard',
  })
  async activateGuard(
    @CurrentUser() user: any,

    @Param('guardId')
    guardId: string,
  ) {
    return this.guardsService.activateGuard(
      user.id,
      guardId,
    )
  }

  /*
|--------------------------------------------------------------------------
| GUARD ROUTES
|--------------------------------------------------------------------------
*/

  @Get('guards/dashboard')
  @Roles(
    Role.GUARD,
    Role.ADMIN,
  )

  @ApiOperation({
    summary: 'Guard dashboard',
  })
  async getDashboard(
    @CurrentUser() user: any,
  ) {
    return this.guardsService.getDashboard(
      user.id,
    )
  }

  @Get('guards/activity-feed')
  @Roles(
    Role.GUARD,
    Role.ADMIN,
  )

  @ApiOperation({
    summary: 'Activity feed',
  })
  async getActivityFeed(
    @CurrentUser() user: any,
  ) {
    return this.guardsService.getActivityFeed(
      user.id,
    )
  }
}