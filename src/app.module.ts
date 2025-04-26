import { Logger, Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './providers/prisma/prisma.module';
import { APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core';
import { InjectUserInterceptor } from './interceptors/inject-user-interceptor';
import { MailModule } from './providers/mail/mail.module';
import { QueueModule } from './providers/queue/queue.module';
import { CacheConfigModule } from './providers/cache/cache.module';
import { RateLimitModule } from './providers/rate-limit/rate-limit.module';
import { SecurityModule } from './providers/security/security.module';
import { RateLimitGuard } from './http/guards/rate-limit.guard';

@Module({
  imports: [
    CacheConfigModule,
    MailModule,
    QueueModule,
    PrismaModule,
    AuthModule,
    RateLimitModule,
    SecurityModule,
  ],
  controllers: [],
  providers: [
    {
      provide: Logger,
      useValue: new Logger('AppModule', { timestamp: true }),
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: InjectUserInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: RateLimitGuard,
    },
  ],
})
export class AppModule { }
