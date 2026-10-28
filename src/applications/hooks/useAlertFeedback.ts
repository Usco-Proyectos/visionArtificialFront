import { useEffect, useRef } from 'react';
import { ALERT_COOLDOWN_MS, ALERT_DURATION_MS } from '../../constants/contanst';
import { hapticsService } from '../../infraestructure/hapticts/HapticsService';

export const useAlertFeedback = (veredicto: number) => {
  const lastAlert = useRef(0);

  useEffect(() => {
    if (veredicto === 1) {
      const now = Date.now();
      if (now - lastAlert.current > ALERT_COOLDOWN_MS) {
        hapticsService.triggerAlert();
        lastAlert.current = now;
        setTimeout(() => hapticsService.stopAlert(), ALERT_DURATION_MS);
      }
    }
  }, [veredicto]);
};