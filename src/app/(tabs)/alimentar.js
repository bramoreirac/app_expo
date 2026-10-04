import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Action, Body, Card, Choices, Field, Heading, Notice, Screen } from '../../components/UI';
import { useCare } from '../../state/CareContext';
import { calculateFeeding } from '../../lib/feeding';
import { colors, fonts } from '../../theme';
import { displayDate } from '../../lib/dates';

const yesNo = [{ label: 'Sí', value: true }, { label: 'No', value: false }];
const flags = [
  ['illness', 'Enfermedad, vómitos, diarrea o rechazo de alimento'],
  ['weightChange', 'Cambio de peso rápido o inesperado'],
  ['muscleLoss', 'Pérdida de músculo'],
  ['pregnancy', 'Gestación o lactancia'],
  ['therapeuticDiet', 'Dieta terapéutica, alergia o enfermedad crónica'],
  ['athletic', 'Actividad atlética o trabajo intenso'],
  ['medication', 'Toma medicamentos actualmente'],
  ['unknownTreats', 'No conozco las calorías de todos los premios'],
  ['multipleFeeders', 'Varias personas le dan alimento o premios'],
];

function Flag({ label, selected, onPress }) {
  return <Pressable onPress={onPress} accessibilityRole="checkbox" accessibilityState={{ checked: selected }} accessibilityLabel={label}
    style={({ pressed }) => [styles.flag, selected && styles.flagSelected, pressed && styles.pressed]}>
    <Ionicons name={selected ? 'checkbox' : 'square-outline'} size={23} color={selected ? colors.primary : colors.muted} />
    <Text style={styles.flagText}>{label}</Text>
  </Pressable>;
}

function Result({ result, measuredOn, dogName }) {
  if (result.reviewRequired) return <Card style={styles.reviewCard}>
    <Text style={styles.resultEyebrow}>Resultado · requiere revisión</Text>
    <Heading>Consulta con un veterinario</Heading>
    <Body>Los datos de {dogName || 'tu perro'} requieren un plan individual. Por seguridad, no mostramos una porción rutinaria.</Body>
    {result.reviewReasons.map((reason) => <Text key={reason} style={styles.reason}>• {reason}</Text>)}
    <Body style={styles.small}>La medición del {displayDate(measuredOn)} queda guardada para conversar con el profesional.</Body>
    <Body style={styles.small}>La app ofrece orientación educativa; no diagnostica ni prescribe una dieta.</Body>
  </Card>;

  return <Card style={styles.resultCard}>
    <Text style={styles.resultEyebrow}>Estimación inicial · {displayDate(measuredOn)}</Text>
    <Text style={styles.bigNumber}>{Math.round(result.targetKcal)} <Text style={styles.bigUnit}>kcal/día</Text></Text>
    <Body>Para {dogName || 'tu perro'}, según {result.weightKg} kg y condición corporal {result.bcs}/9.</Body>
    <View style={styles.divider} />
    <View style={styles.metricRow}><Text style={styles.metricLabel}>Energía basal (RER)</Text><Text style={styles.metricValue}>{Math.round(result.rerKcal)} kcal</Text></View>
    <View style={styles.metricRow}><Text style={styles.metricLabel}>Factor inicial</Text><Text style={styles.metricValue}>× {result.factor}</Text></View>
    <View style={styles.metricRow}><Text style={styles.metricLabel}>Premios y extras</Text><Text style={styles.metricValue}>{Math.round(result.treatKcal + result.otherKcal)} kcal</Text></View>
    <View style={styles.metricRow}><Text style={styles.metricLabel}>Alimento principal</Text><Text style={styles.metricValue}>{Math.round(result.foodKcal)} kcal</Text></View>
    {result.gramsPerDay !== null ? <View style={styles.portion}>
      <Text style={styles.portionLabel}>Porción diaria aproximada</Text>
      <Text style={styles.portionNumber}>{Math.round(result.gramsPerDay)} g</Text>
      <Text style={styles.portionDetail}>≈ {Math.round(result.gramsPerMeal)} g por comida · {result.mealsPerDay} comidas</Text>
    </View> : result.kcalPerGram === null ? <Notice title="Falta la energía del alimento">El objetivo en kcal está disponible. Para mostrar gramos, ingresa las kcal de la etiqueta del producto.</Notice> : <Notice title="Revisa premios y extras">No quedan calorías para el alimento principal. Revisa lo que recibe tu perro y consulta un plan equilibrado.</Notice>}
    {result.tooManyTreats ? <Notice title="Premios por encima del 10 %">Premios y extras representan {result.treatPercent.toFixed(1)} % de la energía estimada. Reduce los premios o consulta un plan equilibrado; no reduzcas el alimento completo indefinidamente.</Notice> : null}
    {result.multipleFeeders ? <Notice title="Coordina a quienes le dan comida">Confirma que premios, sobras y raciones de todas las personas estén incluidos en este cálculo.</Notice> : null}
    <Body style={styles.small}>Pesa el alimento con una báscula. Vuelve a revisar peso y condición corporal en 2–4 semanas si es adulto; en cachorros, con mayor frecuencia. Agua fresca siempre disponible.</Body>
    <Body style={styles.small}>Esta app ofrece estimaciones educativas y recordatorios. No diagnostica enfermedades, prescribe dietas, determina dosis de vacunas ni sustituye al veterinario o las indicaciones del MINSA.</Body>
  </Card>;
}

