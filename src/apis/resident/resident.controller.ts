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
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { ResidentService } from './resident.service';

import {
  CreateResidentDto,
  CompleteResidentProfileDto,
  ReviewResidentKycDto,
  NinVerificationDto,
} from './dto/resident.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

import { Role } from '@prisma/client';
import { SkipLevyCheck } from '../auth/decorators/skip-levy-check.decorator';

@ApiTags('Residents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('residents')
export class ResidentController {
  constructor(private readonly residentService: ResidentService) {}

  // ADMIN - CREATE RESIDENT
  @Post()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Create resident',
  })
  @ApiBody({
    type: CreateResidentDto,
  })
  async onboardResident(@Body() dto: CreateResidentDto) {
    return this.residentService.onboardResident(dto);
  }

  @Post('verify-nin')
  @UseGuards(JwtAuthGuard)
  @SkipLevyCheck()
  @ApiOperation({
    summary: 'Verify NIN with face capture',
    description: "Verifies user's NIN and face capture through QoreID",
  })
  @ApiResponse({
    status: 200,
    description: 'NIN verification successful',
  })
  async verifyNinOnly(
    @CurrentUser() user: any,
    @Body() ninData: NinVerificationDto,
  ) {
    return await this.residentService.verifyNinOnly(user, ninData);
  }

  // RESIDENT - COMPLETE PROFILE/KYC
  @Patch('complete-profile')
  @Roles(Role.RESIDENT)
  @SkipLevyCheck()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Complete resident profile',
    description: 'Resident completes KYC/profile information after first login',
  })
  @ApiBody({
    type: CompleteResidentProfileDto,
  })
  async completeProfile(
    @CurrentUser() user: any,
    @Body() dto: CompleteResidentProfileDto,
  ) {
    return this.residentService.completeProfile(user.id, dto);
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
    return this.residentService.reviewResident(residentId, dto);
  }

  //  ADMIN - ALL RESIDENTS
  @Get()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Fetch all residents',
  })
  async getAllResidents() {
    return this.residentService.getAllResidents();
  }

  //  RESIDENT GATE CREDENTIALS
  @Get('gate-credentials/me')
  @Roles(Role.RESIDENT)
  @SkipLevyCheck()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get resident gate QR code and passcode',
  })
  async getGateCredentials(@CurrentUser() user: any) {
    return this.residentService.getGateCredentials(user.id);
  }

  //  RESIDENT DASHBOARD
  @Get('dashboard/me')
  @Roles(Role.RESIDENT)
  @SkipLevyCheck()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Resident dashboard',
  })
  async dashboard(@CurrentUser() user: any) {
    return this.residentService.getDashboard(user.id);
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
  async getResidentById(@Param('residentId') residentId: string) {
    return this.residentService.getResidentById(residentId);
  }
}
