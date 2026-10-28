import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCameraPermissions } from 'expo-camera';
import { useEffect, useState } from 'react';
import { Linking, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = NativeStackScreenProps<any, 'Permissions'>;

export const PermissionsScreen = ({ navigation }: Props) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [, requestCameraPermission] = useCameraPermissions();

  useEffect(() => {
    (async () => {
      const { granted } = await requestCameraPermission();
      setHasPermission(granted);
      if (granted) navigation.replace('Detection');
    })();
  }, [navigation, requestCameraPermission]);

  if (hasPermission === null) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.text}>Solicitando permisos...</Text>
      </SafeAreaView>
    );
  }

  if (hasPermission === false) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}> Permiso de cámara requerido</Text>
          <Text style={styles.subtitle}>Necesitamos tu cámara para detectar somnolencia.</Text>
          <TouchableOpacity style={styles.button} onPress={() => Linking.openSettings()}>
            <Text style={styles.buttonText}>Abrir Configuración</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', justifyContent: 'center', alignItems: 'center' },
  content: { paddingHorizontal: 24, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 16 },
  subtitle: { fontSize: 16, color: '#94a3b8', textAlign: 'center', marginBottom: 32 },
  text: { color: '#fff', fontSize: 16 },
  button: { backgroundColor: '#3b82f6', paddingVertical: 14, paddingHorizontal: 32, borderRadius: 12 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});