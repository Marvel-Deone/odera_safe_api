// import { Injectable } from '@nestjs/common'
// import { PrismaService } from '../../database/prisma/prisma.service'
// import { error, success } from '../../common/utils/response.util'
// import { Role } from '@prisma/client'
// import { CreateCommitteeDto } from './dto/committee.dto'

// @Injectable()
// export class CommitteeService {
//   constructor(
//     private readonly prisma: PrismaService,
//   ) {}

//   async createCommittee(
//     userId: string,
//     dto: CreateCommitteeDto,
//   ) {
//     const user =
//       await this.prisma.user.findUnique({
//         where: {
//           id: userId,
//         },
//       })

//     if (!user) {
//       return error(
//         'Not Found',
//         'User not found',
//         404,
//       )
//     }

//     const committee =
//       await this.prisma.committee.create({
//         data: {
//           estateId:
//             user.estateId,

//           name: dto.name,

//           description:
//             dto.description,
//         },
//       })

//     return success(
//       committee,
//       'Committee',
//       'Committee created successfully',
//     )
//   }

//   async getCommittees(
//     userId: string,
//   ) {
//     const user =
//       await this.prisma.user.findUnique({
//         where: {
//           id: userId,
//         },
//       })

//     if (!user) {
//       return error(
//         'Not Found',
//         'User not found',
//         404,
//       )
//     }

//     const committees =
//       await this.prisma.committee.findMany({
//         where: {
//           estateId:
//             user.estateId,
//         },

//         include: {
//           members: {
//             where: {
//               userId,
//             },
//           },

//           _count: {
//             select: {
//               members: true,
//             },
//           },
//         },

//         orderBy: {
//           createdAt: 'desc',
//         },
//       })

//     return success(
//       committees.map(
//         (committee) => ({
//           id: committee.id,

//           name:
//             committee.name,

//           description:
//             committee.description,

//           memberCount:
//             committee._count
//               .members,

//           joined:
//             committee.members
//               .length > 0,
//         }),
//       ),
//       'Committees',
//       'Committees fetched successfully',
//     )
//   }

//   async joinCommittee(
//     userId: string,
//     committeeId: string,
//   ) {
//     const committee =
//       await this.prisma.committee.findUnique({
//         where: {
//           id: committeeId,
//         },
//       })

//     if (!committee) {
//       return error(
//         'Not Found',
//         'Committee not found',
//         404,
//       )
//     }

//     const exists =
//       await this.prisma.committeeMember.findFirst({
//         where: {
//           committeeId,
//           userId,
//         },
//       })

//     if (exists) {
//       return error(
//         'Conflict',
//         'Already a committee member',
//         409,
//       )
//     }

//     const member =
//       await this.prisma.committeeMember.create({
//         data: {
//           committeeId,
//           userId,
//         },
//       })

//     return success(
//       member,
//       'Joined',
//       'Committee joined successfully',
//     )
//   }

//   async leaveCommittee(
//     userId: string,
//     committeeId: string,
//   ) {
//     const member =
//       await this.prisma.committeeMember.findFirst({
//         where: {
//           committeeId,
//           userId,
//         },
//       })

//     if (!member) {
//       return error(
//         'Not Found',
//         'Membership not found',
//         404,
//       )
//     }

//     await this.prisma.committeeMember.delete({
//       where: {
//         id: member.id,
//       },
//     })

//     return success(
//       null,
//       'Left',
//       'Committee left successfully',
//     )
//   }

//   async deleteCommittee(
//     committeeId: string,
//   ) {
//     const committee =
//       await this.prisma.committee.findUnique({
//         where: {
//           id: committeeId,
//         },
//       })

//     if (!committee) {
//       return error(
//         'Not Found',
//         'Committee not found',
//         404,
//       )
//     }

//     await this.prisma.committee.delete({
//       where: {
//         id: committeeId,
//       },
//     })

//     return success(
//       null,
//       'Deleted',
//       'Committee deleted successfully',
//     )
//   }
// }

import { Injectable, Logger } from '@nestjs/common'
import { PrismaService } from '../../database/prisma/prisma.service'
import { error, success } from '../../common/utils/response.util'
import { CreateCommitteeDto } from './dto/committee.dto'

