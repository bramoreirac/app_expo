import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { NunitoSans_400Regular, NunitoSans_600SemiBold, NunitoSans_700Bold } from '@expo-google-fonts/nunito-sans';
import { VarelaRound_400Regular } from '@expo-google-fonts/varela-round';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CareProvider } from '../state/CareContext';
import { colors } from '../theme';

export default function RootLayout() {
  const [loaded, error] = useFonts({ NunitoSans_400Regular, NunitoSans_600SemiBold, NunitoSans_700Bold, VarelaRound_400Regular });
  if (error) throw error;
  if (!loaded) return null;
  return <SafeAreaProvider><CareProvider><StatusBar style="dark" backgroundColor={colors.background} />
    <Stack screenOptions={{ headerShown: false }} />
  </CareProvider></SafeAreaProvider>;
}
