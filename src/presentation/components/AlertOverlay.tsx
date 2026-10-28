import { useEffect, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { alertService } from '../../domain/services/AlertService';

interface Props {
  veredicto: number;
  regla: string;
  probOjoDer: number;
  probOjoIzq: number;
  probBostezo: number;
  probSomnolencia: number;
  onContinue: () => void; 
  onExit: () => void;     
}

export const AlertOverlay = ({
  veredicto,
  regla,
  probOjoDer,
  probOjoIzq,
  probSomnolencia,
  onContinue,
  onExit,
}: Props) => {
  const [visible, setVisible] = useState(false);
  const [pulse] = useState(new Animated.Value(1));
  const [opacity] = useState(new Animated.Value(0));

  useEffect(() => {
    if (veredicto === 1) {
      setVisible(true);
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.loop(Animated.sequence([
          Animated.timing(pulse, { toValue: 1.05, duration: 600, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(pulse, { toValue: 1, duration: 600, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        ])),
      ]).start();


    } else {
      Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }).start(() => setVisible(false));
    }
  }, [veredicto]);

  const handleContinue = () => {
    Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
      setVisible(false);
    });
    onContinue();
  };

  const handleExit = () => {
    Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
      setVisible(false);
    });
    onExit();
  };

  if (!visible) return null;

  const severity = alertService.getSeverity(regla);

  return (
    <Animated.View style={[styles.overlay, { opacity }]}>
      <Animated.View style={[styles.box, { transform: [{ scale: pulse }] }]}>
        <Text style={styles.icon}></Text>
        <Text style={styles.title}>{alertService.getMessage(severity)}</Text>
        <Text style={styles.rule}>Regla: {regla}</Text>

        <View style={styles.metrics}>
          <Text style={styles.metric}> Der: {(probOjoDer * 100).toFixed(0)}%</Text>
          <Text style={styles.metric}> Izq: {(probOjoIzq * 100).toFixed(0)}%</Text>
          <Text style={[styles.metric, { color: '#ef4444' }]}>
             Somnolencia: {(probSomnolencia * 100).toFixed(0)}%
          </Text>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.btnContinue} onPress={handleContinue}>
            <Text style={styles.btnContinueText}>Continuar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnExit} onPress={handleExit}>
            <Text style={styles.btnExitText}>Salir</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    zIndex: 1000,
  },
  box: {
    backgroundColor: 'rgba(30,41,59,0.95)',
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ef4444',
    marginHorizontal: 24,
    elevation: 10,
  },
  icon: { fontSize: 56, marginBottom: 8 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#ef4444', textAlign: 'center', marginBottom: 4 },
  rule: { fontSize: 12, color: '#94a3b8', fontFamily: 'monospace', marginBottom: 16 },
  metrics: { backgroundColor: 'rgba(0,0,0,0.3)', padding: 16, borderRadius: 12, width: '100%', marginBottom: 16 },
  metric: { color: '#ffffff', fontSize: 14, fontFamily: 'monospace', marginBottom: 6 },

  // ⭐ Estilos de los botones
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  btnContinue: {
    flex: 1,
    backgroundColor: '#10b981',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnContinueText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  btnExit: {
    flex: 1,
    backgroundColor: '#ef4444',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnExitText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});