@Injectable()
export class CommitteeService {
  private readonly logger = new Logger(CommitteeService.name)

  constructor(private readonly prisma: PrismaService) {}

  private getErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message : 'Unknown error'
  }

  private getErrorStack(error: unknown): string | undefined {
    return error instanceof Error ? error.stack : undefined
  }

  async createCommittee(userId: string, dto: CreateCommitteeDto) {
    try {
      const user = await this.prisma.user.findUnique({
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

      const committee = await this.prisma.committee.create({
        data: {
          estateId: user.estateId,
          name: dto.name,
          description: dto.description,
        },
      })

      return success(
        committee,
        'Committee',
        'Committee created successfully',
      )
    } catch (err) {
      this.logger.error(
        `Create committee failed for user ${userId}`,
        this.getErrorStack(err),
      )

      return error(
        'Committee creation failed',
        this.getErrorMessage(err),
        400,
      )
    }
  }

  async getCommittees(userId: string) {
    try {
      const user = await this.prisma.user.findUnique({
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

      const committees = await this.prisma.committee.findMany({
        where: {
          estateId: user.estateId,
        },

        include: {
          members: {
            where: {
              userId,
            },
          },

          _count: {
            select: {
              members: true,
            },
          },
        },

        orderBy: {
          createdAt: 'desc',
        },
      })

      return success(
        committees.map((committee) => ({
          id: committee.id,
          name: committee.name,
          description: committee.description,
          memberCount: committee._count.members,
          joined: committee.members.length > 0,
        })),
        'Committees',
        'Committees fetched successfully',
      )
    } catch (err) {
      this.logger.error(
        `Fetch committees failed for user ${userId}`,
        this.getErrorStack(err),
      )

      return error(
        'Failed to fetch committees',
        this.getErrorMessage(err),
        400,
      )
    }
  }

  async joinCommittee(userId: string, committeeId: string) {
    try {
      const committee = await this.prisma.committee.findUnique({
        where: {
          id: committeeId,
        },
      })

      if (!committee) {
        return error(
          'Not Found',
          'Committee not found',
          404,
        )
      }

      const exists = await this.prisma.committeeMember.findFirst({
        where: {
          committeeId,
          userId,
        },
      })

      if (exists) {
        return error(
          'Conflict',
          'Already a committee member',
          409,
        )
      }

      const member = await this.prisma.committeeMember.create({
        data: {
          committeeId,
          userId,
        },
      })

      return success(
        member,
        'Joined',
        'Committee joined successfully',
      )
    } catch (err) {
      this.logger.error(
        `Join committee failed. User: ${userId}, Committee: ${committeeId}`,
        this.getErrorStack(err),
      )

      return error(
        'Failed to join committee',
        this.getErrorMessage(err),
        400,
      )
    }
  }

  async leaveCommittee(userId: string, committeeId: string) {
    try {
      const member = await this.prisma.committeeMember.findFirst({
        where: {
          committeeId,
          userId,
        },
      })

      if (!member) {
        return error(
          'Not Found',
          'Membership not found',
          404,
        )
      }

      await this.prisma.committeeMember.delete({
        where: {
          id: member.id,
        },
      })

      return success(
        null,
        'Left',
        'Committee left successfully',
      )
    } catch (err) {
      this.logger.error(
        `Leave committee failed. User: ${userId}, Committee: ${committeeId}`,
        this.getErrorStack(err),
      )

      return error(
        'Failed to leave committee',
        this.getErrorMessage(err),
        400,
      )
    }
  }

  async deleteCommittee(committeeId: string) {
    try {
      const committee = await this.prisma.committee.findUnique({
        where: {
          id: committeeId,
        },
      })

      if (!committee) {
        return error(
          'Not Found',
          'Committee not found',
          404,
        )
      }

      await this.prisma.committee.delete({
        where: {
          id: committeeId,
        },
      })

      return success(
        null,
        'Deleted',
        'Committee deleted successfully',
      )
    } catch (err) {
      this.logger.error(
        `Delete committee failed. Committee: ${committeeId}`,
        this.getErrorStack(err),
      )

      return error(
        'Failed to delete committee',
        this.getErrorMessage(err),
        400,
      )
    }
  }
}