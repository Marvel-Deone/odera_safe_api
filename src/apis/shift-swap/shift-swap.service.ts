import {
  HttpStatus,
  Injectable,
} from '@nestjs/common'
import {
  Prisma,
  ShiftSwapStatus,
} from '@prisma/client'
import { PrismaService } from '../../database/prisma/prisma.service'
import { error, success } from '../../common/utils/response.util'
import {
  CreateShiftSwapDto,
  RejectShiftSwapDto,
} from './dto/shift-swap.dto'

@Injectable()
export class ShiftSwapService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async createSwapRequest(
    userId: string,
    dto: CreateShiftSwapDto,
  ) {
    const guard =
      await this.prisma.guard.findFirst({
        where: { userId },
      })

    if (!guard) {
      return error(
        'Not Found',
        'Guard not found',
        HttpStatus.NOT_FOUND,
      )
    }

    // Prevent self swap
    if (dto.targetGuardId === guard.id) {
      return error(
        'Invalid Request',
        'You cannot swap with yourself',
        HttpStatus.BAD_REQUEST,
      )
    }

    // Validate requester's shift
    const requesterShift =
      await this.prisma.guardShift.findFirst({
        where: {
          id: dto.requesterShiftId,
          guardId: guard.id,
          estateId: guard.estateId,
        },
      })

    if (!requesterShift) {
      return error(
        'Invalid Shift',
        'Selected shift does not belong to you',
        HttpStatus.BAD_REQUEST,
      )
    }

    // Validate target guard
    const targetGuard =
      await this.prisma.guard.findFirst({
        where: {
          id: dto.targetGuardId,
          estateId: guard.estateId,
          is_active: true,
        },
      })

    if (!targetGuard) {
      return error(
        'Invalid Guard',
        'Target guard not found',
        HttpStatus.BAD_REQUEST,
      )
    }

    // Validate target shift
    const targetShift =
      await this.prisma.guardShift.findFirst({
        where: {
          id: dto.targetShiftId,
          guardId: dto.targetGuardId,
          estateId: guard.estateId,
        },
      })

    if (!targetShift) {
      return error(
        'Invalid Shift',
        'Target shift not found',
        HttpStatus.BAD_REQUEST,
      )
    }

    // Check duplicate pending request
    const existing =
      await this.prisma.shiftSwapRequest.findFirst({
        where: {
          requesterGuardId: guard.id,
          requesterShiftId:
            dto.requesterShiftId,
          targetShiftId:
            dto.targetShiftId,
          status:
            ShiftSwapStatus.PENDING,
        },
      })

    if (existing) {
      return error(
        'Duplicate Request',
        'A pending swap request already exists',
        HttpStatus.CONFLICT,
      )
    }

    const swap =
      await this.prisma.shiftSwapRequest.create({
        data: {
          estateId: guard.estateId,
          requesterGuardId: guard.id,
          targetGuardId:
            dto.targetGuardId,
          requesterShiftId:
            dto.requesterShiftId,
          targetShiftId:
            dto.targetShiftId,
          reason: dto.reason,
          details: dto.details,
        },

        include: {
          requester: {
            select: {
              id: true,
              full_name: true,
            },
          },
          target: {
            select: {
              id: true,
              full_name: true,
            },
          },
          requesterShift: true,
          targetShift: true,
        },
      })

    return success(
      swap,
      'Shift Swap Requested',
      'Shift swap request submitted successfully',
    )
  }

  async getAllSwapRequests(userId: string) {
    const user =
      await this.prisma.user.findFirst({
        where: { id: userId },
      })

    if (!user) {
      return error(
        'Unauthorized',
        'User not found',
        HttpStatus.NOT_FOUND,
      )
    }

    const swaps =
      await this.prisma.shiftSwapRequest.findMany({
        where: {
          estateId: user.estateId,
        },

        include: {
          requester: {
            select: {
              id: true,
              full_name: true,
            },
          },
          target: {
            select: {
              id: true,
              full_name: true,
            },
          },
          requesterShift: true,
          targetShift: true,
        },

        orderBy: {
          createdAt: 'desc',
        },
      })

    return success(
      swaps,
      'Shift Swap Requests',
      'Shift swap requests fetched successfully',
    )
  }

  async getSwapRequests(userId: string) {
    const guard = await this.prisma.guard.findFirst({
            where: { userId },
        })

        if (!guard) {
            return error(
                'Not Found',
                'Guard not found',
                HttpStatus.NOT_FOUND,
            )
        }

    const swaps =
      await this.prisma.shiftSwapRequest.findMany({
        where: {
          requesterGuardId: guard.id,
        },

        include: {
          requester: {
            select: {
              id: true,
              full_name: true,
            },
          },
          target: {
            select: {
              id: true,
              full_name: true,
            },
          },
          requesterShift: true,
          targetShift: true,
        },

        orderBy: {
          createdAt: 'desc',
        },
      })

    return success(
      swaps,
      'Shift Swap Requests',
      'Shift swap requests fetched successfully',
    )
  }

  async approveSwap(
    userId: string,
    swapId: string,
  ) {
    const admin =
      await this.prisma.user.findFirst({
        where: { id: userId },
      })

    if (!admin) {
      return error(
        'Unauthorized',
        'Admin not found',
        HttpStatus.NOT_FOUND,
      )
    }

    const swap =
      await this.prisma.shiftSwapRequest.findFirst({
        where: {
          id: swapId,
          estateId: admin.estateId,
        },
      })

    if (!swap) {
      return error(
        'Not Found',
        'Swap request not found',
        HttpStatus.NOT_FOUND,
      )
    }

    if (
      swap.status !==
      ShiftSwapStatus.PENDING
    ) {
      return error(
        'Invalid Status',
        'Only pending requests can be approved',
        HttpStatus.BAD_REQUEST,
      )
    }

    await this.prisma.$transaction(
      async (
        tx: Prisma.TransactionClient,
      ) => {
        const requesterShift =
          await tx.guardShift.findUnique({
            where: {
              id: swap.requesterShiftId,
            },
          })

        const targetShift =
          await tx.guardShift.findUnique({
            where: {
              id: swap.targetShiftId,
            },
          })

        if (
          !requesterShift ||
          !targetShift
        ) {
          throw new Error(
            'Shift not found',
          )
        }

        // Swap guard assignments
        await tx.guardShift.update({
          where: {
            id: requesterShift.id,
          },
          data: {
            guardId:
              targetShift.guardId,
          },
        })

        await tx.guardShift.update({
          where: {
            id: targetShift.id,
          },
          data: {
            guardId:
              requesterShift.guardId,
          },
        })

        // Mark approved
        await tx.shiftSwapRequest.update({
          where: {
            id: swap.id,
          },
          data: {
            status:
              ShiftSwapStatus.APPROVED,
            reviewedAt: new Date(),
            reviewedBy: admin.id,
          },
        })
      },
    )

    const updated =
      await this.prisma.shiftSwapRequest.findUnique({
        where: {
          id: swap.id,
        },
        include: {
          requester: {
            select: {
              id: true,
              full_name: true,
            },
          },
          target: {
            select: {
              id: true,
              full_name: true,
            },
          },
          requesterShift: true,
          targetShift: true,
        },
      })

    return success(
      updated,
      'Shift Swap Approved',
      'Shift assignments swapped successfully',
    )
  }

  async rejectSwap(
    userId: string,
    swapId: string,
    dto: RejectShiftSwapDto,
  ) {
    const admin =
      await this.prisma.user.findFirst({
        where: { id: userId },
      })

    if (!admin) {
      return error(
        'Unauthorized',
        'Admin not found',
        HttpStatus.NOT_FOUND,
      )
    }

    const swap =
      await this.prisma.shiftSwapRequest.findFirst({
        where: {
          id: swapId,
          estateId: admin.estateId,
        },
      })

    if (!swap) {
      return error(
        'Not Found',
        'Swap request not found',
        HttpStatus.NOT_FOUND,
      )
    }

    if (
      swap.status !==
      ShiftSwapStatus.PENDING
    ) {
      return error(
        'Invalid Status',
        'Only pending requests can be rejected',
        HttpStatus.BAD_REQUEST,
      )
    }

    const updated =
      await this.prisma.shiftSwapRequest.update({
        where: {
          id: swap.id,
        },
        data: {
          status:
            ShiftSwapStatus.REJECTED,
          reviewedAt: new Date(),
          reviewedBy: admin.id,
          reviewNote:
            dto.rejectionReason,
        },

        include: {
          requester: {
            select: {
              id: true,
              full_name: true,
            },
          },
          target: {
            select: {
              id: true,
              full_name: true,
            },
          },
          requesterShift: true,
          targetShift: true,
        },
      })

    return success(
      updated,
      'Shift Swap Rejected',
      'Shift swap request rejected successfully',
    )
  }

  async cancelSwapRequest(
    userId: string,
    swapId: string,
  ) {
    const guard =
      await this.prisma.guard.findFirst({
        where: { userId },
      })

    if (!guard) {
      return error(
        'Not Found',
        'Guard not found',
        HttpStatus.NOT_FOUND,
      )
    }

    const swap =
      await this.prisma.shiftSwapRequest.findFirst({
        where: {
          id: swapId,
          requesterGuardId:
            guard.id,
        },
      })

    if (!swap) {
      return error(
        'Not Found',
        'Swap request not found',
        HttpStatus.NOT_FOUND,
      )
    }

    if (
      swap.status !==
      ShiftSwapStatus.PENDING
    ) {
      return error(
        'Invalid Status',
        'Only pending requests can be cancelled',
        HttpStatus.BAD_REQUEST,
      )
    }

    const updated =
      await this.prisma.shiftSwapRequest.update({
        where: {
          id: swap.id,
        },
        data: {
          status:
            ShiftSwapStatus.CANCELLED,
        },
        include: {
          requester: {
            select: {
              id: true,
              full_name: true,
            },
          },
          target: {
            select: {
              id: true,
              full_name: true,
            },
          },
          requesterShift: true,
          targetShift: true,
        },
      })

    return success(
      updated,
      'Shift Swap Cancelled',
      'Swap request cancelled successfully',
    )
  }
}