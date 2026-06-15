import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common'

import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'

import { CommitteeService } from './committee.service'

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'

import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { Roles } from '../auth/decorators/roles.decorator'

import { Role } from '@prisma/client'
import { CreateCommitteeDto } from './dto/committee.dto'


@ApiTags('Committees')
@ApiBearerAuth()

@UseGuards(
  JwtAuthGuard,
  RolesGuard,
)
@Controller('committees')
export class CommitteeController {
  constructor(
    private readonly committeeService: CommitteeService,
  ) {}

  @Get()
  @ApiOperation({
    summary:
      'Get all committees',
  })
  getCommittees(
    @CurrentUser()
    user: any,
  ) {
    return this.committeeService.getCommittees(
      user.id,
    )
  }

  @Post()
  @Roles(
    Role.ADMIN,
    Role.SUPER_ADMIN,
  )
  @ApiOperation({
    summary:
      'Create committee',
  })
  createCommittee(
    @CurrentUser()
    user: any,

    @Body()
    dto: CreateCommitteeDto,
  ) {
    return this.committeeService.createCommittee(
      user.id,
      dto,
    )
  }

  @Post(':committeeId/join')
  @ApiOperation({
    summary:
      'Join committee',
  })
  joinCommittee(
    @CurrentUser()
    user: any,

    @Param(
      'committeeId',
    )
    committeeId: string,
  ) {
    return this.committeeService.joinCommittee(
      user.id,
      committeeId,
    )
  }

  @Delete(':committeeId/leave')
  @ApiOperation({
    summary:
      'Leave committee',
  })
  leaveCommittee(
    @CurrentUser()
    user: any,

    @Param(
      'committeeId',
    )
    committeeId: string,
  ) {
    return this.committeeService.leaveCommittee(
      user.id,
      committeeId,
    )
  }

  @Delete(':committeeId')
  @Roles(
    Role.ADMIN,
    Role.SUPER_ADMIN,
  )
  @ApiOperation({
    summary:
      'Delete committee',
  })
  deleteCommittee(
    @Param(
      'committeeId',
    )
    committeeId: string,
  ) {
    return this.committeeService.deleteCommittee(
      committeeId,
    )
  }
}