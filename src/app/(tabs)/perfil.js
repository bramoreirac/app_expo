import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Action, Body, Card, Choices, Field, Heading, Notice, Screen } from '../../components/UI';
import { useCare } from '../../state/CareContext';
import { displayDate } from '../../lib/dates';
import { colors, fonts } from '../../theme';
import { numberFromInput } from '../../lib/feeding';

const yesNo = [{ label: 'Sí', value: true }, { label: 'No', value: false }];

export default function ProfileScreen() {
  const { draft, updateDraft, measurements, persistProfile, resetCare, loading } = useCare();
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const set = (key) => (value) => { updateDraft({ [key]: value }); setMessage(''); setErrors((current) => ({ ...current, [key]: undefined })); };

  async function save() {
    const nextErrors = {};
    if (!draft.name.trim()) nextErrors.name = 'Escribe el nombre de tu perro.';
    if (draft.weightKg && !(numberFromInput(draft.weightKg) > 0)) nextErrors.weightKg = 'El peso debe ser mayor que 0 kg.';
    if (draft.ageMonths && !(numberFromInput(draft.ageMonths) >= 0)) nextErrors.ageMonths = 'Ingresa una edad válida en meses.';
    if (draft.bcs && !(Number.isInteger(numberFromInput(draft.bcs)) && numberFromInput(draft.bcs) >= 1 && numberFromInput(draft.bcs) <= 9)) nextErrors.bcs = 'La condición corporal debe estar entre 1 y 9.';
    if (Object.keys(nextErrors).length) { setErrors(nextErrors); setMessage('Revisa los campos señalados.'); return; }
    setSaving(true);
    try { await persistProfile(); setMessage('Perfil guardado en este dispositivo.'); }
    catch { setMessage('No se pudo guardar el perfil. Intenta de nuevo.'); }
    finally { setSaving(false); }
  }

  async function reset() {
    setResetting(true);
    try {
      await resetCare();
      setErrors({});
      setMessage('Se borraron los datos guardados en este dispositivo.');
    } catch {
      setMessage('No se pudieron borrar los datos. Intenta de nuevo.');
    } finally {
      setResetting(false);
    }
  }

  function confirmReset() {
    Alert.alert(
      '¿Borrar todos los datos?',
      'Se eliminarán el perfil, las mediciones, los cálculos de alimento y los registros de vacunas guardados en este dispositivo. Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Borrar datos', style: 'destructive', onPress: reset },
      ],
    );
  }

  return <Screen eyebrow="Datos de tu compañero" title="Perfil" subtitle="Estos datos ayudan a interpretar la estimación. Puedes corregirlos cuando cambien.">
    <Card><Heading>Datos básicos</Heading>
      <Field label="Nombre" value={draft.name} onChangeText={set('name')} placeholder="Ej. Luna" error={errors.name} />
      <Choices label="Etapa de vida" value={draft.stage} options={[{ label: 'Cachorro', value: 'puppy' }, { label: 'Adulto', value: 'adult' }]} onChange={set('stage')} />
      <Field label="Edad aproximada en meses" value={draft.ageMonths} onChangeText={set('ageMonths')} keyboardType="decimal-pad" placeholder="Ej. 24" hint="Si no conoces la fecha de nacimiento, deja la edad como aproximada." error={errors.ageMonths} />
      <Choices label="¿La edad es aproximada?" value={draft.ageApproximate} options={yesNo} onChange={set('ageApproximate')} />
      <Choices label="¿Está esterilizado/a?" value={draft.neutered} options={yesNo} onChange={set('neutered')} />
    </Card>
    <Card><Heading>Medición actual</Heading>
      <Field label="Peso (kg)" value={draft.weightKg} onChangeText={set('weightKg')} keyboardType="decimal-pad" placeholder="Ej. 12" error={errors.weightKg} />
      <Field label="Condición corporal (1–9)" value={draft.bcs} onChangeText={set('bcs')} keyboardType="number-pad" placeholder="Ej. 5" hint="4–5/9 suele ser la zona ideal. Pide ayuda veterinaria si no sabes evaluarla." error={errors.bcs} />
      <Body style={styles.small}>Fecha de próxima medición: {displayDate(draft.measuredOn)}</Body>
    </Card>
    <Card><Heading>Peso y salud</Heading>
      {draft.stage === 'adult' ? <Choices label="¿Tiene tendencia a ganar peso?" value={draft.obesityProne} options={yesNo} onChange={set('obesityProne')} /> : null}
      <Body style={styles.small}>Si hay enfermedad, gestación, pérdida de músculo o dieta prescrita, indícalo antes de calcular alimento.</Body>
    </Card>
    {message ? <Notice title={Object.keys(errors).length ? 'Revisa el perfil' : 'Estado del perfil'}>{message}</Notice> : null}
    <Action title={saving ? 'Guardando…' : 'Guardar perfil'} onPress={save} disabled={loading || saving || resetting} />
    {measurements.length ? <Card><Heading>Mediciones guardadas</Heading>{measurements.map((item, index) => <View key={`${item.measured_on}-${index}`} style={styles.measurement}><Text style={styles.measureDate}>{displayDate(item.measured_on)}</Text><Text style={styles.measureValue}>{item.weight_kg} kg · BCS {item.bcs}/9</Text></View>)}</Card> : null}
    <Card><Heading>Datos de este dispositivo</Heading>
      <Body style={styles.small}>Borra el perfil y todo el historial guardado en esta instalación de la app.</Body>
      <Action title={resetting ? 'Borrando datos…' : 'Borrar todos los datos'} danger onPress={confirmReset} disabled={loading || saving || resetting} />
    </Card>
  </Screen>;
}

const styles = StyleSheet.create({
  small: { color: colors.muted, fontSize: 14, lineHeight: 21 },
  measurement: { flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, borderTopWidth: 1, borderColor: colors.border, paddingTop: 10 },
  measureDate: { color: colors.muted, fontFamily: fonts.semi, fontSize: 14 },
  measureValue: { color: colors.text, fontFamily: fonts.bold, fontSize: 14 },
});
