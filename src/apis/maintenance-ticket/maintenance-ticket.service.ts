// import {
//   HttpStatus,
//   Injectable,
// } from '@nestjs/common'

// import { PrismaService } from '../../database/prisma/prisma.service'

// import { error, success } from '../../common/utils/response.util'
// import { AssignMaintenanceDto, CompleteMaintenanceDto, CreateMaintenanceTicketDto, RateTicketDto } from './dto/maintenance-ticket.dto'
// import { TicketPriority } from '@prisma/client';
// import { MaintenanceGateway } from './maintenance.gateway';


// @Injectable()
// export class MaintenanceTicketService {
//   constructor(
//     private readonly prisma: PrismaService,
//     private readonly maintenanceGateway: MaintenanceGateway,
//   ) { }

//   async createTicket(
//     userId: string,
//     dto: CreateMaintenanceTicketDto,
//   ) {
//     try {
//       const resident =
//         await this.prisma.resident.findFirst({
//           where: {
//             userId,
//           },
//         })

//       if (!resident) {
//         return {
//           success: false,
//           message: 'Resident not found',
//           statusCode: HttpStatus.NOT_FOUND,
//         }
//       }

//       const slaHours = {
//         [TicketPriority.P1_CRITICAL]: 2,
//         [TicketPriority.P2_URGENT]: 8,
//         [TicketPriority.P3_ROUTINE]: 24,
//       }

//       const hours = slaHours[dto.priority]

//       if (!hours) {
//         return error('Bad request', 'Invalid priority', HttpStatus.BAD_REQUEST, null)
//       }

//       const slaDeadline = new Date()

//       slaDeadline.setHours(
//         slaDeadline.getHours() +
//         slaHours[dto.priority],
//       )

//       const ticket =
//         await this.prisma.maintenanceTicket.create({
//           data: {
//             residentId: resident.id,
//             estateId: resident.estateId,

//             title: dto.title,
//             description:
//               dto.description,

//             priority: dto.priority,

//             location: dto.location,

//             beforePhoto:
//               dto.beforePhoto,

//             slaDeadline,
//           },
//         })

//       this.maintenanceGateway.emitNewTicket(
//         ticket,
//       )

//       return success(
//         ticket,
//         'Maintenance Ticket Created',
//         'Ticket submitted successfully',
//       )

//     } catch (error: any) {
//       console.error(error)

//       return {
//         success: false,
//         message:
//           error?.message ||
//           'Something went wrong',
//         statusCode:
//           HttpStatus.INTERNAL_SERVER_ERROR,
//       }
//     }
//   }

//   async getResidentTickets(
//     userId: string,
//   ) {
//     const resident =
//       await this.prisma.resident.findFirst({
//         where: {
//           userId,
//         },
//       })

//     const tickets =
//       await this.prisma.maintenanceTicket.findMany({
//         where: {
//           residentId: resident?.id,
//         },

//         orderBy: {
//           createdAt: 'desc',
//         },
//       })

//     return success(
//       tickets,
//       'Resident Tickets',
//       'Tickets fetched successfully',
//     )
//   }

//   async getAdminTickets(userId: string) {
//     const user =
//       await this.prisma.user.findUnique({
//         where: {
//           id: userId,
//         },
//       })

//     const tickets =
//       await this.prisma.maintenanceTicket.findMany({
//         where: {
//           estateId: user?.estateId,
//         },

//         include: {
//           resident: {
//             include: {
//               user: true,
//             },
//           },

//           assignedTo: true,
//         },

//         orderBy: {
//           createdAt: 'desc',
//         },
//       })

//     return success(
//       tickets,
//       'Incidents fetched',
//       'Success',
//     )
//   }

//   async assignTicket(
//     id: string,
//     dto: AssignMaintenanceDto,
//   ) {
//     const ticket =
//       await this.prisma.maintenanceTicket.update({
//         where: {
//           id,
//         },

//         data: {
//           assignedToId:
//             dto.assignedToId,

//           status: 'ASSIGNED',
//         },

//         include: {
//           assignedTo: true,
//         },
//       })

//     this.maintenanceGateway.emitAssigned(
//       ticket,
//     )

//     return success(
//       ticket,
//       'Ticket Assigned',
//       'Success',
//     )
//   }

//   async getTechQueue(userId: string) {
//     const tickets =
//       await this.prisma.maintenanceTicket.findMany({
//         where: {
//           assignedToId: userId,

//           status: {
//             in: [
//               'ASSIGNED',
//               'IN_PROGRESS',
//               'BREACHED',
//             ],
//           },
//         },

//         orderBy: {
//           priority: 'asc',
//         },
//       })

//     return success(
//       tickets,
//       'Queue fetched',
//       'Success',
//     )
//   }

//   async startTicket(id: string) {
//     const ticket =
//       await this.prisma.maintenanceTicket.update({
//         where: {
//           id,
//         },

//         data: {
//           status: 'IN_PROGRESS',
//           startedAt: new Date(),
//         },
//       })

//     return success(
//       ticket,
//       'Job started',
//       'Success',
//     )
//   }

//   // async completeTicket(
//   //   id: string,
//   //   dto: CompleteMaintenanceDto,
//   // ) {
//   //   const ticket =
//   //     await this.prisma.maintenanceTicket.update({
//   //       where: {
//   //         id,
//   //       },

//   //       data: {
//   //         status: 'RESOLVED',

//   //         afterPhoto:
//   //           dto.afterPhoto,

//   //         completionNote:
//   //           dto.completionNote,

//   //         completedAt: new Date(),
//   //       },
//   //     })

//   //   this.maintenanceGateway.emitCompleted(
//   //     ticket,
//   //   )

//   //   return success(
//   //     ticket,
//   //     'Ticket completed',
//   //     'Success',
//   //   )
//   // }

//   async rateTicket(
//     id: string,
//     dto: RateTicketDto,
//   ) {
//     const ticket =
//       await this.prisma.maintenanceTicket.update({
//         where: {
//           id,
//         },

//         data: {
//           residentRating: dto.rating,
//         },
//       })

//     return success(
//       ticket,
//       'Rating submitted',
//       'Success',
//     )
//   }
// }