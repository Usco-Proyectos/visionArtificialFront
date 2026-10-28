import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = NativeStackScreenProps<any, 'Home'>;

export const HomeScreen = ({ navigation }: Props) => (
  <SafeAreaView style={styles.container}>
    <View style={styles.content}>
      <Text style={styles.title}> Detector de Somnolencia</Text>
      <Text style={styles.subtitle}>Alerta en tiempo real para conductores</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Permissions')}>
        <Text style={styles.buttonText}>Iniciar Detección</Text>
      </TouchableOpacity>
    </View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 16 },
  subtitle: { fontSize: 16, color: '#94a3b8', textAlign: 'center', marginBottom: 48 },
  button: { backgroundColor: '#3b82f6', paddingVertical: 16, paddingHorizontal: 48, borderRadius: 12, elevation: 4 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});