const FACTORS = Object.freeze({ puppyUnder4: 3, puppyGrowing: 2, adultIntact: 1.8, adultNeutered: 1.6, adultLowActivity: 1.4 });
const RULE_VERSION = 'feeding-nicaragua-1.0';

function numberFromInput(value) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value !== 'string' || !value.trim()) return null;
  const normalized = value.trim().replace(',', '.');
  if (!/^\d+(\.\d+)?$/.test(normalized)) return null;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function validateFeeding(input) {
  const errors = {};
  const weight = numberFromInput(input.weightKg);
  const bcs = numberFromInput(input.bcs);
  const ageMonths = numberFromInput(input.ageMonths);
  const meals = numberFromInput(input.mealsPerDay);
  const treats = numberFromInput(input.treatKcal);
  const extras = numberFromInput(input.otherKcal);
  const density = numberFromInput(input.energyDensity);
  if (weight === null || weight <= 0) errors.weightKg = 'Ingresa un peso mayor que 0 kg.';
  if (bcs === null || !Number.isInteger(bcs) || bcs < 1 || bcs > 9) errors.bcs = 'Elige una condición corporal de 1 a 9.';
  if (input.stage === 'puppy' && (ageMonths === null || ageMonths < 0)) errors.ageMonths = 'Ingresa la edad aproximada en meses.';
  if (!['puppy', 'adult'].includes(input.stage)) errors.stage = 'Selecciona cachorro o adulto.';
  if (!Number.isInteger(meals) || meals < 1 || meals > 8) errors.mealsPerDay = 'Ingresa entre 1 y 8 comidas al día.';
  if (treats === null || treats < 0) errors.treatKcal = 'Ingresa 0 o más kcal de premios.';
  if (extras === null || extras < 0) errors.otherKcal = 'Ingresa 0 o más kcal de otros alimentos.';
  if (String(input.energyDensity ?? '').trim() && (density === null || density <= 0)) errors.energyDensity = 'La energía del alimento debe ser mayor que 0.';
  if (input.energyUnit && !['kg', '100g'].includes(input.energyUnit)) errors.energyUnit = 'Selecciona la unidad de energía.';
  if (typeof input.foodComplete !== 'boolean') errors.foodComplete = 'Confirma si el alimento es completo y balanceado.';
  if (typeof input.foodStageSuitable !== 'boolean') errors.foodStageSuitable = 'Confirma si el alimento corresponde a su etapa de vida.';
  if (typeof input.stableWeight !== 'boolean') errors.stableWeight = 'Confirma si su peso ha estado estable.';
  return errors;
}

function calculateFeeding(input) {
  const errors = validateFeeding(input);
  if (Object.keys(errors).length) return { ok: false, errors };
  const weight = numberFromInput(input.weightKg);
  const bcs = numberFromInput(input.bcs);
  const ageMonths = numberFromInput(input.ageMonths);
  const meals = numberFromInput(input.mealsPerDay);
  const treats = numberFromInput(input.treatKcal);
  const extras = numberFromInput(input.otherKcal);
  const density = numberFromInput(input.energyDensity);
  const factor = input.stage === 'puppy' ? (ageMonths < 4 ? FACTORS.puppyUnder4 : FACTORS.puppyGrowing) : input.lowActivity ? FACTORS.adultLowActivity : input.neutered ? FACTORS.adultNeutered : FACTORS.adultIntact;
  const rerKcal = 70 * Math.pow(weight, 0.75);
  const targetKcal = rerKcal * factor;
  const nonFoodKcal = treats + extras;
  const treatPercent = nonFoodKcal / targetKcal * 100;
  const reviewReasons = [];
  const flags = input.healthFlags || {};
  if (bcs <= 3 || bcs >= 7) reviewReasons.push('La condición corporal requiere valoración veterinaria.');
  else if (bcs === 6) reviewReasons.push('Consulta con el veterinario antes de fijar una meta de peso.');
  if (flags.illness) reviewReasons.push('Hay enfermedad o síntomas actuales.');
  if (flags.weightChange) reviewReasons.push('Se reportó un cambio de peso inesperado.');
  if (flags.muscleLoss) reviewReasons.push('Se reportó pérdida de músculo.');
  if (flags.pregnancy) reviewReasons.push('Gestación o lactancia requiere un plan individual.');
  if (flags.therapeuticDiet) reviewReasons.push('Una dieta terapéutica requiere indicaciones veterinarias.');
  if (flags.athletic) reviewReasons.push('La actividad intensa requiere un objetivo individual.');
  if (flags.medication) reviewReasons.push('El uso de medicamentos requiere revisar el plan de alimentación.');
  if (flags.unknownTreats) reviewReasons.push('Faltan calorías de premios u otros alimentos.');
  if (!input.foodComplete) reviewReasons.push('El alimento no está confirmado como completo y balanceado.');
  if (!input.foodStageSuitable) reviewReasons.push('El alimento puede no corresponder a su etapa de vida.');
  if (!input.stableWeight) reviewReasons.push('El peso no está estable; se necesita una revisión del objetivo.');
  const reviewRequired = reviewReasons.length > 0;
  const tooManyTreats = treatPercent > 10;
  const foodKcal = Math.max(0, targetKcal - nonFoodKcal);
  const kcalPerGram = density === null ? null : density / (input.energyUnit === '100g' ? 100 : 1000);
  const gramsPerDay = reviewRequired || kcalPerGram === null || foodKcal <= 0 ? null : foodKcal / kcalPerGram;
  return { ok: true, ruleVersion: RULE_VERSION, weightKg: weight, bcs, factor, rerKcal, targetKcal, treatKcal: treats, otherKcal: extras, treatPercent, foodKcal, kcalPerGram, gramsPerDay, gramsPerMeal: gramsPerDay === null ? null : gramsPerDay / meals, mealsPerDay: meals, tooManyTreats, multipleFeeders: Boolean(flags.multipleFeeders), reviewRequired, reviewReasons };
}

module.exports = { FACTORS, RULE_VERSION, numberFromInput, validateFeeding, calculateFeeding };
