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

@Module({
  imports: [
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
    VisitorModule,
    DashboardModule,
    GuardModule
  ],
  controllers: [AppController, DashboardController],
  providers: [AppService, DashboardService],
})
export class AppModule { }
