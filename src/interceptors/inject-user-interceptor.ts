import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  ForbiddenException,
} from '@nestjs/common';
import { Observable, from } from 'rxjs';
import { UserEntity } from 'src/@types/user/user.entity';
import { PrismaService } from 'src/providers/prisma/prisma.service';

@Injectable()
export class InjectUserInterceptor implements NestInterceptor {
  constructor(private readonly prisma: PrismaService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const currentRoute = request.route?.path ?? '';

    const routesPublicByPassInterptor = ['/auth/login'];

    const shouldBypass = routesPublicByPassInterptor.some(route => route === currentRoute);
    if (shouldBypass) return next.handle()

    const payload = request.user;
    if (!payload?.userId) {
      console.warn('⚠️ Payload invalid in interceptor');
      return next.handle();
    }

    try {
      //implement user cache here
      const user = await this.prisma.user.findUnique({
        where: { id: payload.userId },
      });

      if (!user.isActive) {
        throw new ForbiddenException(
          'Access denied. User blocked',
        );
      }
      
      request.userLogged = user as UserEntity;
      return from(next.handle());
    } catch (error) {
      console.error('❌ Error in InjectUserInterceptor:', error);
      throw new ForbiddenException('Access denied. User not found');
    }
  }
}
