import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from '../configs/app.configuration';
import { AppController } from './app.controller';
import { ReportsProxyModule } from '../core/reportsProxyModule/reports-proxy.module';

@Module({
  imports: [ConfigModule.forRoot({ load: [configuration], isGlobal: true }), ReportsProxyModule],
  controllers: [AppController],
})
export class AppModule {}
