import React, { createContext, useContext } from 'react';
import { DetectionState, useDrowsinessDetector } from '../feature/core/hooks/useDrowsinessDetector';

interface DetectionContextType {
  state: DetectionState;
  sendFrame: (base64: string) => void;
}

const DetectionContext = createContext<DetectionContextType | undefined>(undefined);

export const DetectionProvider = ({ children }: { children: React.ReactNode }) => {
  const { state, sendFrame } = useDrowsinessDetector();
  return (
    <DetectionContext.Provider value={{ state, sendFrame }}>
      {children}
    </DetectionContext.Provider>
  );
};

export const useDetection = () => {
  const ctx = useContext(DetectionContext);
  if (!ctx) throw new Error('useDetection debe usarse dentro de DetectionProvider');
  return ctx;
};