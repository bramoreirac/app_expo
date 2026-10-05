import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts } from '../../theme';

const icons = { index: ['home-outline', 'home'], alimentar: ['restaurant-outline', 'restaurant'], vacunas: ['medkit-outline', 'medkit'], perfil: ['paw-outline', 'paw'] };

export default function TabLayout() {
  const { bottom } = useSafeAreaInsets();
  return <Tabs screenOptions={({ route }) => ({
    headerShown: false,
    tabBarActiveTintColor: colors.primaryDark,
    tabBarInactiveTintColor: colors.muted,
    tabBarLabelStyle: { fontFamily: fonts.bold, fontSize: 12 },
    tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border, height: 68 + bottom, paddingTop: 7, paddingBottom: 7 + bottom },
    tabBarIcon: ({ color, focused, size }) => <Ionicons name={icons[route.name]?.[focused ? 1 : 0] || 'ellipse-outline'} size={size || 23} color={color} />,
  })}>
    <Tabs.Screen name="index" options={{ title: 'Inicio' }} />
    <Tabs.Screen name="alimentar" options={{ title: 'Alimentar' }} />
    <Tabs.Screen name="vacunas" options={{ title: 'Vacunas' }} />
    <Tabs.Screen name="perfil" options={{ title: 'Perfil' }} />
  </Tabs>;
}
