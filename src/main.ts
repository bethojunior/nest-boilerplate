import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvEnum } from './enums/env.enum';
import { BusinessExceptionFilter } from './exceptions/business.exception.filter';
import helmet from 'helmet';
import * as csurf from 'csurf';
import * as session from 'express-session';
import { SecurityInterceptor } from './interceptors/security.interceptor';
import { SecurityMonitorService } from './providers/security/security-monitor.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  if (process.env.ENV === EnvEnum.DEVELOPMENT) {
    app.enableCors({
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      allowedHeaders: '*',
    });
  }

  if(process.env.ENV === EnvEnum.PRODUCTION) {
    app.enableCors({
      origin: [
        // replace with your production domain
      ],
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      allowedHeaders: '*',
    });
  }

  if (process.env.ENV === EnvEnum.PRODUCTION) {
    app.use(helmet());
    app.use(
      helmet.contentSecurityPolicy({
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'"],
          imgSrc: ["'self'"],
          connectSrc: ["'self'"],
        },
      })
    );
    app.use(csurf());
  }

  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.ENV === EnvEnum.PRODUCTION,
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000,
      },
    })
  );

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  app.useGlobalFilters(new BusinessExceptionFilter());

  const securityMonitor = app.get(SecurityMonitorService);
  app.useGlobalInterceptors(new SecurityInterceptor(securityMonitor));


  const port = process.env.APP_PORT;
  await app.listen(port).then(() => {
    console.log(`🚀 Server is running on ${port}`);
  });
}
bootstrap();