const test = require('node:test');
const assert = require('node:assert/strict');
const guide = require('./src/content/vaccineGuide');

test('every topic is general guidance or requires veterinarian review', () => {
  const rows = [...guide.PUPPY_SCHEDULE, ...guide.ADULT_SCHEDULE];
  assert.ok(rows.length >= 8);
  assert.ok(rows.every((item) => ['general', 'vet_review'].includes(item.status)));
  assert.ok(rows.every((item) => item.sources.length > 0));
  const knownSources = new Set(guide.SOURCES.map((source) => source.id));
  assert.ok([...rows, ...guide.ANTIGENS].every((item) => item.sources.every((id) => knownSources.has(id))));
});

test('puppy guide preserves the 16-week boundary and product-specific rabies review', () => {
  const viral = guide.PUPPY_SCHEDULE.find((item) => item.id === 'viral-repeat');
  const rabies = guide.PUPPY_SCHEDULE.find((item) => item.id === 'rabies-first');
  assert.match(viral.text, /16 semanas/);
  assert.match(viral.text, /12 semanas no completa/);
  assert.equal(rabies.status, 'vet_review');
  assert.match(rabies.text, /no fija una fecha/);
});

test('urgent exposure guidance directs immediate washing and MINSA care', () => {
  assert.match(guide.EMERGENCY_GUIDANCE, /Lava.*agua y jabón/);
  assert.match(guide.EMERGENCY_GUIDANCE, /atención urgente.*MINSA/);
});
