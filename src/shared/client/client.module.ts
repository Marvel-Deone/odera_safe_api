import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ClientsService } from './client.service';

@Module({
  imports: [HttpModule],
  providers: [ClientsService],
  exports: [ClientsService],
})
export class ClientsModule { }
