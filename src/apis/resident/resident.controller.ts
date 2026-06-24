// import {
//   Body,
//   Controller,
//   Get,
//   HttpCode,
//   HttpStatus,
//   Param,
//   Patch,
//   Post,
//   UseGuards,
// } from '@nestjs/common'
// import {
//   ApiTags,
//   ApiOperation,
//   ApiResponse,
//   ApiBody,
//   ApiParam,
//   ApiBearerAuth,
// } from '@nestjs/swagger'
// import { ResidentService } from './resident.service'
// import { CreateResidentDto } from './dto/resident.dto'
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
// import { RolesGuard } from '../auth/guards/roles.guard'
// import { Roles } from '../auth/decorators/roles.decorator'
// import { Role } from '@prisma/client'
// import { CurrentUser } from '../auth/decorators/current-user.decorator'

// @ApiTags('Residents (Admin)')
// @ApiBearerAuth()
// @UseGuards(JwtAuthGuard, RolesGuard)
// @Controller('admin/residents')
// export class ResidentController {
//   constructor(private readonly residentService: ResidentService) { }

//   @Get()
//   @Roles(Role.ADMIN)
//   @HttpCode(HttpStatus.OK)
//   @ApiOperation({
//     summary: 'Fetch all residents',
//     description: 'Returns all residents in the estate',
//   })
//   @ApiResponse({
//     status: 200,
//     description: 'Residents fetched successfully',
//   })
//   async getAllResidents() {
//     return this.residentService.getAllResidents()
//   }

//   @Post()
//   @Roles(Role.ADMIN)
//   @HttpCode(HttpStatus.OK)
//   @ApiOperation({
//     summary: 'Onboard a new resident (KYC submission)',
//     description:
//       'Admin submits 4-step KYC form. Creates Resident in PENDING state. No user account is created yet.',
//   })
//   @ApiBody({
//     type: CreateResidentDto,
//     description: 'Resident onboarding payload (4-step KYC)',
//   })
//   @ApiResponse({
//     status: 200,
//     description: 'Resident created successfully (PENDING)',
//   })
//   @ApiResponse({
//     status: 400,
//     description: 'Validation or NDPR error',
//   })
//   @ApiResponse({
//     status: 404,
//     description: 'Estate not found',
//   })
//   async onboardResident(@Body() dto: CreateResidentDto) {
//     return this.residentService.onboardResident(dto)
//   }

//   @Get('dashboard')
//   @Roles(Role.RESIDENT)
//   @HttpCode(HttpStatus.OK)
//   @ApiOperation({
//     summary: 'Fetch resident dashboard analytics',
//     description: 'Returns resident analytics',
//   })
//   @ApiResponse({
//     status: 200,
//     description: 'Resident analytics fetched successfully',
//   })
//   async dashboard(
//     @CurrentUser() user: any,
//   ) {
//     return this.residentService.getDashboard(user.id,)
//   }

//   @Get(':residentId')
//   @HttpCode(HttpStatus.OK)
//   @ApiOperation({
//     summary: 'Fetch resident by ID',
//     description: 'Returns a single resident by ID',
//   })
//   @ApiParam({
//     name: 'residentId',
//     required: true,
//     example: 'a1b2c3d4-e5f6',
//   })
//   @ApiResponse({
//     status: 200,
//     description: 'Resident fetched successfully',
//   })
//   @ApiResponse({
//     status: 404,
//     description: 'Resident not found',
//   })
//   async getResidentById(
//     @Param('residentId') residentId: string,
//   ) {
//     return this.residentService.getResidentById(residentId)
//   }

//   @Patch(':residentId/review')
//   @Roles(Role.ADMIN)
//   @HttpCode(HttpStatus.OK)
//   @ApiOperation({
//     summary: 'Review resident KYC',
//     description:
//       'Admin approves or rejects a resident KYC submission. On approval, a user account is automatically created and linked.',
//   })
//   @ApiParam({
//     name: 'residentId',
//     required: true,
//     description: 'Resident ID',
//     example: 'f9c5a7c1-8e8d-4c93-9f67-2f3d1e3c1d90',
//   })
//   @ApiBody({
//     schema: {
//       type: 'object',
//       properties: {
//         action: {
//           type: 'string',
//           enum: ['approve', 'reject'],
//           example: 'approve',
//         },
//       },
//       required: ['action'],
//     },
//   })
//   @ApiResponse({
//     status: 200,
//     description:
//       'Resident approved/rejected successfully',
//   })
//   @ApiResponse({
//     status: 400,
//     description: 'Invalid action or resident already reviewed',
//   })
//   @ApiResponse({
//     status: 404,
//     description: 'Resident not found',
//   })
//   async reviewResident(
//     @Param('residentId') residentId: string,
//     @Body('action') action: 'approve' | 'reject',
//   ) {
//     return this.residentService.reviewResident(residentId, action)
//   }
// }

import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

import { ResidentService } from './resident.service'

import {
  CreateResidentDto,
  CompleteResidentProfileDto,
  ReviewResidentKycDto,
} from './dto/resident.dto'

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'

import { Roles } from '../auth/decorators/roles.decorator'
import { CurrentUser } from '../auth/decorators/current-user.decorator'

import { Role } from '@prisma/client'

@ApiTags('Residents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('residents')
export class ResidentController {
  constructor(
    private readonly residentService: ResidentService,
  ) { }

  //  ADMIN - CREATE RESIDENT
  @Post()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Create resident',
  })
  @ApiBody({
    type: CreateResidentDto,
  })
  async onboardResident(
    @Body() dto: CreateResidentDto,
  ) {
    return this.residentService.onboardResident(dto)
  }

  // RESIDENT - COMPLETE PROFILE/KYC
  @Patch('complete-profile')
  @Roles(Role.RESIDENT)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Complete resident profile',
    description:
      'Resident completes KYC/profile information after first login',
  })
  @ApiBody({
    type: CompleteResidentProfileDto,
  })
  async completeProfile(
    @CurrentUser() user: any,
    @Body() dto: CompleteResidentProfileDto,
  ) {
    return this.residentService.completeProfile(
      user.id,
      dto,
    )
  }

  // ADMIN - REVIEW KYC
  @Patch(':residentId/review')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Approve or reject resident KYC',
  })
  @ApiParam({
    name: 'residentId',
  })
  @ApiBody({
    type: ReviewResidentKycDto,
  })
  async reviewResident(
    @Param('residentId') residentId: string,
    @Body() dto: ReviewResidentKycDto,
  ) {
    return this.residentService.reviewResident(
      residentId,
      dto,
    )
  }

  //  ADMIN - ALL RESIDENTS
  @Get()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Fetch all residents',
  })
  async getAllResidents() {
    return this.residentService.getAllResidents()
  }

  // ADMIN - SINGLE RESIDENT
  @Get(':residentId')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Fetch resident by ID',
  })
  @ApiParam({
    name: 'residentId',
  })
  async getResidentById(
    @Param('residentId') residentId: string,
  ) {
    return this.residentService.getResidentById(
      residentId,
    )
  }

  //  RESIDENT DASHBOARD
  @Get('dashboard/me')
  @Roles(Role.RESIDENT)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Resident dashboard',
  })
  async dashboard(
    @CurrentUser() user: any,
  ) {
    return this.residentService.getDashboard(
      user.id,
    )
  }
}
