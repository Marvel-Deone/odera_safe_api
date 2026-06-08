import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreatePollDto, VotePollDto } from './dto/poll.dto';
import { PollService } from './poll.service';

@ApiTags('Polls')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('polls')
export class PollController {
    constructor(private readonly pollService: PollService) { }
    @Post()
    @Roles(
        Role.ADMIN,
        Role.SUPER_ADMIN,
    )
    @ApiOperation({
        summary: 'Create poll',
    })
    createPoll(
        @CurrentUser() user: any,

        @Body()
        dto: CreatePollDto,
    ) {
        return this.pollService.createPoll(
            user.id,
            dto,
        )
    }

    @Get()
    @ApiOperation({
        summary:
            'Get all polls',
    })
    getPolls(
        @CurrentUser() user: any,
    ) {
        return this.pollService.getPolls(
            user.id,
        )
    }

    @Get(':pollId')
    @ApiOperation({
        summary:
            'Get poll details',
    })
    getPoll(
        @CurrentUser() user: any,

        @Param('pollId')
        pollId: string,
    ) {
        return this.pollService.getPoll(
            user.id,
            pollId,
        )
    }

    // @Get(':pollId/results')
    // @Roles(
    //     Role.ADMIN,
    //     Role.SUPER_ADMIN,
    // )
    // getPollResults(
    //     @Param('pollId')
    //     pollId: string,
    // ) {
    //     return this.pollService.getPollResults(
    //         pollId,
    //     )
    // }


    @Post(':pollId/vote')
    @ApiOperation({
        summary:
            'Vote on poll',
    })
    vote(
        @CurrentUser() user: any,

        @Param('pollId')
        pollId: string,

        @Body()
        dto: VotePollDto,
    ) {
        return this.pollService.vote(
            user.id,
            pollId,
            dto,
        )
    }

    @Patch(':pollId/close')
    @Roles(
        Role.ADMIN,
        Role.SUPER_ADMIN,
    )
    closePoll(
        @Param('pollId')
        pollId: string,
    ) {
        return this.pollService.closePoll(
            pollId,
        )
    }

    @Delete(':pollId')
    @Roles(
        Role.ADMIN,
        Role.SUPER_ADMIN,
    )
    deletePoll(
        @Param('pollId')
        pollId: string,
    ) {
        return this.pollService.deletePoll(
            pollId,
        )
    }
}
