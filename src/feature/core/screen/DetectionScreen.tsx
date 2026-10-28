import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useCallback, useEffect, useRef } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAlertFeedback } from '../../../applications/hooks/useAlertFeedback';
import { CAMERA_QUALITY } from '../../../constants/contanst';
import { useDetection } from '../../../context/DetectionContext';
import { AlertOverlay } from '../../../presentation/components/AlertOverlay';

type Props = NativeStackScreenProps<any, 'Detection'>;

export const DetectionScreen = ({ navigation }: Props) => {
  const { state, sendFrame } = useDetection();
  const cameraRef = useRef<CameraView>(null);
  const [permission] = useCameraPermissions();
  const isActiveRef = useRef(true);  // ⭐ Flag para detener el loop al desmontar

  useAlertFeedback(state.veredicto);

  // ⭐ Loop de captura CON CLEANUP SEGURO
  const startCapture = useCallback(async () => {
    while (isActiveRef.current && cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: CAMERA_QUALITY,
          base64: true,
          skipProcessing: true,
        });
        if (photo?.base64 && isActiveRef.current) {
          sendFrame(photo.base64);
        }
      } catch (e) {
        console.log('⚠️ Error capturando:', e);
      }
      // Espera 200ms entre fotos (5 FPS)
      await new Promise((r) => setTimeout(r, 200));
    }
  }, [sendFrame]);

  useEffect(() => {
    isActiveRef.current = true;
    
    // Iniciar captura después de que la cámara esté lista
    const timer = setTimeout(() => {
      console.log('📸 Iniciando captura de fotos');
      startCapture();
    }, 1000);

    // ⭐ CLEANUP: detener el loop y desmontar limpiamente
    return () => {
      console.log('🛑 Deteniendo captura (componente desmontado)');
      isActiveRef.current = false;
      clearTimeout(timer);
    };
  }, [startCapture]);

  if (!permission?.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Sin permisos de cámara</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing="front" mode="picture" />

      <View style={styles.statusBar}>
        <View style={[styles.dot, state.conectado ? styles.on : styles.off]} />
        <Text style={styles.statusText}>
          {state.conectado ? `Conectado | ${state.fpsBackend} FPS | ${state.latenciaMs}ms` : 'Desconectado'}
        </Text>
      </View>

      <AlertOverlay
        veredicto={state.veredicto}
        regla={state.reglaActivada}
        probOjoDer={state.probOjoDer}
        probOjoIzq={state.probOjoIzq}
        probBostezo={state.probBostezo}
        probSomnolencia={state.probSomnolencia}
      />

      <TouchableOpacity style={styles.exitButton} onPress={() => navigation.replace('Home')}>
        <Text style={styles.exitText}>Salir</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  camera: { flex: 1 },
  statusBar: { position: 'absolute', top: 50, left: 16, right: 16, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)', padding: 12, borderRadius: 8 },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  on: { backgroundColor: '#10b981' },
  off: { backgroundColor: '#ef4444' },
  statusText: { color: '#fff', fontSize: 14, fontFamily: 'monospace' },
  exitButton: { position: 'absolute', bottom: 40, alignSelf: 'center', backgroundColor: 'rgba(239,68,68,0.9)', paddingVertical: 12, paddingHorizontal: 32, borderRadius: 24 },
  exitText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  text: { color: '#fff', fontSize: 16 },
});