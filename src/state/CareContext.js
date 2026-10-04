import { createContext, useContext, useEffect, useState } from 'react';
import { loadSavedCare, saveDog, saveFeedingPlan } from '../lib/storage';
import { managuaDate } from '../lib/dates';

const CareContext = createContext(null);
const initialDraft = {
  name: '', stage: '', ageMonths: '', ageApproximate: false, weightKg: '', bcs: '', neutered: false,
  lowActivity: false, stableWeight: null, healthFlags: {}, foodName: '', foodComplete: null, foodStageSuitable: null, energyDensity: '', energyUnit: 'kg',
  treatKcal: '0', otherKcal: '0', mealsPerDay: '2', measuredOn: managuaDate(),
};

function dogFromDraft(draft) {
  return { name: draft.name.trim(), stage: draft.stage, ageMonths: draft.ageMonths, ageApproximate: draft.ageApproximate, weightKg: draft.weightKg, bcs: draft.bcs, measuredOn: draft.measuredOn, neutered: draft.neutered, lowActivity: draft.lowActivity, stableWeight: draft.stableWeight, healthFlags: draft.healthFlags, foodName: draft.foodName };
}

export function CareProvider({ children }) {
  const [draft, setDraft] = useState(initialDraft);
  const [dog, setDog] = useState(null);
  const [plan, setPlan] = useState(null);
  const [measurements, setMeasurements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [storageError, setStorageError] = useState('');

  useEffect(() => {
    let active = true;
    loadSavedCare().then((saved) => {
      if (!active) return;
      setDog(saved.dog);
      setPlan(saved.plan);
      setMeasurements(saved.measurements);
      setDraft((current) => ({ ...current, ...(saved.plan?.inputs || saved.dog || {}), measuredOn: managuaDate() }));
    }).catch(() => { if (active) setStorageError('No se pudieron abrir los datos guardados en este dispositivo.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  function updateDraft(patch) { setDraft((current) => ({ ...current, ...patch })); }

  async function persistProfile() {
    const nextDog = dogFromDraft(draft);
    await saveDog(nextDog);
    setDog(nextDog);
    setStorageError('');
  }

  async function persistPlan(result) {
    const nextDog = dogFromDraft(draft);
    const measuredOn = managuaDate();
    const nextPlan = await saveFeedingPlan(nextDog, { ...draft, measuredOn }, result, measuredOn);
    updateDraft({ measuredOn });
    setDog(nextDog);
    setPlan(nextPlan);
    setMeasurements((current) => [{ measured_on: draft.measuredOn, weight_kg: result.weightKg, bcs: result.bcs }, ...current].slice(0, 10));
    setStorageError('');
    return nextPlan;
  }

  return <CareContext.Provider value={{ draft, updateDraft, dog, plan, measurements, loading, storageError, persistProfile, persistPlan }}>{children}</CareContext.Provider>;
}

export function useCare() {
  const value = useContext(CareContext);
  if (!value) throw new Error('CareProvider missing');
  return value;
}
