import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { error, success } from '../../common/utils/response.util';
import { CreateAnnouncementDto, CreateCommentDto } from './announcement.dto';

@Injectable()
export class AnnouncementService {
    constructor(private readonly prisma: PrismaService,) { }

    async createAnnouncement(userId: string, dto: CreateAnnouncementDto) {
        const user =
            await this.prisma.user.findUnique({
                where: { id: userId },
            })

        if (!user) {
            return error(
                'Not Found',
                'User not found',
                HttpStatus.NOT_FOUND,
            )
        }

        const announcement =
            await this.prisma.announcement.create({
                data: {
                    estateId: user.estateId,
                    authorId: user.id,
                    title: dto.title,
                    body: dto.body,
                    category: dto.category,
                    audience: dto.audience,
                    isPinned: dto.isPinned ?? false,
                    sendSms: dto.sendSms ?? false,
                },

                include: {
                    author: {
                        select: {
                            id: true,
                            email: true,
                            role: true,
                        },
                    },
                },
            })

        return success(
            announcement,
            'Announcement Created',
            'Announcement created successfully',
        )
    }

    async getAnnouncements(userId: string) {
        const user =
            await this.prisma.user.findUnique({
                where: { id: userId },
            })

        if (!user) {
            return error(
                'Not Found',
                'User not found',
                HttpStatus.NOT_FOUND,
            )
        }

        const announcements =
            await this.prisma.announcement.findMany({
                where: {
                    estateId: user.estateId,
                },

                include: {
                    author: {
                        select: {
                            id: true,
                            email: true,
                            role: true,
                        },
                    },
                },

                orderBy: [
                    {
                        isPinned: 'desc',
                    },
                    {
                        createdAt: 'desc',
                    },
                ],
            })

        return success(
            announcements,
            'Announcements',
            'Announcements fetched successfully',
        )
    }

    async getAnnouncementById(userId: string, id: string) {
        const user =
            await this.prisma.user.findUnique({
                where: { id: userId },
            })

        if (!user) {
            return error(
                'Not Found',
                'User not found',
                HttpStatus.NOT_FOUND,
            )
        }

        const announcement =
            await this.prisma.announcement.findFirst({
                where: {
                    id,
                    estateId: user.estateId,
                },

                include: {
                    author: true,

                    comments: {
                        include: {
                            user: true,
                        },

                        orderBy: {
                            createdAt: 'desc',
                        },
                    },
                },
            })

        if (!announcement) {
            return error(
                'Not Found',
                'Announcement not found',
                HttpStatus.NOT_FOUND,
            )
        }

        return success(
            announcement,
            'Announcement',
            'Announcement fetched successfully',
        )
    }

    async toggleLike(userId: string, announcementId: string) {
        const existing =
            await this.prisma.announcementLike.findUnique({
                where: {
                    announcementId_userId: {
                        announcementId,
                        userId,
                    },
                },
            })

        if (existing) {
            await this.prisma.announcementLike.delete({
                where: {
                    id: existing.id,
                },
            })

            await this.prisma.announcement.update({
                where: {
                    id: announcementId,
                },

                data: {
                    likesCount: {
                        decrement: 1,
                    },
                },
            })

            return success(
                null,
                'Unliked',
                'Announcement unliked',
            )
        }

        await this.prisma.announcementLike.create({
            data: {
                announcementId,
                userId,
            },
        })

        await this.prisma.announcement.update({
            where: {
                id: announcementId,
            },

            data: {
                likesCount: {
                    increment: 1,
                },
            },
        })

        return success(
            null,
            'Liked',
            'Announcement liked',
        )
    }

    async addComment(userId: string, announcementId: string, dto: CreateCommentDto) {
        const comment =
            await this.prisma.announcementComment.create({
                data: {
                    announcementId,
                    userId,
                    comment: dto.comment,
                },

                include: {
                    user: true,
                },
            })

        await this.prisma.announcement.update({
            where: {
                id: announcementId,
            },

            data: {
                commentsCount: {
                    increment: 1,
                },
            },
        })

        return success(
            comment,
            'Comment Added',
            'Comment added successfully',
        )
    }

    async getComments(announcementId: string) {
        const comments =
            await this.prisma.announcementComment.findMany({
                where: {
                    announcementId,
                },

                include: {
                    user: true,
                },

                orderBy: {
                    createdAt: 'desc',
                },
            })

        return success(
            comments,
            'Comments',
            'Comments fetched successfully',
        )
    }

    async pinAnnouncement(userId: string, id: string ) {
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
                HttpStatus.NOT_FOUND,
            )
        }

        const existing =
            await this.prisma.announcement.findFirst({
                where: {
                    id,
                    estateId: user.estateId,
                },
            })

        if (!existing) {
            return error(
                'Not Found',
                'Announcement not found',
                HttpStatus.NOT_FOUND,
            )
        }

        const announcement =
            await this.prisma.announcement.update({
                where: {
                    id,
                },

                data: {
                    isPinned: !existing.isPinned,
                },
            })

        return success(
            announcement,
            announcement.isPinned
                ? 'Pinned'
                : 'Unpinned',
            announcement.isPinned
                ? 'Announcement pinned successfully'
                : 'Announcement unpinned successfully',
        )
    }

    async deleteAnnouncement(userId: string, id: string) {
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
                HttpStatus.NOT_FOUND,
            )
        }

        const announcement =
            await this.prisma.announcement.findFirst({
                where: {
                    id,
                    estateId: user.estateId,
                },
            })

        if (!announcement) {
            return error(
                'Not Found',
                'Announcement not found',
                HttpStatus.NOT_FOUND,
            )
        }

        await this.prisma.$transaction([
            this.prisma.announcementLike.deleteMany({
                where: {
                    announcementId: id,
                },
            }),

            this.prisma.announcementComment.deleteMany({
                where: {
                    announcementId: id,
                },
            }),

            this.prisma.announcement.delete({
                where: {
                    id,
                },
            }),
        ])

        return success(
            null,
            'Deleted',
            'Announcement deleted successfully',
        )
    }
}
