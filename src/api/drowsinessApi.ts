import { RECONNECT_DELAY_MS, WS_URL } from '../constants/contanst';

export interface BackendResponse {
  frame: number;
  veredicto: number;
  regla_activada: string;
  rostro_detectado: boolean;
  error?: unknown;
  modelos: {
    m1: { 
      prob_der: number; 
      prob_izq: number; 
      ojos_cerrados_frame: boolean; 
      frames_seguidos: number;  
      activo: boolean 
    };
    m2: { prob: number; bostezo: boolean };
    m3: { 
      estado: string;          
      prob: number | null; 
      prediccion: number;
      frames_en_ventana: number;   
      frames_validos: number;      
    };
    m4: { prediccion: number };
  };
  rendimiento: { fps_backend: number; latencia_ms: number };
}

type OnMessage = (data: BackendResponse) => void;
type OnStatus = (connected: boolean) => void;

class DrowsinessApi {
  private ws: WebSocket | null = null;
  private onMessage: OnMessage | null = null;
  private onStatus: OnStatus | null = null;
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
  private manualClose = false;

  connect(onMessage: OnMessage, onStatus: OnStatus): void {
    this.onMessage = onMessage;
    this.onStatus = onStatus;
    this.manualClose = false;

    try {
      this.ws = new WebSocket(WS_URL);

      this.ws.onopen = () => {
        console.log(' Conectado al backend');
        this.onStatus?.(true);
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as BackendResponse;
          console.log(' Backend:', data.veredicto, data.regla_activada);
          if (!data.error) this.onMessage?.(data);
          
           console.log(' Backend:', {
                veredicto: data.veredicto,
                regla: data.regla_activada,
                rostro: data.rostro_detectado,
                ojoDer: data.modelos?.m1?.prob_der?.toFixed(2),
                ojoIzq: data.modelos?.m1?.prob_izq?.toFixed(2),
                ojosCerrados: data.modelos?.m1?.ojos_cerrados_frame,
                framesSeguidos: data.modelos?.m1?.frames_seguidos, 
                bostezo: data.modelos?.m2?.prob?.toFixed(2),
                m3Estado: data.modelos?.m3?.estado,  
                m3FramesValidos: data.modelos?.m3?.frames_validos,  
                m3FramesVentana: data.modelos?.m3?.frames_en_ventana,  
                somnolencia: data.modelos?.m3?.prob?.toFixed(2),
                });

            this.onMessage?.(data);
        } catch (e) {
          console.error('Error parseando:', e);
        }
      };

      this.ws.onerror = (e) => console.error('WS error:', e);

      this.ws.onclose = () => {
        this.onStatus?.(false);
        if (!this.manualClose) this.scheduleReconnect();
      };
    } catch (e) {
      this.scheduleReconnect();
    }
  }

  sendFrame(data: ArrayBuffer): void {
    if (this.ws?.readyState === WebSocket.OPEN) this.ws.send(data);
  }

  disconnect(): void {
    this.manualClose = true;
    if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
    this.ws?.close();
    this.ws = null;
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimeout) return;
    this.reconnectTimeout = setTimeout(() => {
      this.reconnectTimeout = null;
      if (this.onMessage && this.onStatus) this.connect(this.onMessage, this.onStatus);
    }, RECONNECT_DELAY_MS);
  }
}

export const drowsinessApi = new DrowsinessApi();