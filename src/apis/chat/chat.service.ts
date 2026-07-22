import { Injectable } from '@nestjs/common'
import { ChatRoom, ChatRoomType, Role, User } from '@prisma/client'
import { error, success } from '../../common/utils/response.util'
import { PrismaService } from '../../database/prisma/prisma.service'
import { ChatGateway } from './chat.gateway'
import { BroadcastMessageDto, SendMessageDto } from './dto/chat.dto'

type ChatUser = User & {
  resident?: {
    id: string
    streetId: string | null
  } | null
}

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly chatGateway: ChatGateway,
  ) {}

  private isAdmin(user: Pick<User, 'role'>) {
    return user.role === Role.ADMIN || user.role === Role.SUPER_ADMIN
  }

  private isSecurityUser(user: Pick<User, 'role'>) {
    return (
      user.role === Role.GUARD ||
      user.role === Role.SUPER_GUARD ||
      this.isAdmin(user)
    )
  }

  private async getUser(userId: string): Promise<ChatUser> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        resident: {
          select: {
            id: true,
            streetId: true,
          },
        },
      },
    })

    if (!user) {
      error('Not Found', 'User not found', 404)
    }

    return user!
  }

  private async ensureEstateRoom(
    estateId: string,
    type: ChatRoomType,
    name: string,
  ) {
    const existing = await this.prisma.chatRoom.findFirst({
      where: {
        estateId,
        type,
        streetId: null,
      },
    })

    if (existing) {
      return existing
    }

    return this.prisma.chatRoom.create({
      data: {
        estateId,
        type,
        name,
      },
    })
  }

  private async ensureStreetRoom(estateId: string, streetId: string) {
    const street = await this.prisma.estateStreet.findFirst({
      where: {
        id: streetId,
        estateId,
      },
    })

    if (!street) {
      return null
    }

    const existing = await this.prisma.chatRoom.findFirst({
      where: {
        estateId,
        type: ChatRoomType.STREET,
        streetId: street.id,
      },
    })

    if (existing) {
      return existing
    }

    return this.prisma.chatRoom.create({
      data: {
        estateId,
        streetId: street.id,
        type: ChatRoomType.STREET,
        name: `${street.name} Street`,
      },
    })
  }

  private async ensureDefaultRooms(estateId: string) {
    await Promise.all([
      this.ensureEstateRoom(estateId, ChatRoomType.BROADCAST, 'Estate Broadcast'),
      this.ensureEstateRoom(estateId, ChatRoomType.SECURITY, 'Estate Security'),
      this.ensureEstateRoom(estateId, ChatRoomType.ADMIN_ONLY, 'Estate Admins'),
    ])
  }

  private canAccessRoom(user: ChatUser, room: ChatRoom) {
    if (room.estateId !== user.estateId) {
      return false
    }

    if (this.isAdmin(user)) {
      return true
    }

    if (room.type === ChatRoomType.BROADCAST) {
      return true
    }

    if (room.type === ChatRoomType.STREET) {
      return user.role === Role.RESIDENT && room.streetId === user.resident?.streetId
    }

    if (room.type === ChatRoomType.SECURITY) {
      return this.isSecurityUser(user)
    }

    if (room.type === ChatRoomType.ADMIN_ONLY) {
      return false
    }

    return false
  }

  async getRooms(userId: string) {
    const user = await this.getUser(userId)
    await this.ensureDefaultRooms(user.estateId)

    if (this.isAdmin(user)) {
      const streets = await this.prisma.estateStreet.findMany({
        where: { estateId: user.estateId },
        select: { id: true },
      })

      await Promise.all(
        streets.map((street) => this.ensureStreetRoom(user.estateId, street.id)),
      )

      const rooms = await this.prisma.chatRoom.findMany({
        where: { estateId: user.estateId },
        include: { street: true },
        orderBy: { createdAt: 'asc' },
      })

      return success(rooms, 'Rooms', 'Rooms fetched successfully')
    }

    if (this.isSecurityUser(user)) {
      const rooms = await this.prisma.chatRoom.findMany({
        where: {
          estateId: user.estateId,
          type: { in: [ChatRoomType.BROADCAST, ChatRoomType.SECURITY] },
        },
        include: { street: true },
        orderBy: { createdAt: 'asc' },
      })

      return success(rooms, 'Rooms', 'Rooms fetched successfully')
    }

    if (user.role === Role.RESIDENT && user.resident?.streetId) {
      await this.ensureStreetRoom(user.estateId, user.resident.streetId)
    }

    const rooms = await this.prisma.chatRoom.findMany({
      where: {
        estateId: user.estateId,
        OR: [
          { type: ChatRoomType.BROADCAST },
          ...(user.resident?.streetId
            ? [
                {
                  type: ChatRoomType.STREET,
                  streetId: user.resident.streetId,
                },
              ]
            : []),
        ],
      },
      include: { street: true },
      orderBy: { createdAt: 'asc' },
    })

    return success(rooms, 'Rooms', 'Rooms fetched successfully')
  }

  async getMessages(userId: string, roomId: string) {
    const user = await this.getUser(userId)
    const room = await this.prisma.chatRoom.findUnique({
      where: { id: roomId },
    })

    if (!room) {
      return error('Not Found', 'Room not found', 404)
    }

    if (!this.canAccessRoom(user, room)) {
      return error('Forbidden', 'Access denied', 403)
    }

    const messages = await this.prisma.chatMessage.findMany({
      where: { roomId },
      include: {
        sender: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    })

    return success(messages, 'Messages', 'Messages fetched successfully')
  }

  async sendMessage(userId: string, roomId: string, dto: SendMessageDto) {
    const user = await this.getUser(userId)
    const room = await this.prisma.chatRoom.findUnique({
      where: { id: roomId },
    })

    if (!room) {
      return error('Not Found', 'Room not found', 404)
    }

    if (!this.canAccessRoom(user, room)) {
      return error('Forbidden', 'Access denied', 403)
    }

    if (room.type === ChatRoomType.BROADCAST && !this.isAdmin(user)) {
      return error('Forbidden', 'Only admins can send broadcast messages', 403)
    }

    const messageText = dto.message.trim()

    if (!messageText) {
      return error('Validation Error', 'Message cannot be empty', 400)
    }

    const message = await this.prisma.chatMessage.create({
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

    this.chatGateway.emitMessage(roomId, message)

    return success(message, 'Message Sent', 'Message sent successfully')
  }

  async broadcastMessage(userId: string, dto: BroadcastMessageDto) {
    const user = await this.getUser(userId)

    if (!this.isAdmin(user)) {
      return error('Forbidden', 'Only admins can send broadcast messages', 403)
    }

    const room = await this.ensureEstateRoom(
      user.estateId,
      ChatRoomType.BROADCAST,
      'Estate Broadcast',
    )

    return this.sendMessage(userId, room.id, dto)
  }

  async getRoom(userId: string, roomId: string) {
    const user = await this.getUser(userId)
    const room = await this.prisma.chatRoom.findUnique({
      where: { id: roomId },
      include: { street: true },
    })

    if (!room) {
      return error('Not Found', 'Room not found', 404)
    }

    if (!this.canAccessRoom(user, room)) {
      return error('Forbidden', 'Access denied', 403)
    }

    return success(room, 'Room', 'Room fetched successfully')
  }
}
