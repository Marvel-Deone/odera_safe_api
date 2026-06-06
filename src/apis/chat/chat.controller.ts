import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common"
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { RolesGuard } from "../auth/guards/roles.guard"
import { ChatService } from "./chat.service"
import { CurrentUser } from "../auth/decorators/current-user.decorator"
import { BroadcastMessageDto, SendMessageDto } from "./dto/chat.dto"
import { Roles } from "../auth/decorators/roles.decorator"
import { Role } from "@prisma/client"

@ApiTags('Chat')
@ApiBearerAuth()

@UseGuards(
    JwtAuthGuard,
    RolesGuard,
)
@Controller('chat')
export class ChatController {
    constructor(
        private readonly chatService: ChatService,
    ) { }

    @Get('rooms')
    @ApiOperation({
        summary: 'Get all chat rooms',
    })
    getRooms(
        @CurrentUser() user: any,
    ) {
        return this.chatService.getRooms(
            user.id,
        )
    }

    @Get('rooms/:roomId/messages')
    @ApiOperation({
        summary: 'Get all messages in a chat room',
    })
    getMessages(
        @CurrentUser() user: any,

        @Param('roomId')
        roomId: string,
    ) {
        return this.chatService.getMessages(
            user.id,
            roomId,
        )
    }

    @Post('rooms/:roomId/messages')
    @ApiOperation({
        summary: 'Send a message to a chat room',
    })
    sendMessage(
        @CurrentUser() user: any,

        @Param('roomId')
        roomId: string,

        @Body()
        dto: SendMessageDto,
    ) {
        return this.chatService.sendMessage(
            user.id,
            roomId,
            dto,
        )
    }

    @Post('broadcast')
    @Roles(
        Role.ADMIN,
        Role.SUPER_ADMIN,
    )
    @ApiOperation({
        summary: 'Broadcast message to all users',
    })
    broadcastMessage(
        @CurrentUser() user: any,

        @Body()
        dto: BroadcastMessageDto,
    ) {
        return this.chatService.broadcastMessage(
            user.id,
            dto,
        )
    }

    @Get('rooms/:roomId')
    getRoom(
        @Param('roomId')
        roomId: string,
    ) {
        return this.chatService.getRoom(
            roomId,
        )
    }
}