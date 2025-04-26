import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { QueueModule } from 'src/providers/queue/queue.module';
import { SendAlertLoginJob } from 'src/job/email/login.job';
import { LoginAttemptService } from 'src/providers/security/login-attempt.service';
import { SecurityModule } from 'src/providers/security/security.module';

@Module({
  imports: [
    QueueModule,
    PassportModule,
    SecurityModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRATION_TIME },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    SendAlertLoginJob,
    LoginAttemptService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
