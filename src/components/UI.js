import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fonts } from '../theme';

export function Screen({ children, title, eyebrow, subtitle }) {
  return <SafeAreaView style={styles.safe} edges={['top']}><ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
    {eyebrow ? <Text style={styles.eyebrow}>{eyebrow.toUpperCase()}</Text> : null}
    <Text style={styles.title}>{title}</Text>
    {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    {children}
  </ScrollView></SafeAreaView>;
}

export function Card({ children, style }) { return <View style={[styles.card, style]}>{children}</View>; }
export function Heading({ children }) { return <Text style={styles.heading}>{children}</Text>; }
export function Body({ children, style }) { return <Text style={[styles.body, style]}>{children}</Text>; }

export function Action({ title, onPress, secondary = false, danger = false, disabled = false, icon = null }) {
  return <Pressable onPress={onPress} disabled={disabled} accessibilityRole="button" accessibilityLabel={title}
    style={({ pressed }) => [styles.action, secondary && styles.actionSecondary, danger && styles.actionDanger, disabled && styles.actionDisabled, pressed && !disabled && styles.actionPressed]}>
    {icon ? <View style={styles.actionIcon}>{icon}</View> : null}
    <Text style={[styles.actionText, secondary && !danger && styles.actionTextSecondary]}>{title}</Text>
  </Pressable>;
}

export function Field({ label, value, onChangeText, error, hint, keyboardType = 'default', placeholder, accessibilityLabel }) {
  return <View style={styles.field}>
    <Text style={styles.label}>{label}</Text>
    <TextInput value={value} onChangeText={onChangeText} keyboardType={keyboardType} placeholder={placeholder}
      placeholderTextColor="#71847E" accessibilityLabel={accessibilityLabel || label}
      style={[styles.input, error && styles.inputError]} autoCorrect={false} />
    {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    {error ? <Text style={styles.error}>{error}</Text> : null}
  </View>;
}

export function Choices({ label, value, options, onChange, error }) {
  return <View style={styles.field}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.choiceRow}>{options.map((option) => <Pressable key={String(option.value)}
      onPress={() => onChange(option.value)} accessibilityRole="radio" accessibilityState={{ checked: value === option.value }}
      style={({ pressed }) => [styles.choice, value === option.value && styles.choiceActive, pressed && styles.choicePressed]}>
      <Text style={[styles.choiceText, value === option.value && styles.choiceTextActive]}>{option.label}</Text>
    </Pressable>)}</View>
    {error ? <Text style={styles.error}>{error}</Text> : null}
  </View>;
}

export function Notice({ title, children, urgent = false }) {
  return <View style={[styles.notice, urgent && styles.noticeUrgent]} accessibilityRole="alert">
    <Text style={[styles.noticeTitle, urgent && styles.noticeUrgentText]}>{title}</Text>
    <Text style={[styles.body, urgent && styles.noticeUrgentText]}>{children}</Text>
  </View>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 38, gap: 14, width: '100%', maxWidth: 680, alignSelf: 'center' },
  eyebrow: { color: colors.primary, fontFamily: fonts.bold, fontSize: 12, letterSpacing: 1.5 },
  title: { color: colors.text, fontFamily: fonts.heading, fontSize: 32, lineHeight: 39 },
  subtitle: { color: colors.muted, fontFamily: fonts.regular, fontSize: 16, lineHeight: 24, marginBottom: 4 },
  card: { backgroundColor: colors.surface, borderRadius: 22, padding: 20, borderWidth: 1, borderColor: colors.border, gap: 12 },
  heading: { color: colors.text, fontFamily: fonts.heading, fontSize: 21, lineHeight: 28 },
  body: { color: colors.text, fontFamily: fonts.regular, fontSize: 16, lineHeight: 24 },
  action: { minHeight: 52, borderRadius: 15, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 18, flexDirection: 'row', gap: 9 },
  actionSecondary: { backgroundColor: colors.surfaceSoft, borderWidth: 1, borderColor: colors.primary },
  actionDanger: { backgroundColor: colors.danger },
  actionDisabled: { opacity: 0.5 }, actionPressed: { opacity: 0.82 }, actionIcon: { marginRight: 2 },
  actionText: { color: '#FFFFFF', fontFamily: fonts.bold, fontSize: 16, textAlign: 'center' },
  actionTextSecondary: { color: colors.primaryDark },
  field: { gap: 6, marginTop: 4 }, label: { color: colors.text, fontFamily: fonts.bold, fontSize: 15, lineHeight: 21 },
  input: { backgroundColor: '#FFFFFF', borderWidth: 1.5, borderColor: colors.border, borderRadius: 13, minHeight: 52, paddingHorizontal: 14, color: colors.text, fontFamily: fonts.regular, fontSize: 16 },
  inputError: { borderColor: colors.danger }, hint: { color: colors.muted, fontFamily: fonts.regular, fontSize: 13, lineHeight: 19 },
  error: { color: colors.danger, fontFamily: fonts.semi, fontSize: 14, lineHeight: 20 },
  choiceRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  choice: { minHeight: 48, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 11, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.surface, justifyContent: 'center' },
  choiceActive: { backgroundColor: colors.surfaceSoft, borderColor: colors.primary }, choicePressed: { opacity: 0.7 },
  choiceText: { color: colors.text, fontFamily: fonts.semi, fontSize: 15 }, choiceTextActive: { color: colors.primaryDark, fontFamily: fonts.bold },
  notice: { borderRadius: 16, backgroundColor: colors.warningSoft, padding: 16, gap: 5 },
  noticeUrgent: { backgroundColor: colors.dangerSoft }, noticeTitle: { color: colors.warning, fontFamily: fonts.bold, fontSize: 16 }, noticeUrgentText: { color: colors.danger },
});
