// Static education: no entry here represents an administered dose or a personal due date.
const GUIDE_VERSION = 'vaccine-guide-ni-1.0';
const SOURCES_CONSULTED_ON = '2026-10-04';
const EMERGENCY_GUIDANCE = 'Lava la zona de inmediato con agua y jabón durante al menos 15 minutos y busca atención urgente en la unidad de salud MINSA más cercana. También cuenta saliva en una herida o mucosa. Contacta a un veterinario y sigue las indicaciones de salud pública para el animal.';

const SOURCES = [
  { id: 'aaha', title: 'AAHA · Guía de vacunación canina', url: 'https://www.aaha.org/resources/2022-aaha-canine-vaccination-guidelines/recommendations-for-core-and-noncore-canine-vaccines/' },
  { id: 'wsava', title: 'WSAVA · Guía de vacunación 2024', url: 'https://wsava.org/wp-content/uploads/2024/04/WSAVA-Vaccination-guidelines-2024.pdf' },
  { id: 'minsa', title: 'MINSA · Normativa 215 (2024)', url: 'https://www.minsa.gob.ni/sites/default/files/publicaciones/Normativa%2520215.pdf' },
  { id: 'gaceta', title: 'La Gaceta · Norma de rabia urbana (2007)', url: 'https://legislacion.asamblea.gob.ni/gacetas/2007/10/g205.pdf' },
  { id: 'who', title: 'OMS · Rabia y atención tras exposición', url: 'https://www.who.int/es/news-room/fact-sheets/detail/rabies' },
  { id: 'ipsa', title: 'IPSA · Requisitos de ingreso de perros y gatos', url: 'https://www.ipsa.gob.ni/Portals/0/5%20Cuarentena%20Agropecuaria/Requisitos%20importacion/cuarentena%20animal/requisitos%20generales/Perros%20y%20gatos.pdf' },
];

const PUPPY_SCHEDULE = [
  { id: 'viral-start', status: 'general', timing: '6–8 semanas', title: 'Inicio de vacunas virales principales', text: 'El veterinario puede iniciar la serie contra moquillo (CDV), adenovirus (CAV) y parvovirus (CPV). La edad y el producto se confirman en consulta.', sources: ['aaha', 'wsava'] },
  { id: 'viral-repeat', status: 'general', timing: 'Cada 2–4 semanas', title: 'Continuar la serie viral', text: 'Las dosis se repiten hasta documentar una dosis a las 16 semanas de edad o después. Una dosis a las 12 semanas no completa por sí sola la serie. En situaciones de mayor riesgo, el veterinario puede continuar hasta las 18–20 semanas.', sources: ['aaha', 'wsava'] },
  { id: 'lepto-primary', status: 'general', timing: 'Desde 12 semanas, según producto', title: 'Leptospirosis: serie primaria', text: 'La pauta de referencia incluye dos dosis separadas por 2–4 semanas. El veterinario confirma la edad mínima y el producto disponible.', sources: ['aaha', 'wsava'] },
  { id: 'rabies-first', status: 'vet_review', timing: 'Edad y producto por confirmar', title: 'Rabia: primera aplicación', text: 'Consulta al veterinario o a la campaña autorizada. La edad elegible depende del producto, el protocolo vigente y la valoración del cachorro; esta guía no fija una fecha de primera dosis.', sources: ['gaceta', 'minsa'] },
];

const ADULT_SCHEDULE = [
  { id: 'viral-adult', status: 'general', timing: 'Tras completar la serie', title: 'Moquillo, adenovirus y parvovirus', text: 'La guía de referencia contempla un refuerzo dentro del año posterior a la serie inicial y, después, generalmente cada 3 años. Si el historial es desconocido o incompleto, el veterinario define el plan; no se supone que el perro ya está vacunado.', sources: ['aaha', 'wsava'] },
  { id: 'lepto-adult', status: 'general', timing: 'Refuerzo usualmente anual', title: 'Leptospirosis', text: 'Tras una serie primaria documentada de dos dosis, se revisa un refuerzo dentro del año y luego generalmente cada año. Un atraso prolongado requiere valoración veterinaria.', sources: ['aaha', 'wsava'] },
  { id: 'rabies-adult', status: 'vet_review', timing: 'Control local anual', title: 'Rabia', text: 'La norma nicaragüense publicada en 2007 indica revacunación anual de por vida. Confirma la regla vigente, el certificado y cualquier límite anterior indicado por el producto o el profesional. Una campaña no reemplaza una fecha individual anterior.', sources: ['gaceta', 'minsa'] },
  { id: 'unknown-adult', status: 'vet_review', timing: 'Historial desconocido', title: 'Plan de recuperación', text: 'Si faltan certificados o solo hay recuerdos del dueño, pide revisión veterinaria. La tabla de AAHA propone dos dosis virales separadas por 2–4 semanas cuando se inicia después de las 16 semanas; el producto y el profesional definen el plan real. No se inventan dosis anteriores.', sources: ['aaha', 'wsava'] },
];

const ANTIGENS = [
  { id: 'cdv', name: 'CDV · moquillo', purpose: 'Ayuda a prevenir una enfermedad viral grave que puede afectar varios órganos y el sistema nervioso.', group: 'principal', sources: ['aaha', 'wsava'] },
  { id: 'cav2', name: 'CAV-2 · adenovirus', purpose: 'Protege frente a la hepatitis infecciosa canina causada por CAV-1.', group: 'principal', sources: ['aaha', 'wsava'] },
  { id: 'cpv', name: 'CPV · parvovirus', purpose: 'Ayuda a prevenir una enfermedad intestinal grave y contagiosa.', group: 'principal', sources: ['aaha', 'wsava'] },
  { id: 'rabies', name: 'Rabia', purpose: 'Previene una infección mortal que también puede afectar a las personas. Su control sigue las normas locales.', group: 'principal', sources: ['gaceta', 'minsa', 'who'] },
  { id: 'lepto', name: 'Leptospira · leptospirosis', purpose: 'Reduce el riesgo de enfermedad grave. El producto y su cobertura deben valorarse localmente; la vacunación no sustituye el control de roedores y aguas contaminadas.', group: 'principal', sources: ['aaha', 'wsava'] },
  { id: 'cpiv', name: 'CPiV · parainfluenza', purpose: 'Participa en enfermedad respiratoria y puede estar incluida en una vacuna combinada.', group: 'risk', sources: ['aaha', 'wsava'] },
  { id: 'bordetella', name: 'Bordetella', purpose: 'Se considera según riesgo de contacto en guarderías, albergues, peluquerías o grupos de perros.', group: 'risk', sources: ['aaha', 'wsava'] },
];

module.exports = { GUIDE_VERSION, SOURCES_CONSULTED_ON, EMERGENCY_GUIDANCE, SOURCES, PUPPY_SCHEDULE, ADULT_SCHEDULE, ANTIGENS };
