// import {
//   Body,
//   Controller,
//   Get,
//   Param,
//   Patch,
//   Post,
//   Req,
//   UseGuards,
// } from '@nestjs/common'
// import { MaintenanceTicketService } from './maintenance-ticket.service'
// import { AssignMaintenanceDto, CompleteMaintenanceDto, CreateMaintenanceTicketDto, RateTicketDto } from './dto/maintenance-ticket.dto'
// import { CurrentUser } from '../auth/decorators/current-user.decorator'
// import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
// import { RolesGuard } from '../auth/guards/roles.guard';
// import { Roles } from '../auth/decorators/roles.decorator';
// import { GuardRole, Role } from '@prisma/client';

// @ApiTags('Maintenance Ticket')
// @ApiBearerAuth()

// @UseGuards(
//   JwtAuthGuard,
//   RolesGuard,
// )
// @Controller('maintenance')
// export class MaintenanceTicketController {
//   constructor(
//     private readonly maintenanceService: MaintenanceTicketService,
//   ) { }

//   @Roles(Role.ADMIN, Role.SUPER_ADMIN, GuardRole.GUARD, GuardRole.SUPER_GUARD as unknown as Role)
//   @ApiOperation({
//     summary: 'Create maintenance ticket',
//   })
//   @Post()
//   createTicket(
//     @CurrentUser() user: any,
//     @Body()
//     dto: CreateMaintenanceTicketDto,
//   ) {
//     return this.maintenanceService.createTicket(
//       user.id,
//       dto,
//     )
//   }

//   @Roles(Role.ADMIN, Role.SUPER_ADMIN, GuardRole.GUARD, GuardRole.SUPER_GUARD as unknown as Role)
//   @ApiOperation({
//     summary: 'Get resident maintenance tickets',
//   })
//   @Get('resident')
//   getResidentTickets(
//     @CurrentUser() user: any,
//   ) {
//     return this.maintenanceService.getResidentTickets(
//       user.id,
//     )
//   }

//   @Roles(Role.ADMIN, Role.SUPER_ADMIN, GuardRole.SUPER_GUARD as unknown as Role)
//   @ApiOperation({
//     summary: 'Get all maintenance tickets (Admin)',
//   })
//   @Get('admin/tickets')
//   getAdminTickets(
//     @CurrentUser() user: any,
//   ) {
//     return this.maintenanceService.getAdminTickets(
//       user.id,
//     )
//   }

//   @Roles(GuardRole.GUARD, GuardRole.SUPER_GUARD as unknown as Role)
//   @ApiOperation({
//     summary: 'Get techicians queeue',
//   })
//   @Get('guard/techqueue')
//   getTechicianQueue(
//     @CurrentUser() user: any,
//   ) {
//     return this.maintenanceService.getTechQueue(
//       user.id,
//     )
//   }

//   @Roles(Role.ADMIN, Role.SUPER_ADMIN, GuardRole.SUPER_GUARD as unknown as Role)
//   @ApiOperation({
//     summary: 'Assign ticket to technician/guard',
//   })
//   @Patch(':id/assign')
//   assignTicket(
//     @Param('id') id: string,

//     @Body()
//     dto: AssignMaintenanceDto,
//   ) {
//     return this.maintenanceService.assignTicket(
//       id,
//       dto,
//     )
//   }

//   @Roles(GuardRole.GUARD, GuardRole.SUPER_GUARD as unknown as Role)
//   @ApiOperation({
//     summary: 'Start job (technician/guard)',
//   })
//   @Patch(':id/start')
//   startTicket(
//     @Param('id') id: string,
//   ) {
//     return this.maintenanceService.startTicket(
//       id,
//     )
//   }

//   // @Roles(GuardRole.GUARD, GuardRole.SUPER_GUARD as unknown as Role)
//   // @ApiOperation({
//   //   summary: 'Complete job (technician/guard)',
//   // })
//   // @Patch(':id/complete')
//   // completeTicket(
//   //   @Param('id') id: string,

//   //   @Body()
//   //   dto: CompleteMaintenanceDto,
//   // ) {
//   //   return this.maintenanceService.completeTicket(
//   //     id,
//   //     dto
//   //   )
//   // }

  
// }