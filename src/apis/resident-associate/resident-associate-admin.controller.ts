import {
    Body,
    Controller,
    Get,
    Patch,
    UseGuards,
} from '@nestjs/common';

import {
    ApiBearerAuth,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';

import { Role } from '@prisma/client';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

import { ResidentAssociateAdminService } from './resident-associate-admin.service';
import { ApproveResidentAssociatesDto } from './dto/approval-resident-associate.dto';
import { RejectResidentAssociatesDto } from './dto/reject-resident-associate.dto';

@ApiTags('Resident Associate Administration')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.SUPER_ADMIN)
@Controller('admin/resident-associates')
export class ResidentAssociateAdminController {
    constructor(
        private readonly adminService:
            ResidentAssociateAdminService,
    ) {}

    @Get('pending')
    @ApiOperation({
        summary: 'Get pending co-resident applications',
    })
    findPending() {
        return this.adminService.findPending();
    }

    @Patch('approve')
    @ApiOperation({
        summary:
            'Approve one or more co-resident applications',
    })
    approve(
        @CurrentUser() user: any,
        @Body() dto: ApproveResidentAssociatesDto,
    ) {
        return this.adminService.approve(
            dto.associateIds,
            user.id,
        );
    }

    @Patch('reject')
    @ApiOperation({
        summary:
            'Reject one or more co-resident applications',
    })
    reject(
        @CurrentUser() user: any,
        @Body() dto: RejectResidentAssociatesDto,
    ) {
        return this.adminService.reject(
            dto.associateIds,
            user.id,
            dto.rejectionReason,
        );
    }
}