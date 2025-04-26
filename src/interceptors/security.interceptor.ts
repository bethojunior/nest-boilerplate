import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { SecurityMonitorService } from '../providers/security/security-monitor.service';

@Injectable()
export class SecurityInterceptor implements NestInterceptor {
  constructor(private readonly securityMonitor: SecurityMonitorService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    this.securityMonitor.logSecurityEvent({
      type: 'REQUEST',
      message: `${request.method} ${request.url}`,
      ip: request.ip,
      timestamp: new Date(),
      details: {
        headers: request.headers,
        body: request.body,
      },
    });

    return next.handle();
  }
}