export default function FeedingScreen() {
  const { draft, updateDraft, plan, persistPlan, loading } = useCare();
  const [errors, setErrors] = useState({});
  const [result, setResult] = useState(null);
  const [saveError, setSaveError] = useState('');
  const [saving, setSaving] = useState(false);
  const set = (key) => (value) => { updateDraft({ [key]: value }); setResult(null); setErrors((current) => ({ ...current, [key]: undefined })); };
  const toggleFlag = (key) => {
    updateDraft({ healthFlags: { ...draft.healthFlags, [key]: !draft.healthFlags?.[key] } });
    setResult(null);
  };

  async function calculate() {
    setSaveError('');
    const calculated = calculateFeeding(draft);
    if (!calculated.ok) { setErrors(calculated.errors); setResult(null); return; }
    setErrors({});
    setResult(calculated);
    setSaving(true);
    try { await persistPlan(calculated); }
    catch { setSaveError('Se calculó la estimación, pero no se pudo guardar. Intenta de nuevo.'); }
    finally { setSaving(false); }
  }

  return <Screen eyebrow="Plan de alimentación" title="Calcula su alimento" subtitle="Usa el peso actual y las calorías reales de la etiqueta. El resultado es un punto de partida.">
    <Card><Heading>1 · Tu perro</Heading>
      <Field label="Nombre (opcional)" value={draft.name} onChangeText={set('name')} placeholder="Ej. Luna" />
      <Choices label="Etapa de vida" value={draft.stage} onChange={set('stage')} error={errors.stage}
        options={[{ label: 'Cachorro en crecimiento', value: 'puppy' }, { label: 'Adulto', value: 'adult' }]} />
      {draft.stage === 'puppy' ? <Field label="Edad aproximada (meses)" value={draft.ageMonths} onChangeText={set('ageMonths')} keyboardType="decimal-pad" placeholder="Ej. 3" error={errors.ageMonths} /> : null}
      <Field label="Peso actual (kg)" value={draft.weightKg} onChangeText={set('weightKg')} keyboardType="decimal-pad" placeholder="Ej. 12" error={errors.weightKg} />
      <Field label="Condición corporal (1–9)" value={draft.bcs} onChangeText={set('bcs')} keyboardType="number-pad" placeholder="Ej. 5" hint="4–5/9 suele ser ideal. Si no sabes el valor, pide una valoración veterinaria." error={errors.bcs} />
      <Choices label="¿Está esterilizado/a?" value={draft.neutered} onChange={set('neutered')} options={yesNo} />
      {draft.stage === 'adult' ? <Choices label="¿Tiene poca actividad o tendencia a ganar peso?" value={draft.lowActivity} onChange={set('lowActivity')} options={yesNo} /> : null}
      <Choices label="¿Su peso se ha mantenido estable?" value={draft.stableWeight} onChange={set('stableWeight')} options={yesNo} error={errors.stableWeight} />
      <Body style={styles.small}>Medición usada: {displayDate(draft.measuredOn)}. Los cálculos nuevos se guardan con la fecha actual de Nicaragua.</Body>
    </Card>

    <Card><Heading>2 · Salud</Heading><Body>Marca cualquier situación que necesite una recomendación individual.</Body>
      {flags.map(([key, label]) => <Flag key={key} label={label} selected={Boolean(draft.healthFlags?.[key])} onPress={() => toggleFlag(key)} />)}
      <Body style={styles.small}>Una condición corporal fuera de 4–5/9 también requiere revisión antes de fijar porciones.</Body>
    </Card>

    <Card><Heading>3 · Alimento y comidas</Heading>
      <Field label="Nombre del alimento (opcional)" value={draft.foodName} onChangeText={set('foodName')} placeholder="Marca y receta" />
      <Choices label="¿La etiqueta indica alimento completo y balanceado?" value={draft.foodComplete} onChange={set('foodComplete')} options={yesNo} error={errors.foodComplete} />
      <Choices label="¿El alimento corresponde a su etapa de vida?" value={draft.foodStageSuitable} onChange={set('foodStageSuitable')} options={yesNo} error={errors.foodStageSuitable} />
      <Field label="Energía de la etiqueta" value={draft.energyDensity} onChangeText={set('energyDensity')} keyboardType="decimal-pad" placeholder="Ej. 3500" hint="Busca energía metabolizable. Si no está disponible, deja este campo vacío y verás solo kcal." error={errors.energyDensity} />
      <Choices label="Unidad de la etiqueta" value={draft.energyUnit} onChange={set('energyUnit')}
        options={[{ label: 'kcal/kg', value: 'kg' }, { label: 'kcal/100 g', value: '100g' }]} />
      <Field label="Premios al día (kcal)" value={draft.treatKcal} onChangeText={set('treatKcal')} keyboardType="decimal-pad" placeholder="0" hint="Incluye galletas, masticables y premios de entrenamiento." error={errors.treatKcal} />
      <Field label="Otros alimentos al día (kcal)" value={draft.otherKcal} onChangeText={set('otherKcal')} keyboardType="decimal-pad" placeholder="0" hint="Cuenta sobras, suplementos con calorías y lo que otras personas le dan." error={errors.otherKcal} />
      <Field label="Comidas al día" value={draft.mealsPerDay} onChangeText={set('mealsPerDay')} keyboardType="number-pad" placeholder="2" error={errors.mealsPerDay} />
    </Card>

    {Object.keys(errors).length ? <Notice title="Revisa los datos">Corrige los campos señalados antes de calcular la porción.</Notice> : null}
    <Action title={saving ? 'Guardando…' : 'Calcular y guardar'} onPress={calculate} disabled={loading || saving} />
    {saveError ? <Notice title="No se guardó">{saveError}</Notice> : null}
    {result ? <Result result={result} measuredOn={draft.measuredOn} dogName={draft.name} /> : !Object.keys(errors).length && plan ? <Card><Heading>Última estimación guardada</Heading><Body>Fecha: {displayDate(plan.measuredOn)}</Body><Result result={plan.result} measuredOn={plan.measuredOn} dogName={plan.inputs?.name} /></Card> : null}
  </Screen>;
}

