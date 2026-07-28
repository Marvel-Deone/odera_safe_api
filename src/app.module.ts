import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ResidentModule } from './apis/resident/resident.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './apis/auth/auth.module';
import { VisitorModule } from './apis/visitor/visitor.module';
import { DashboardService } from './apis/dashboard/dashboard.service';
import { DashboardController } from './apis/dashboard/dashboard.controller';
import { DashboardModule } from './apis/dashboard/dashboard.module';
import { PrismaModule } from './database/prisma/prisma.module';
import { GuardModule } from './apis/guard/guard.module';
import { TrackingModule } from './apis/tracking/tracking.module';
import { SmsModule } from './apis/sms/sms.module';
import { ScheduleModule } from '@nestjs/schedule'
import { PatrolMonitoringModule } from './apis/patrol-monitoring/patrol-monitoring.module';
import { PatrolModule } from './apis/patrol/patrol.module';
import { GuardSosModule } from './apis/guard-sos/guard-sos.module';
import { ShiftSwapModule } from './apis/shift-swap/shift-swap.module';
import { PerformanceModule } from './apis/performance/performance.module';
import { GuardLocationModule } from './apis/guard-location/guard-location.module';
import { IncidentModule } from './apis/incident/incident.module';
import { AnnouncementModule } from './apis/announcement/announcement.module';
import { ChatModule } from './apis/chat/chat.module';
import { PollModule } from './apis/poll/poll.module';
import { CommitteeModule } from './apis/committee/committee.module';
import { FinanceModule } from './apis/finance/finance.module';
import { UsersModule } from './apis/users/users.module';
import { VehicleModule } from './apis/vehicle/vehicle.module';
import { EstateConfigModule } from './apis/estate-config/estate-config.module';
import { HeavyVehicleModule } from './apis/heavy-vehicle/heavy-vehicle.module';
import { ShortletModule } from './apis/shortlet/shortlet.module';
import { ClientsModule } from './shared/client/client.module';
// import { ClientModule } from './shared/client/client.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '7d',
      },
    }),
    PrismaModule,
    ResidentModule,
    DatabaseModule,
    AuthModule,
    UsersModule,
    VisitorModule,
    DashboardModule,
    GuardModule,
    TrackingModule,
    SmsModule,
    PatrolMonitoringModule,
    PatrolModule,
    GuardSosModule,
    ShiftSwapModule,
    PerformanceModule,
    GuardLocationModule,
    IncidentModule,
    AnnouncementModule,
    ChatModule,
    PollModule,
    CommitteeModule,
    FinanceModule,
    VehicleModule,
    EstateConfigModule,
    HeavyVehicleModule,
    ShortletModule,
    ClientsModule,
  ],
  controllers: [AppController, DashboardController],
  providers: [AppService, DashboardService],
})
export class AppModule { }
