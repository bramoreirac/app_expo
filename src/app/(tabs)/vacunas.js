import { useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Body, Card, Heading, Notice, Screen } from '../../components/UI';
import { colors, fonts } from '../../theme';
import { displayDate } from '../../lib/dates';

const { GUIDE_VERSION, SOURCES_CONSULTED_ON, EMERGENCY_GUIDANCE, SOURCES, PUPPY_SCHEDULE, ADULT_SCHEDULE, ANTIGENS } = require('../../content/vaccineGuide');
const sourceNames = Object.fromEntries(SOURCES.map((source) => [source.id, source.title.split(' · ')[0]]));

function Tag({ children, review = false }) {
  return <View style={[styles.tag, review && styles.reviewTag]} accessibilityLabel={String(children)}>
    <Text style={[styles.tagText, review && styles.reviewTagText]}>{children}</Text>
  </View>;
}

function SourceRefs({ ids }) {
  return <Text style={styles.sourceRefs}>Fuentes: {ids.map((id) => sourceNames[id]).join(', ')}</Text>;
}

function ScheduleItem({ item, initiallyOpen = false }) {
  const [open, setOpen] = useState(initiallyOpen);
  return <View style={styles.scheduleItem}>
    <Pressable onPress={() => setOpen((value) => !value)} accessibilityRole="button"
      accessibilityLabel={`${item.timing}. ${item.title}. ${item.status === 'vet_review' ? 'Confirmar con veterinario.' : 'Guía general.'}`}
      accessibilityState={{ expanded: open }} style={({ pressed }) => [styles.scheduleTrigger, pressed && styles.pressed]}>
      <View style={styles.scheduleText}>
        <Text style={styles.timing}>{item.timing}</Text>
        <Text style={styles.itemTitle}>{item.title}</Text>
      </View>
      <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={21} color={colors.primaryDark} accessibilityElementsHidden importantForAccessibility="no" />
    </Pressable>
    {open ? <View style={styles.scheduleDetail}>
      <Tag review={item.status === 'vet_review'}>{item.status === 'vet_review' ? 'Confirmar con veterinario' : 'Guía general'}</Tag>
      <Body>{item.text}</Body>
      <SourceRefs ids={item.sources} />
    </View> : null}
  </View>;
}

function AntigenItem({ antigen }) {
  return <View style={styles.antigenItem}>
    <Text style={styles.antigenName}>{antigen.name}</Text>
    <Body>{antigen.purpose}</Body>
    <SourceRefs ids={antigen.sources} />
  </View>;
}

