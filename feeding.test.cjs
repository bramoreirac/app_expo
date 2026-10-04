const test = require('node:test');
const assert = require('node:assert/strict');
const { calculateFeeding } = require('./src/lib/feeding');

const luna = {
  stage: 'adult', weightKg: '12', bcs: '5', neutered: true, obesityProne: false,
  mealsPerDay: '2', treatKcal: '40', otherKcal: '0', foodComplete: true, foodStageSuitable: true, stableWeight: true,
  energyDensity: '3500', energyUnit: 'kg', healthFlags: {},
};

test('Luna reference calculation', () => {
  const result = calculateFeeding(luna);
  assert.equal(result.ok, true);
  assert.equal(result.factor, 1.6);
  assert.equal(Math.round(result.targetKcal), 722);
  assert.equal(Math.round(result.gramsPerDay), 195);
  assert.equal(Math.round(result.gramsPerMeal), 97);
  assert.equal(result.tooManyTreats, false);
});

test('rejects invalid weight, density and meal count', () => {
  const result = calculateFeeding({ ...luna, weightKg: '0', energyDensity: '0', mealsPerDay: '0' });
  assert.equal(result.ok, false);
  assert.ok(result.errors.weightKg);
  assert.ok(result.errors.energyDensity);
  assert.ok(result.errors.mealsPerDay);
});

test('missing density gives kcal but no grams', () => {
  const result = calculateFeeding({ ...luna, energyDensity: '' });
  assert.equal(result.ok, true);
  assert.ok(result.targetKcal > 700);
  assert.equal(result.gramsPerDay, null);
});

test('high treat share warns, while BCS 8 requires a veterinarian', () => {
  const treats = calculateFeeding({ ...luna, treatKcal: '100' });
  assert.equal(treats.tooManyTreats, true);
  const bcs = calculateFeeding({ ...luna, bcs: '8' });
  assert.equal(bcs.reviewRequired, true);
  assert.equal(bcs.gramsPerDay, null);
});

test('puppy factor changes at four months', () => {
  const three = calculateFeeding({ ...luna, stage: 'puppy', ageMonths: '3' });
  const four = calculateFeeding({ ...luna, stage: 'puppy', ageMonths: '4' });
  assert.equal(three.factor, 3);
  assert.equal(four.factor, 2);
});

test('adult obesity tendency selects 1.4 while low activity alone does not', () => {
  assert.equal(calculateFeeding({ ...luna, obesityProne: true }).factor, 1.4);
  assert.equal(calculateFeeding({ ...luna, lowActivity: true }).factor, 1.6);
  const unanswered = calculateFeeding({ ...luna, obesityProne: null, lowActivity: true });
  assert.equal(unanswered.ok, false);
  assert.ok(unanswered.errors.obesityProne);
});

test('kcal per 100 g gives the same portion as kcal per kg', () => {
  const result = calculateFeeding({ ...luna, energyDensity: '350', energyUnit: '100g' });
  assert.equal(Math.round(result.gramsPerDay), 195);
});

test('illness and an unsuitable food withhold a routine portion', () => {
  const result = calculateFeeding({ ...luna, foodStageSuitable: false, healthFlags: { illness: true } });
  assert.equal(result.reviewRequired, true);
  assert.equal(result.gramsPerDay, null);
  assert.equal(result.reviewReasons.length, 2);
});
