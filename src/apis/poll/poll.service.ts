import { Injectable } from '@nestjs/common';
import { CreatePollDto, VotePollDto } from './dto/poll.dto';
import { PrismaService } from '../../database/prisma/prisma.service';
import { error, success } from '../../common/utils/response.util';

@Injectable()
export class PollService {
    private mapPollResponse(
        poll: any,
        userId: string,
    ) {
        const userVote =
            poll.votes.find(
                (vote: any) =>
                    vote.userId === userId,
            )

        const totalVotes =
            poll.options.reduce(
                (
                    total: number,
                    option: any,
                ) =>
                    total +
                    option.votes.length,
                0,
            )

        return {
            id: poll.id,

            question:
                poll.question,

            audience:
                poll.audience,

            expiresAt:
                poll.expiresAt,

            isClosed:
                poll.isClosed,

            createdAt:
                poll.createdAt,

            totalVotes,

            hasVoted:
                !!userVote,

            selectedOptionId:
                userVote?.optionId ??
                null,

            options:
                poll.options.map(
                    (
                        option: any,
                    ) => ({
                        id: option.id,

                        text:
                            option.text,

                        voteCount:
                            option.votes
                                .length,

                        percentage:
                            totalVotes ===
                                0
                                ? 0
                                : Math.round(
                                    (
                                        option
                                            .votes
                                            .length /
                                        totalVotes
                                    ) *
                                    100,
                                ),
                    }),
                ),
        }
    }

    constructor(private readonly prisma: PrismaService) { }

    async createPoll(
        userId: string,
        dto: CreatePollDto,
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

        const poll =
            await this.prisma.poll.create({
                data: {
                    question:
                        dto.question,

                    audience:
                        dto.audience,

                    expiresAt: dto.expiresAt
                        ? new Date(dto.expiresAt)
                        : null,

                    estateId:
                        user.estateId,

                    createdById:
                        user.id,

                    options: {
                        create:
                            dto.options.map(
                                (option) => ({
                                    text: option,
                                }),
                            ),
                    },
                },

                include: {
                    options: true,
                },
            })

        return success(
            poll,
            'Poll Created',
            'Poll created successfully',
        )
    }

    async getPolls(
        userId: string,
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

        const polls =
            await this.prisma.poll.findMany({
                where: {
                    estateId:
                        user.estateId,
                },

                include: {
                    options: {
                        include: {
                            votes: true,
                        },
                    },

                    votes: true,
                },

                orderBy: {
                    createdAt: 'desc',
                },
            })

        return success(
            polls.map((poll) =>
                this.mapPollResponse(
                    poll,
                    userId,
                ),
            ),
            'Polls',
            'Polls fetched successfully',
        )
    }

    async vote(
        userId: string,
        pollId: string,
        dto: VotePollDto,
    ) {
        const user =
            await this.prisma.user.findUnique({
                where: {
                    id: userId,
                },

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

        const poll =
            await this.prisma.poll.findUnique({
                where: {
                    id: pollId,
                },

                include: {
                    options: true,
                },
            })

        if (!poll) {
            return error(
                'Not Found',
                'Poll not found',
                404,
            )
        }

        if (
            poll.audience ===
            'LEVY_CLEARED_ONLY'
        ) {
            if (
                !user.resident
                    ?.levyCleared
            ) {
                return error(
                    'Forbidden',
                    'Only levy-cleared residents can vote',
                    403,
                )
            }
        }

        if (poll.isClosed) {
            return error(
                'Closed',
                'Poll is closed',
                400,
            )
        }

        if (
            poll.expiresAt &&
            poll.expiresAt <
            new Date()
        ) {
            return error(
                'Expired',
                'Poll has expired',
                400,
            )
        }

        const existingVote =
            await this.prisma.pollVote.findUnique({
                where: {
                    pollId_userId: {
                        pollId,
                        userId,
                    },
                },
            })

        if (existingVote) {
            return error(
                'Conflict',
                'You have already voted',
                409,
            )
        }

        const option =
            poll.options.find(
                (option) =>
                    option.id ===
                    dto.optionId,
            )

        if (!option) {
            return error(
                'Not Found',
                'Option not found',
                404,
            )
        }

        const vote =
            await this.prisma.pollVote.create({
                data: {
                    pollId,
                    optionId:
                        dto.optionId,
                    userId,
                },
            })

        return success(
            vote,
            'Vote Submitted',
            'Vote submitted successfully',
        )
    }

    async getPoll(
        userId: string,
        pollId: string,
    ) {
        const poll =
            await this.prisma.poll.findUnique({
                where: {
                    id: pollId,
                },

                include: {
                    options: {
                        include: {
                            votes: true,
                        },
                    },

                    votes: true,
                },
            })

        if (!poll) {
            return error(
                'Not Found',
                'Poll not found',
                404,
            )
        }

        const userVote = poll.votes.find(
            vote =>
                vote.userId === userId,
        )

        return success(
            this.mapPollResponse(
                poll,
                userId,
            ),
            'Poll',
            'Poll fetched successfully',
        )
    }

    async closePoll(
        pollId: string,
    ) {
        const poll =
            await this.prisma.poll.findUnique({
                where: {
                    id: pollId,
                },
            })

        if (!poll) {
            return error(
                'Not Found',
                'Poll not found',
                404,
            )
        }

        await this.prisma.poll.update({
            where: {
                id: pollId,
            },

            data: {
                isClosed: true,
            },
        })

        return success(
            null,
            'Poll Closed',
            'Poll closed successfully',
        )
    }

    async deletePoll(
        pollId: string,
    ) {
        const poll =
            await this.prisma.poll.findUnique({
                where: {
                    id: pollId,
                },
            })

        if (!poll) {
            return error(
                'Not Found',
                'Poll not found',
                404,
            )
        }

        await this.prisma.poll.delete({
            where: {
                id: pollId,
            },
        })

        return success(
            null,
            'Poll Deleted',
            'Poll deleted successfully',
        )
    }
}
