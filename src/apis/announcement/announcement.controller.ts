import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common'

import {
    Role,
} from '@prisma/client'

import {
    ApiBearerAuth,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger'

import { AnnouncementService } from './announcement.service'

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'

import { Roles } from '../auth/decorators/roles.decorator'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { CreateAnnouncementDto, CreateCommentDto } from './announcement.dto'

@ApiTags('Announcements')
@ApiBearerAuth()

@UseGuards(
    JwtAuthGuard,
    RolesGuard,
)

@Controller('announcements')
export class AnnouncementController {
    constructor(
        private readonly announcementService: AnnouncementService,
    ) { }

    @Post()
    @Roles(
        Role.ADMIN,
        Role.SUPER_ADMIN,
        Role.SUPER_GUARD,
    )
    @ApiOperation({
        summary: 'Create announcement',
    })
    createAnnouncement(
        @CurrentUser() user: any,

        @Body()
        dto: CreateAnnouncementDto,
    ) {
        return this.announcementService.createAnnouncement(user.id, dto)
    }

    @Get()
    @Roles(
        Role.ADMIN,
        Role.SUPER_ADMIN,
        Role.RESIDENT,
        Role.GUARD,
        Role.SUPER_GUARD,
    )
    @ApiOperation({
        summary: 'Get announcement feed',
    })
    getAnnouncements(
        @CurrentUser() user: any,
    ) {
        return this.announcementService.getAnnouncements(user.id)
    }

    @Get(':id')
    @Roles(
        Role.ADMIN,
        Role.SUPER_ADMIN,
        Role.RESIDENT,
        Role.GUARD,
        Role.SUPER_GUARD,
    )
    @ApiOperation({
        summary: 'Get announcement details',
    })
    getAnnouncementById(
        @CurrentUser() user: any,

        @Param('id')
        id: string,
    ) {
        return this.announcementService.getAnnouncementById(user.id, id)
    }

    @Post(':id/like')
    @Roles(
        Role.ADMIN,
        Role.SUPER_ADMIN,
        Role.RESIDENT,
        Role.GUARD,
        Role.SUPER_GUARD,
    )
    @ApiOperation({
        summary: 'Like or unlike announcement',
    })
    toggleLike(
        @CurrentUser() user: any,

        @Param('id')
        id: string,
    ) {
        return this.announcementService.toggleLike(user.id, id)
    }

    @Post(':id/comments')
    @Roles(
        Role.ADMIN,
        Role.SUPER_ADMIN,
        Role.RESIDENT,
        Role.GUARD,
        Role.SUPER_GUARD,
    )
    @ApiOperation({
        summary: 'Add comment',
    })
    addComment(
        @CurrentUser() user: any,

        @Param('id')
        id: string,

        @Body()
        dto: CreateCommentDto,
    ) {
        return this.announcementService.addComment(user.id, id, dto)
    }

    @Get(':id/comments')
    @Roles(
        Role.ADMIN,
        Role.SUPER_ADMIN,
        Role.RESIDENT,
        Role.GUARD,
        Role.SUPER_GUARD,
    )
    @ApiOperation({
        summary: 'Get announcement comments',
    })
    getComments(
        @Param('id')
        id: string,
    ) {
        return this.announcementService.getComments(id)
    }

    @Patch(':id/pin')
    @Roles(
        Role.ADMIN,
        Role.SUPER_ADMIN,
        Role.SUPER_GUARD,
    )
    @ApiOperation({
        summary: 'Pin or unpin announcement',
    })
    pinAnnouncement(
        @CurrentUser() user: any,

        @Param('id')
        id: string,
    ) {
        return this.announcementService.pinAnnouncement(user.id, id)
    }

    @Delete(':id')
    @Roles(
        Role.ADMIN,
        Role.SUPER_ADMIN,
        Role.SUPER_GUARD,
    )
    @ApiOperation({
        summary: 'Delete announcement',
    })
    deleteAnnouncement(
        @CurrentUser() user: any,

        @Param('id')
        id: string,
    ) {
        return this.announcementService.deleteAnnouncement(user.id, id)
    }
}
