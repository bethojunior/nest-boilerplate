import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { RedisThrottlerStorage } from './redis-storage.service';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      useFactory: () => ({
        throttlers: [{
          ttl: 60,
          limit: 100,
        }],
        storage: new RedisThrottlerStorage(),
      }),
    }),
  ],
})
export class RateLimitModule {}
