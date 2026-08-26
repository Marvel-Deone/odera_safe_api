import {
    Body,
    Controller,
    Get,
    Param,
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
import { RejectResidentAssociateDto } from './dto/reject-resident-associate.dto';

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
        summary:
            'Get pending co-resident applications',
    })
    findPending() {
        return this.adminService.findPending();
    }

    @Patch(':id/approve')
    @ApiOperation({
        summary:
            'Approve a co-resident application',
    })
    approve(
        @CurrentUser() user: any,
        @Param('id') associateId: string,
    ) {
        return this.adminService.approve(
            associateId,
            user.id,
        );
    }

    @Patch(':id/reject')
    @ApiOperation({
        summary:
            'Reject a co-resident application',
    })
    reject(
        @CurrentUser() user: any,
        @Param('id') associateId: string,
        @Body() dto: RejectResidentAssociateDto,
        body: {
            rejectionReason?: string;
        },
    ) {
        return this.adminService.reject(
            associateId,
            user.id,
            body.rejectionReason,
        );
    }
}