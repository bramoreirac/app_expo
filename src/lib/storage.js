import * as SQLite from 'expo-sqlite';

let databasePromise;

async function database() {
  if (!databasePromise) {
    databasePromise = SQLite.openDatabaseAsync('dog-care.db').then(async (db) => {
      await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS dogs (id TEXT PRIMARY KEY NOT NULL, payload TEXT NOT NULL, updated_at TEXT NOT NULL);
        CREATE TABLE IF NOT EXISTS measurements (id TEXT PRIMARY KEY NOT NULL, dog_id TEXT NOT NULL, measured_on TEXT NOT NULL, weight_kg REAL NOT NULL, bcs INTEGER NOT NULL, created_at TEXT NOT NULL);
        CREATE TABLE IF NOT EXISTS feeding_plans (id TEXT PRIMARY KEY NOT NULL, dog_id TEXT NOT NULL, payload TEXT NOT NULL, created_at TEXT NOT NULL);
      `);
      return db;
    }).catch((error) => { databasePromise = null; throw error; });
  }
  return databasePromise;
}

function makeId() { return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`; }

export async function loadSavedCare() {
  const db = await database();
  const dog = await db.getFirstAsync('SELECT payload FROM dogs WHERE id = ?', 'primary');
  const plan = await db.getFirstAsync('SELECT payload FROM feeding_plans WHERE dog_id = ? ORDER BY created_at DESC, rowid DESC LIMIT 1', 'primary');
  const measurements = await db.getAllAsync('SELECT measured_on, weight_kg, bcs FROM measurements WHERE dog_id = ? ORDER BY measured_on DESC, created_at DESC LIMIT 10', 'primary');
  return { dog: dog ? JSON.parse(dog.payload) : null, plan: plan ? JSON.parse(plan.payload) : null, measurements };
}

export async function saveDog(dog) {
  const db = await database();
  const now = new Date().toISOString();
  await db.runAsync('INSERT OR REPLACE INTO dogs (id, payload, updated_at) VALUES (?, ?, ?)', 'primary', JSON.stringify(dog), now);
}

export async function saveFeedingPlan(dog, inputs, result, measuredOn) {
  const db = await database();
  const now = new Date().toISOString();
  const plan = { id: makeId(), dogId: 'primary', createdAt: now, measuredOn, inputs, result };
  await db.withExclusiveTransactionAsync(async (txn) => {
    await txn.runAsync('INSERT OR REPLACE INTO dogs (id, payload, updated_at) VALUES (?, ?, ?)', 'primary', JSON.stringify(dog), now);
    await txn.runAsync('INSERT INTO measurements (id, dog_id, measured_on, weight_kg, bcs, created_at) VALUES (?, ?, ?, ?, ?, ?)', makeId(), 'primary', measuredOn, result.weightKg, result.bcs, now);
    await txn.runAsync('INSERT INTO feeding_plans (id, dog_id, payload, created_at) VALUES (?, ?, ?, ?)', plan.id, 'primary', JSON.stringify(plan), now);
  });
  return plan;
}
