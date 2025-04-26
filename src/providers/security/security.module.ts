import { Module } from '@nestjs/common';
import { SecurityMonitorService } from './security-monitor.service';

@Module({
  providers: [SecurityMonitorService],
  exports: [SecurityMonitorService],
})
export class SecurityModule {}
