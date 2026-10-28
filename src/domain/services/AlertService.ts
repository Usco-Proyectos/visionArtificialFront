export type AlertSeverity = 'medium' | 'high' | 'critical';

class AlertService {
  getSeverity(regla: string): AlertSeverity {
    if (regla === 'C1_OJOS_CERRADOS_M1') return 'critical';
    if (regla === 'C2_SOMNOLENCIA_M3') return 'high';
    return 'medium';
  }

  getMessage(severity: AlertSeverity): string {
    switch (severity) {
      case 'critical': return '¡PELIGRO! Ojos cerrados demasiado tiempo';
      case 'high': return 'Somnolencia detectada en el video';
      default: return 'Posible somnolencia detectada';
    }
  }
}

export const alertService = new AlertService();