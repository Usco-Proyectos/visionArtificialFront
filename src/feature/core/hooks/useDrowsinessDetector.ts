import { useCallback, useEffect, useRef, useState } from 'react';
import { BackendResponse, drowsinessApi } from '../../../api/drowsinessApi';
import { CAMERA_FPS } from '../../../constants/contanst';

export interface DetectionState {
  veredicto: number;
  reglaActivada: string;
  rostroDetectado: boolean;
  fpsBackend: number;
  latenciaMs: number;
  conectado: boolean;
  probOjoDer: number;
  probOjoIzq: number;
  probBostezo: number;
  probSomnolencia: number;
  m3Estado: string;
  m3FramesValidos: number;
  m1FramesSeguidos: number;
}

const initialState: DetectionState = {
  veredicto: 0, reglaActivada: 'BASE', rostroDetectado: false,
  fpsBackend: 0, latenciaMs: 0, conectado: false,
  probOjoDer: 0, probOjoIzq: 0, probBostezo: 0, probSomnolencia: 0,
  m3Estado: 'sin_ventana', m3FramesValidos: 0, m1FramesSeguidos: 0,
};

export const useDrowsinessDetector = () => {
  const [state, setState] = useState<DetectionState>(initialState);
  const lastFrameTime = useRef(0);
  const intervalMs = 1000 / CAMERA_FPS;
  const mountCount = useRef(0);

  useEffect(() => {
    mountCount.current += 1;
    console.log(`🔌 useDrowsinessDetector MONTADO (vez #${mountCount.current})`);

    drowsinessApi.connect(
      (data: BackendResponse) => {
        setState({
          veredicto: data.veredicto,
          reglaActivada: data.regla_activada,
          rostroDetectado: data.rostro_detectado,
          fpsBackend: data.rendimiento.fps_backend,
          latenciaMs: data.rendimiento.latencia_ms,
          conectado: true,
          probOjoDer: data.modelos.m1?.prob_der ?? 0,
          probOjoIzq: data.modelos.m1?.prob_izq ?? 0,
          probBostezo: data.modelos.m2?.prob ?? 0,
          probSomnolencia: data.modelos.m3?.prob ?? 0,
          m3Estado: data.modelos.m3?.estado ?? 'sin_ventana',
          m3FramesValidos: data.modelos.m3?.frames_validos ?? 0,
          m1FramesSeguidos: data.modelos.m1?.frames_seguidos ?? 0,
        });
      },
      (connected) => {
        console.log(`📶 Estado de conexión: ${connected ? 'CONECTADO' : 'DESCONECTADO'}`);
        setState((prev) => ({ ...prev, conectado: connected }));
      }
    );

    // ⭐ CLEANUP con log
    return () => {
      console.log(`🔌 useDrowsinessDetector DESMONTADO (desconectando WS)`);
      drowsinessApi.disconnect();
    };
  }, []);

  const sendFrame = useCallback((base64: string) => {
    const now = Date.now();
    if (now - lastFrameTime.current < intervalMs) return;
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    drowsinessApi.sendFrame(bytes.buffer);
    lastFrameTime.current = now;
  }, [intervalMs]);

  return { state, sendFrame };
};