import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { PrismaModule } from '../../database/prisma/prisma.module'
import { ResidentAssociateController } from './resident-associate.controller'
import { ResidentAssociateService } from './resident-associate.service'

@Module({
  imports: [PrismaModule, HttpModule],
  controllers: [ResidentAssociateController],
  providers: [ResidentAssociateService],
})
export class ResidentAssociateModule {}
