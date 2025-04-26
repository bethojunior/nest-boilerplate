import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  ForbiddenException,
  HttpStatus,
} from '@nestjs/common';
import { LoginAuthDto } from './dto/login-auth.dto';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { LoginPayload } from 'src/@types/utils/login-payload';
import { SendAlertLoginJob } from 'src/job/email/login.job';
import * as bcrypt from 'bcrypt';
import { LoginAttemptService } from 'src/providers/security/login-attempt.service';
import { UserEntity } from 'src/@types/user/user.entity';
import { CreateUserDto } from './dto/create-auth.dto';
import { BusinessException } from 'src/exceptions/business.exception';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly sendAlertLoginJob: SendAlertLoginJob,
    private readonly loginAttemptService: LoginAttemptService,
  ) { }

  async login({
    loginAuthDto,
    ip,
  }: {
    loginAuthDto: LoginAuthDto;
    ip: string;
  }): Promise<{ accessToken: string; user: UserEntity }> {

    const isBlocked = await this.loginAttemptService.isIpBlocked(ip);
    if (isBlocked) {
      throw new ForbiddenException('Too many failed attempts. Please try again later.');
    }

    const user = await this.findOneByEmail(loginAuthDto.email);
    if (!user) {
      await this.loginAttemptService.trackFailedAttempt(ip);
      throw new NotFoundException('User with this email not found');
    }

    const isPasswordValid = await bcrypt.compare(
      loginAuthDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      await this.loginAttemptService.trackFailedAttempt(ip);
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: LoginPayload = {
      sub: user.id,
      email: user.email,
    };

    const accessToken = this.jwtService.sign(payload);

    const { password, ...userWithoutPassword } = user;

    await this.sendAlertLoginJob.handle(user.name, user.email);

    return {
      user: {
        ...userWithoutPassword,
      } as unknown as UserEntity,
      accessToken,
    };
  }

  async register(ip: string, props: CreateUserDto): Promise<UserEntity> {
    const isBlocked = await this.loginAttemptService.isIpBlocked(ip);
    if (isBlocked) {
      throw new ForbiddenException('Too many failed attempts. Please try again later.');
    }
    try {
      const salt = await bcrypt.genSalt()
      const hashedPassword = await bcrypt.hash(props.password, salt);

      if (await this.findOneByEmail(props.email)) {
        throw new BusinessException(
          'User with this email already exists',
          HttpStatus.CONFLICT,
          'USER_EMAIL_EXISTS',
          'DUPLICATE_ERROR',
        )
      }

      const user = await this.prisma.user.create({
        data: {
          ...props,
          password: hashedPassword,
        },
      });

      const { password, ...userWithoutPassword } = user;

      return userWithoutPassword as unknown as UserEntity;
    } catch (error) {
      throw new BusinessException(
        error.message,
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.findOneByEmail(email);

    if (!user) return null;

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  private async findOneByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        email: email,
        deleted_at: null,
      },
    });
  }

}