export default function VaccinesScreen() {
  const [linkError, setLinkError] = useState('');
  async function openSource(source) {
    try { setLinkError(''); await Linking.openURL(source.url); }
    catch { setLinkError('No se pudo abrir el enlace. Comprueba tu conexión y vuelve a intentarlo.'); }
  }

  return <Screen eyebrow="Salud preventiva · Nicaragua" title="Guía de vacunas" subtitle="Calendario educativo para conversar con el veterinario. Las fechas reales dependen del historial, producto y reglas vigentes.">
    <Notice title="Si hubo una mordedura o arañazo" urgent>{EMERGENCY_GUIDANCE}</Notice>

    <Card style={styles.introCard}>
      <Tag>Guía general</Tag>
      <Heading>Una guía no es un certificado</Heading>
      <Body>Esta pantalla no determina si un perro está vacunado o protegido. Una cita sugerida tampoco equivale a una dosis aplicada. Conserva el certificado y pide al veterinario que confirme cualquier historial incompleto. El veterinario y las indicaciones actuales del MINSA/IPSA prevalecen sobre esta guía.</Body>
      <Text style={styles.reviewStatus}>Estado individual: no evaluado en esta versión.</Text>
    </Card>

    <Card>
      <View style={styles.sectionTitle}><Ionicons name="paw-outline" size={24} color={colors.primary} /><Heading>Cachorros</Heading></View>
      <Body>Los tiempos son orientativos y no sustituyen la revisión del producto ni del cachorro.</Body>
      {PUPPY_SCHEDULE.map((item) => <ScheduleItem key={item.id} item={item} initiallyOpen={item.id === 'viral-repeat' || item.id === 'rabies-first'} />)}
    </Card>

    <Card>
      <View style={styles.sectionTitle}><Ionicons name="shield-checkmark-outline" size={24} color={colors.primary} /><Heading>Adultos y refuerzos</Heading></View>
      <Body>Estos intervalos presuponen una serie primaria documentada, salvo donde se indica historial desconocido.</Body>
      {ADULT_SCHEDULE.map((item) => <ScheduleItem key={item.id} item={item} initiallyOpen={item.id === 'rabies-adult'} />)}
    </Card>

    <Card>
      <Heading>¿Qué previene cada vacuna?</Heading>
      <Text style={styles.groupLabel}>PRINCIPALES EN ESTA GUÍA</Text>
      {ANTIGENS.filter((item) => item.group === 'principal').map((item) => <AntigenItem key={item.id} antigen={item} />)}
      <Text style={styles.groupLabel}>SEGÚN RIESGO Y PRODUCTO</Text>
      {ANTIGENS.filter((item) => item.group === 'risk').map((item) => <AntigenItem key={item.id} antigen={item} />)}
      <Body>Leptospirosis es una recomendación prioritaria en esta guía, sujeta al producto disponible y a la valoración veterinaria local. Influenza canina, Lyme y otros productos no tienen aquí un calendario predeterminado para Nicaragua.</Body>
      <Notice title="Vacunas combinadas">Nombres como “5 en 1”, DA2PP o DHPP no prueban por sí solos qué antígenos recibió el perro. Revisa la etiqueta y el certificado; un producto combinado puede cubrir varios antígenos en una sola aplicación.</Notice>
    </Card>

    <Card>
      <Heading>Situaciones para revisar</Heading>
      <Body>Si hubo una reacción vacunal grave, enfermedad importante, inmunosupresión, gestación, un refuerzo muy atrasado o un historial incierto, consulta al veterinario antes de asumir una pauta.</Body>
      <Body>La vacuna de Bordetella y otras opciones respiratorias dependen del contacto con otros perros, el producto y la valoración clínica. Para viajes, verifica los requisitos actuales del IPSA y del destino; esta guía no certifica aptitud para viajar.</Body>
      <Body>Las campañas del MINSA complementan el cuidado individual. Esperar una campaña no debe aplazar una visita indicada antes por un profesional.</Body>
    </Card>

    <Card>
      <Heading>Cómo se comprobará una dosis</Heading>
      <Body>En la siguiente etapa se podrá registrar la fecha aplicada, los antígenos reales del producto, clínica o campaña, y certificado. Un recuerdo sin documento quedará “sin verificar”; una cita quedará separada de una dosis aplicada.</Body>
      <View style={styles.legendRow}><Tag>Guía general</Tag><Text style={styles.legendText}>Información educativa de esta pantalla</Text></View>
      <View style={styles.legendRow}><Tag review>Cita sugerida</Tag><Text style={styles.legendText}>Visita por planificar; no prueba vacunación</Text></View>
      <View style={styles.legendRow}><Tag>Dosis verificada</Tag><Text style={styles.legendText}>Solo con registro comprobado en una etapa futura</Text></View>
    </Card>

    <Card>
      <Heading>Fuentes y vigencia</Heading>
      <Body>Fuentes consultadas el {displayDate(SOURCES_CONSULTED_ON)}. Versión de la guía: {GUIDE_VERSION}. La revisión clínica por un veterinario en Nicaragua y la confirmación normativa local siguen pendientes antes de una publicación pública.</Body>
      {SOURCES.map((source) => <Pressable key={source.id} accessibilityRole="link" accessibilityLabel={`Abrir ${source.title}`}
        onPress={() => openSource(source)} style={({ pressed }) => [styles.sourceLink, pressed && styles.pressed]}>
        <Text style={styles.linkText}>{source.title}</Text><Ionicons name="open-outline" size={18} color={colors.primaryDark} />
      </Pressable>)}
      {linkError ? <Text style={styles.linkError}>{linkError}</Text> : null}
      <Body style={styles.disclaimer}>Esta app ofrece estimaciones educativas y recordatorios. No diagnostica enfermedades, prescribe dietas, determina dosis de vacunas ni sustituye al veterinario o las indicaciones del MINSA.</Body>
    </Card>
  </Screen>;
}

const styles = StyleSheet.create({
  introCard: { backgroundColor: colors.surfaceSoft },
  tag: { alignSelf: 'flex-start', borderRadius: 99, backgroundColor: '#D8EEE6', paddingHorizontal: 11, paddingVertical: 5 },
  tagText: { color: colors.primaryDark, fontFamily: fonts.bold, fontSize: 13 },
  reviewTag: { backgroundColor: colors.warningSoft }, reviewTagText: { color: colors.warning },
  reviewStatus: { color: colors.warning, fontFamily: fonts.bold, fontSize: 15, lineHeight: 22 },
  sectionTitle: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  scheduleItem: { borderTopWidth: 1, borderTopColor: colors.border },
  scheduleTrigger: { minHeight: 58, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', gap: 10 },
  scheduleText: { flex: 1, gap: 2 }, timing: { color: colors.primaryDark, fontFamily: fonts.bold, fontSize: 14 },
  itemTitle: { color: colors.text, fontFamily: fonts.semi, fontSize: 16, lineHeight: 23 },
  scheduleDetail: { gap: 9, paddingBottom: 14 }, pressed: { opacity: 0.72 },
  sourceRefs: { color: colors.muted, fontFamily: fonts.regular, fontSize: 13, lineHeight: 19 },
  groupLabel: { color: colors.primaryDark, fontFamily: fonts.bold, fontSize: 12, letterSpacing: 1.1, marginTop: 5 },
  antigenItem: { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 12, gap: 6 },
  antigenName: { color: colors.text, fontFamily: fonts.bold, fontSize: 17, lineHeight: 23 },
  legendRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 9 },
  legendText: { color: colors.text, fontFamily: fonts.regular, fontSize: 14, lineHeight: 20, flexShrink: 1 },
  sourceLink: { minHeight: 50, borderTopWidth: 1, borderColor: colors.border, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, paddingVertical: 8 },
  linkText: { color: colors.primaryDark, fontFamily: fonts.bold, fontSize: 15, lineHeight: 21, flex: 1, textDecorationLine: 'underline' },
  linkError: { color: colors.danger, fontFamily: fonts.semi, fontSize: 14 },
  disclaimer: { color: colors.muted, fontSize: 13, lineHeight: 19 },
});
