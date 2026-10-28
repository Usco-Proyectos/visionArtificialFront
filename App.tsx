import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DetectionProvider } from './src/context/DetectionContext';
import { PermissionsScreen } from './src/feature/configuration/screen/PermissionsScreen';
import { DetectionScreen } from './src/feature/core/screen/DetectionScreen';
import { HomeScreen } from './src/feature/users/screen/HomeScreen';

type RootStackParamList = {
  Home: undefined;
  Permissions: undefined;
  Detection: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <DetectionProvider key="detection-provider-root">
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Permissions" component={PermissionsScreen} />
          <Stack.Screen name="Detection" component={DetectionScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </DetectionProvider>
  );
}