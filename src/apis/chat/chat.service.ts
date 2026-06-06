import { Injectable } from "@nestjs/common"
import { PrismaService } from "../../database/prisma/prisma.service"
import { ChatGateway } from "./chat.gateway"
import { BroadcastMessageDto, SendMessageDto } from "./dto/chat.dto"
import { error, success } from "../../common/utils/response.util"
import { Role } from "@prisma/client"

@Injectable()
export class ChatService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly chatGateway: ChatGateway,
    ) { }
    async getRooms(userId: string) {
        const user =
            await this.prisma.user.findUnique({
                where: {
                    id: userId,
                },

                include: {
                    resident: true,
                },
            })

        if (
            user?.role === Role.ADMIN ||
            user?.role === Role.SUPER_ADMIN
        ) {
            return success(
                await this.prisma.chatRoom.findMany({
                    where: {
                        estateId: user.estateId,
                    },
                }),
                'Rooms',
                'Rooms fetched successfully',
            )
        }

        const rooms =
            await this.prisma.chatRoom.findMany({
                where: {
                    estateId: user?.estateId,

                    OR: [
                        {
                            type: 'BROADCAST',
                        },
                        {
                            block:
                                user?.resident?.block,
                        },
                    ],
                },
            })

        return success(
            rooms,
            'Rooms',
            'Rooms fetched successfully',
        )
    }

    async getMessages(userId: string, roomId: string) {
        const user =
            await this.prisma.user.findUnique({
                where: { id: userId },

                include: {
                    resident: true,
                },
            })

        if (!user) {
            return error(
                'Not Found',
                'User not found',
                404,
            )
        }

        const room =
            await this.prisma.chatRoom.findUnique({
                where: {
                    id: roomId,
                },
            })

        if (!room) {
            return error(
                'Not Found',
                'Room not found',
                404,
            )
        }

        const isAdmin =
            user?.role === Role.ADMIN ||
            user?.role === Role.SUPER_ADMIN

        if (!isAdmin) {
            const userBlock = user?.resident?.block

            const hasAccess =
                room.type === 'BROADCAST' ||
                room.block === userBlock

            if (!hasAccess) {
                return error(
                    'Forbidden',
                    'Access denied',
                    403,
                )
            }
        }

        const messages =
            await this.prisma.chatMessage.findMany({
                where: {
                    roomId,
                },

                include: {
                    sender: {
                        select: {
                            id: true,
                            email: true,
                            role: true,
                        },
                    },
                },

                orderBy: {
                    createdAt: 'asc',
                },
            })

        return success(
            messages,
            'Messages',
            'Messages fetched successfully',
        )
    }

    async sendMessage(userId: string, roomId: string, dto: SendMessageDto) {
        const user =
            await this.prisma.user.findUnique({
                where: { id: userId },

                include: {
                    resident: true,
                },
            })

        if (!user) {
            return error(
                'Not Found',
                'User not found',
                404,
            )
        }

        const room =
            await this.prisma.chatRoom.findUnique({
                where: { id: roomId },
            })

        if (!room) {
            return error(
                'Not Found',
                'Room not found',
                404,
            )
        }

        if (room.estateId !== user.estateId) {
            return error(
                'Forbidden',
                'Access denied',
                403,
            )
        }

        const isAdmin =
            user?.role === Role.ADMIN ||
            user?.role === Role.SUPER_ADMIN

        if (!isAdmin) {
            const userBlock = user?.resident?.block

            const hasAccess =
                room.type === 'BROADCAST' ||
                room.block === userBlock

            if (!hasAccess) {
                return error(
                    'Forbidden',
                    'Access denied',
                    403,
                )
            }
        }

        const messageText =
            dto.message.trim()

        if (!messageText) {
            return error(
                'Validation Error',
                'Message cannot be empty',
                400,
            )
        }

        const message =
            await this.prisma.chatMessage.create({
                data: {
                    roomId,
                    senderId: userId,
                    message: messageText,
                },

                include: {
                    sender: {
                        select: {
                            id: true,
                            email: true,
                            role: true,
                        },
                    },
                },
            })

        this.chatGateway.emitMessage(
            roomId,
            message,
        )

        return success(
            message,
            'Message Sent',
            'Message sent successfully',
        )
    }

    async broadcastMessage(
        userId: string,
        dto: BroadcastMessageDto,
    ) {
        const user =
            await this.prisma.user.findUnique({
                where: {
                    id: userId,
                },
            })

        if (!user) {
            return error(
                'Not Found',
                'User not found',
                404,
            )
        }

        const room =
            await this.prisma.chatRoom.findFirst({
                where: {
                    estateId: user?.estateId,
                    type: 'BROADCAST',
                },
            })

        if (!room) {
            return error(
                'Not Found',
                'Broadcast room not found',
                404,
            )
        }

        const isAdmin =
            user?.role === Role.ADMIN ||
            user?.role === Role.SUPER_ADMIN

        if (
            room.type === 'BROADCAST' &&
            !isAdmin
        ) {
            return error(
                'Forbidden',
                'Only admins can send broadcast messages',
                403,
            )
        }

        return this.sendMessage(
            userId,
            room.id,
            dto,
        )
    }

    async getRoom(roomId: string) {
        const room =
            await this.prisma.chatRoom.findUnique({
                where: {
                    id: roomId,
                },
            })

        if (!room) {
            return error(
                'Not Found',
                'Room not found',
                404,
            )
        }

        return success(
            room,
            'Room',
            'Room fetched successfully',
        )
    }
}