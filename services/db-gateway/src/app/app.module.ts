import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from '../configs/app.configurations';
import { AppController } from './app.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { FacebookModule } from '../core/facebook/facebook.module';
import { TiktokModule } from '../core/tiktok/tiktok.module';
import { ReportsModule } from '../core/reports/reports.module';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [configuration], isGlobal: true }),
    PrismaModule,
    FacebookModule,
    TiktokModule,
    ReportsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
