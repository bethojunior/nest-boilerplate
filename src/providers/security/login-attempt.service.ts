import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LoginAttemptService {
  private readonly MAX_ATTEMPTS = 5;
  private readonly BLOCK_DURATION = 15 * 60 * 1000; // 15 min

  constructor(private readonly prisma: PrismaService) {}

  async trackFailedAttempt(ip: string): Promise<void> {
    const attempts = await this.getAttempts(ip);

    if (attempts >= this.MAX_ATTEMPTS) {
      await this.blockIp(ip);
    } else {
      await this.incrementAttempts(ip);
    }
  }

  async isIpBlocked(ip: string): Promise<boolean> {
    const blockedIp = await this.prisma.blockedIp.findUnique({
      where: { ip },
    });

    if (!blockedIp) return false;

    if (blockedIp.blockedUntil < new Date()) {
      await this.prisma.blockedIp.delete({ where: { ip } });
      return false;
    }

    return true;
  }

  private async getAttempts(ip: string): Promise<number> {
    const attempt = await this.prisma.loginAttempt.findUnique({
      where: { ip },
    });

    return attempt?.count || 0;
  }

  private async incrementAttempts(ip: string): Promise<void> {
    await this.prisma.loginAttempt.upsert({
      where: { ip },
      update: { count: { increment: 1 } },
      create: { ip, count: 1 },
    });
  }

  private async blockIp(ip: string): Promise<void> {
    const blockedUntil = new Date(Date.now() + this.BLOCK_DURATION);

    await this.prisma.blockedIp.upsert({
      where: { ip },
      update: { blockedUntil },
      create: { ip, blockedUntil },
    });

    await this.prisma.loginAttempt.delete({ where: { ip } });
  }
}
