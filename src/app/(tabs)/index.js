import { router } from 'expo-router';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Action, Body, Card, Heading, Notice, Screen } from '../../components/UI';
import { useCare } from '../../state/CareContext';
import { colors, fonts } from '../../theme';
import { displayDate } from '../../lib/dates';

export default function HomeScreen() {
  const { dog, plan, loading, storageError } = useCare();
  const name = dog?.name || 'tu perro';
  return <Screen eyebrow="Guía canina" title={`Cuidemos a ${name}`} subtitle="Alimentación y vacunas explicadas paso a paso.">
    <Card style={styles.hero}>
      <Image source={require('../../../assets/dog_icon.jpg')} style={styles.heroImage} resizeMode="contain" accessible accessibilityLabel="Ilustración de un perro con un hueso" />
      <Text style={styles.heroTitle}>Un buen plan empieza conociéndolo</Text>
      <Body>Guarda su perfil y calcula una porción inicial con la energía indicada en su alimento.</Body>
    </Card>
    {storageError ? <Notice title="Datos no disponibles">{storageError}</Notice> : null}
    {loading ? <Body>Cargando datos guardados…</Body> : null}
    <Card>
      <View style={styles.row}><Ionicons name="restaurant-outline" size={25} color={colors.primary} /><Heading>Alimentación</Heading></View>
      {plan ? <>
        {plan.result.reviewRequired ? <Text style={styles.review}>Consultar al veterinario</Text> : <Text style={styles.value}>{Math.round(plan.result.targetKcal)} <Text style={styles.unit}>kcal/día</Text></Text>}
        <Body>Última estimación: {displayDate(plan.measuredOn)}{plan.result.reviewRequired ? ' · requiere revisión veterinaria' : ''}</Body>
      </> : <Body>Calcula las necesidades iniciales de energía y la cantidad de alimento por comida.</Body>}
      <Action title={plan ? 'Revisar cálculo' : 'Calcular alimento'} onPress={() => router.push('/alimentar')} />
    </Card>
    <Card>
      <View style={styles.row}><Ionicons name="medkit-outline" size={25} color={colors.primary} /><Heading>Guía de vacunas</Heading></View>
      <Body>Consulta el calendario general para cachorros y adultos. Esta guía no determina el estado de vacunación de tu perro.</Body>
      <Action title="Consultar vacunas" secondary onPress={() => router.push('/vacunas')} />
    </Card>
    <Card>
      <View style={styles.row}><Ionicons name="paw-outline" size={25} color={colors.primary} /><Heading>Perfil de tu perro</Heading></View>
      <Body>{dog?.name ? `${dog.name} tiene un perfil guardado en este dispositivo.` : 'Agrega nombre, etapa de vida y otros datos para personalizar la guía.'}</Body>
      <Action title={dog?.name ? 'Editar perfil' : 'Crear perfil'} secondary onPress={() => router.push('/perfil')} />
    </Card>
    <Body style={styles.disclaimer}>Esta app ofrece estimaciones educativas y recordatorios. No diagnostica enfermedades, prescribe dietas, determina dosis de vacunas ni sustituye al veterinario o las indicaciones del MINSA.</Body>
  </Screen>;
}

const styles = StyleSheet.create({
  hero: { backgroundColor: colors.surface, borderColor: '#D3E9DF' },
  heroImage: { width: 170, height: 170, alignSelf: 'center' },
  heroTitle: { color: colors.text, fontFamily: fonts.heading, fontSize: 22, lineHeight: 30 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  value: { color: colors.primaryDark, fontFamily: fonts.heading, fontSize: 32 },
  review: { color: colors.warning, fontFamily: fonts.bold, fontSize: 18 },
  unit: { color: colors.muted, fontFamily: fonts.semi, fontSize: 16 },
  disclaimer: { color: colors.muted, fontSize: 13, lineHeight: 19, marginTop: 4 },
});
