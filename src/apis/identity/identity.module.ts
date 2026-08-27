import { Module } from '@nestjs/common';
import { IdentityService } from './identity.service';
import { IdentityController } from './identity.controller';
import { ClientService } from '../../shared/client/client.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule,],
  providers: [IdentityService, ClientService,],
  controllers: [IdentityController]
})
export class IdentityModule {}
