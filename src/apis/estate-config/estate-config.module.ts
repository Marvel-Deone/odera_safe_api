import { Module } from '@nestjs/common'
import { PrismaModule } from '../../database/prisma/prisma.module'
import { EstateConfigController } from './estate-config.controller'
import { EstateConfigService } from './estate-config.service'

@Module({
  imports: [PrismaModule],
  controllers: [EstateConfigController],
  providers: [EstateConfigService],
})
export class EstateConfigModule {}
