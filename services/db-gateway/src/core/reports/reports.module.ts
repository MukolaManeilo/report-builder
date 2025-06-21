import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { FacebookModule } from '../facebook/facebook.module';
import { TiktokModule } from '../tiktok/tiktok.module';
import { ReportsController } from './reports.controller';

@Module({
  imports: [TiktokModule, FacebookModule],
  providers: [ReportsService],
  controllers: [ReportsController],
  exports: [ReportsService],
})
export class ReportsModule {}
