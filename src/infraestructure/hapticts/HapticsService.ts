import { Platform, Vibration } from 'react-native';

class HapticsService {
  private readonly ALERT_PATTERN = [0, 500, 200, 500, 200, 500];

  triggerAlert(): void {
    console.log('Vibrando alerta');
    Vibration.vibrate(this.ALERT_PATTERN, Platform.OS === 'android');
  }

  stopAlert(): void {
    Vibration.cancel();
  }
}

export const hapticsService = new HapticsService();