import { Injectable, Logger } from '@nestjs/common';

export interface SecurityEvent {
  type: string;
  message: string;
  ip: string;
  timestamp: Date;
  details?: any;
}

@Injectable()
export class SecurityMonitorService {
  private readonly logger = new Logger(SecurityMonitorService.name);

  async logSecurityEvent(event: SecurityEvent): Promise<void> {
    const data = {
      headers: event.details?.headers || 'No headers',
      body: event.details?.body || 'No body',
    }
    this.logger.warn(
      `Security Event: ${event.type} - ${event.message} from ${event.ip}`,
      // event.details
    );

    // Aqui você pode adicionar lógica para:
    // - Enviar alertas para sua equipe de segurança
    // - Registrar em um sistema de monitoramento
    // - Bloquear IPs suspeitos
    // - etc.
  }
}