const styles = StyleSheet.create({
  flag: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 50, padding: 10, borderRadius: 12, borderWidth: 1, borderColor: colors.border },
  flagSelected: { backgroundColor: colors.surfaceSoft, borderColor: colors.primary }, flagText: { color: colors.text, fontFamily: fonts.semi, fontSize: 15, lineHeight: 21, flex: 1 }, pressed: { opacity: 0.7 },
  small: { color: colors.muted, fontSize: 14, lineHeight: 21 },
  resultCard: { borderColor: colors.primary, backgroundColor: '#FCFFFD' }, reviewCard: { borderColor: '#EBC58E', backgroundColor: '#FFFAEF' },
  resultEyebrow: { color: colors.primaryDark, fontFamily: fonts.bold, fontSize: 12, letterSpacing: 1, textTransform: 'uppercase' },
  bigNumber: { color: colors.primaryDark, fontFamily: fonts.heading, fontSize: 38 }, bigUnit: { fontFamily: fonts.semi, fontSize: 17 },
  divider: { height: 1, backgroundColor: colors.border }, metricRow: { flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 },
  metricLabel: { color: colors.muted, fontFamily: fonts.regular, fontSize: 15 }, metricValue: { color: colors.text, fontFamily: fonts.bold, fontSize: 15 },
  portion: { backgroundColor: colors.surfaceSoft, borderRadius: 16, padding: 17, gap: 3 },
  portionLabel: { color: colors.primaryDark, fontFamily: fonts.bold, fontSize: 15 }, portionNumber: { color: colors.primaryDark, fontFamily: fonts.heading, fontSize: 32 },
  portionDetail: { color: colors.text, fontFamily: fonts.semi, fontSize: 15 }, reason: { color: colors.warning, fontFamily: fonts.semi, fontSize: 15, lineHeight: 22 },
});
