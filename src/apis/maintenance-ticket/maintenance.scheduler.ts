// import {
//   Injectable,
// } from '@nestjs/common'

// import {
//   Cron,
//   CronExpression,
// } from '@nestjs/schedule'
// import { PrismaService } from '../../database/prisma/prisma.service'
// import { MaintenanceGateway } from './maintenance.gateway'

// @Injectable()
// export class MaintenanceScheduler {
//   constructor(
//     private readonly prisma: PrismaService,

//     private readonly maintenanceGateway: MaintenanceGateway,
//   ) {}

//   @Cron(
//     CronExpression.EVERY_MINUTE,
//   )
//   async checkBreachedTickets() {
//     const breached =
//       await this.prisma.maintenanceTicket.updateMany({
//         where: {
//           slaDeadline: {
//             lt: new Date(),
//           },

//           status: {
//             not: 'RESOLVED',
//           },
//         },

//         data: {
//           status: 'BREACHED',
//         },
//       })

//     if (breached.count > 0) {
//       this.maintenanceGateway.emitBreached(
//         breached,
//       )
//     }
//   }
// }