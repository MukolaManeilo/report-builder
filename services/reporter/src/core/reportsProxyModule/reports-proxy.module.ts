import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ReportsProxyController } from './reports-proxy.controller';

@Module({
  imports: [HttpModule],
  controllers: [ReportsProxyController],
})
export class ReportsProxyModule {}
