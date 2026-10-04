# Dog Feeding and Vaccination Control — Veterinary Product Specification (Nicaragua)

**Version:** 1.0 · **Reviewed:** 2026-10-04 · **Audience:** developers, product designers, and the veterinarian who will approve clinical content.  
**Scope:** privately owned dogs in Nicaragua. This is a clinical decision-support specification, not an instruction to owners to inject vaccines or treat disease.

## 1. Clinical principles and product boundaries

1. Feeding output is an **initial estimate** for an apparently healthy dog. The owner adjusts only through regular weighing, body-condition assessment, and veterinary advice. Calorie equations are not a diagnosis or a complete diet formulation. [Merck nutritional requirements](https://www.merckvetmanual.com/management-and-nutrition/nutrition-small-animals/nutritional-requirements-of-small-animals), [AAHA feeding plans](https://www.aaha.org/resources/2021-aaha-nutrition-and-weight-management-guidelines/feeding-plans-for-healthy-appropriate-weight-cats-and-dogs/).
2. The vaccine module is a **record, schedule, reminder, and education tool**. It never calculates injection volume, concentration, route, or technique. A veterinarian or authorized campaign vaccinator follows the locally approved product label and clinical assessment. [WSAVA 2024 vaccination guidelines](https://wsava.org/wp-content/uploads/2024/04/WSAVA-Vaccination-guidelines-2024.pdf), [AAHA canine vaccination guidance](https://www.aaha.org/resources/2022-aaha-canine-vaccination-guidelines/recommendations-for-core-and-noncore-canine-vaccines/).
3. A recorded dose and a suggested appointment are different states. Never mark a dog protected, vaccinated, or legally current from a generated schedule alone.
4. A local veterinarian and current MINSA/IPSA rules take precedence over generic defaults. Store the source and version of every rule. Display unresolved history as **“Needs veterinary review”**, not “complete.”
5. If a person is bitten, scratched, or exposed to saliva through broken skin or mucosa, direct them to wash the wound immediately and seek urgent medical care at a MINSA health facility; the app must not decide whether human post-exposure prophylaxis is needed. Suspected rabies in an animal also requires immediate contact with health authorities and a veterinarian. [WHO rabies fact sheet](https://www.who.int/es/news-room/fact-sheets/detail/rabies), [MINSA Normativa 215 (2024)](https://www.minsa.gob.ni/sites/default/files/publicaciones/Normativa%2520215.pdf).

## 2. Nicaragua operating assumptions

- **Rabies:** Nicaragua's published technical standard, *Norma Técnica Obligatoria Nicaragüense para la Prevención y Control de la Rabia Urbana* (La Gaceta No. 205, 25 October 2007), states that dogs and cats receive rabies vaccination and that dogs are revaccinated **each year for life**. It mentions inactivated vaccine from one month of age and product-dependent revaccination. This is a public-health rule, **not** permission for this app to determine that a specific one-month-old puppy is eligible for a particular product. Age, product label, campaign protocol, and current authority guidance require clinician review. The newer [MINSA Normativa 215 (August 2024)](https://www.minsa.gob.ni/sites/default/files/publicaciones/Normativa%2520215.pdf) describes national companion-animal campaigns, surveillance, and follow-up, but does not provide a replacement individual dose schedule in the sections reviewed. Confirm legal status and local implementation with MINSA/IPSA before release. [Official 2007 gazette](https://legislacion.asamblea.gob.ni/gacetas/2007/10/g205.pdf).
- **Campaigns:** MINSA announced the **2026 canine rabies campaign for 3–28 August 2026**. Campaign timing is supplemental information and must not push an earlier individual due date to August. Keep campaign dates in a dated, editable source feed, never as a recurring hard-coded annual event. [MINSA 2026 campaign announcement](https://www.minsa.gob.ni/centro-de-medios/noticias/campanas-nacionales-de-vacunacion-2026-0).
- **Leptospirosis:** Treat as strongly recommended/core in the default Nicaragua plan, subject to veterinary assessment and suitable locally available product. AAHA now classifies it as core for all dogs; WSAVA treats it as core where canine disease, relevant serogroups, and suitable vaccines are established. Rain, flooding, standing water, and rodent exposure are pertinent local history. Do not claim that vaccination prevents every leptospiral infection or replaces sanitation. [AAHA guidelines](https://www.aaha.org/resources/2022-aaha-canine-vaccination-guidelines/), [WSAVA 2024](https://wsava.org/wp-content/uploads/2024/04/WSAVA-Vaccination-guidelines-2024.pdf), [MINSA regional leptospirosis study](https://www.minsa.gob.ni/sites/default/files/2022-10/Comportamiento%20epidemiol%C3%B3gico%20de%20leptospirosis%20en%20el%20municipio%20El%20Sauce%20Le%C3%B3n-Nicaragua%2C%20periodo%20comprendido%20del%202016-2018.pdf).
- **Travel/import:** Separate normal household reminders from travel eligibility. An [IPSA document for entry of dogs and cats](https://www.ipsa.gob.ni/Portals/0/5%20Cuarentena%20Agropecuaria/Requisitos%20importacion/cuarentena%20animal/requisitos%20generales/Perros%20y%20gatos.pdf) lists certificate, vaccine, and timing requirements. Because border rules can change and vary by origin/destination, show “verify current IPSA and destination rules” rather than automatically certifying travel readiness.
- **Localization:** default language Spanish; dates `DD/MM/YYYY` in display and ISO 8601 in storage; mass kg (optionally lb input converted to kg); food g and `kcal/100 g` or `kcal/kg`; timezone `America/Managua`; currency NIO only if costs are added. Keep original unit and conversion metadata. Function offline with queued reminders and later sync where connectivity is limited.

## 3. Core data model

Use stable IDs, timestamps, author/source, and audit history for clinical records. Do not silently overwrite a vaccination entry.

| Entity | Fields | Validation / meaning |
|---|---|---|
| Dog | `dog_id`, name, sex, breed/mix, date of birth or estimated age + confidence, neutered status, owner, municipality/department, household, vet clinic | Unknown age is allowed; do not fabricate a birth date. |
| Health profile | pregnancy/lactation status, diagnosed conditions, medications, allergy/reaction history, growth stage, activity, outdoor/standing-water/rodent/boarding/dog-contact exposure | Flags that may require individualized feeding or vaccine review. |
| Measurement | date/time, weight kg, nine-point BCS, muscle condition score, assessor/source, optional notes | Positive weight; BCS integer 1–9; trends require dated measurements. |
| Food product | brand/name, recipe, complete-and-balanced claim, life-stage suitability, energy density value + unit + label/photo + source date, form, serving conversion if label states it | Reject zero/negative energy density. A “cup” is unusable without product-specific `g/cup`. |
| Intake | food product, grams or measured amount, meals, treats/chews/table food and calories, other household feeders, date | Every calorie source counts; unknown treats flagged. |
| Feeding plan | weight basis, factor, RER, target kcal/day, treat budget, main-food kcal/day, grams/day, meals/day, rationale, version, clinician override, review date | Store calculations and input snapshot for reproducibility. |
| Vaccine event | antigen set, product/brand, manufacturer, lot, expiry if available, dose sequence, administered date/time, administrator/clinic/campaign, certificate/photo, verification status, adverse event | One combination product can cover several antigens, but is one administration event. |
| Vaccine recommendation | antigen, earliest date, target date, overdue state, basis, rule version, confidence, vet override, appointment status | Derived, recalculated when history changes. Never substitute for proof. |
| Reminder | linked recommendation, channel, scheduled timestamp, delivery status, snooze, local-time zone | Idempotent; suppress duplicates after a verified dose or clinician override. |

Sensitive data: minimize owner location and medical notes, require consent for notifications, secure stored documents, support export/deletion, and restrict clinical overrides by role.

## 4. Feeding assessment and calculations

### 4.1 Intake questions and triage

Ask for: age/estimated age; weight and date; BCS (guided visual 1–9); muscle loss; breed or expected adult size for growth; neuter status; activity; pregnancy/lactation; current disease or medications; whether weight is stable; exact food label calories; all treats and extras; meal count; and whether multiple people feed the dog. BCS **4–5/9 is generally ideal**; 1–3 is under ideal and 6–9 over ideal. Weight alone does not define ideal weight. [WSAVA BCS chart](https://wsava.org/wp-content/uploads/2025/06/WSAVA_BCSCat_BCSDog_Nutrition_250612.pdf), [AAHA nutrition guidelines](https://www.aaha.org/resources/2021-aaha-nutrition-and-weight-management-guidelines/home/).

If the dog is ill, vomiting, has diarrhea, refuses food, has rapid unintended weight change, has BCS ≤3 or ≥7, has muscle loss, is pregnant/lactating, or has diabetes, kidney/heart/liver disease, pancreatitis, food allergy, or a prescribed therapeutic diet, display a veterinarian review prompt and avoid presenting a routine calorie plan as definitive. For puppies, show a growth-stage estimate but require frequent reassessment. There is no universal “senior multiplier”; use BCS, muscle condition, activity, and clinical history.

### 4.2 Energy algorithm

For an apparently healthy dog:

```text
weight_kg = validated current weight in kg
RER_kcal_day = 70 × weight_kg^0.75
MER_start_kcal_day = RER_kcal_day × factor
```

Use the exponential RER equation for all body weights. The `30 × kg + 70` shortcut is valid only between about 2 and 45 kg and should not be used by the app. [Merck nutritional requirements](https://www.merckvetmanual.com/management-and-nutrition/nutrition-small-animals/nutritional-requirements-of-small-animals).

| Healthy-dog starting state | Factor | Rule |
|---|---:|---|
| Puppy under 4 months | 3.0 | Growth estimate; choose growth-appropriate complete diet. |
| Puppy 4 months and older while growing | 2.0 | Reassess as growth slows; expected adult size matters. |
| Adult, intact | 1.8 | Starting point. |
| Adult, neutered | 1.6 | Starting point. |
| Adult prone to obesity | 1.4 | Use only with BCS and weight trend review; low activity alone does not establish obesity tendency. |

Factors are from [Merck's maintenance-energy table](https://www.merckvetmanual.com/multimedia/table/daily-maintenance-energy-requirements-for-dogs-and-cats); individual needs vary substantially. Do not multiply several rows together. Working/athletic dogs and extreme heat or other exposure need veterinarian-set targets instead of invented generic multipliers. Do not apply an automatic factor from breed alone.

**Weight basis:** For BCS 4–5/9 and stable weight, use measured weight. If overweight or underweight, do not simply calculate a “weight-loss” or “weight-gain” target from current mass. Ask the veterinarian for target/ideal weight and a feeding prescription. A clinically approved weight-management plan may store its own energy target and reason. [AAHA weight management guidance](https://www.aaha.org/resources/2021-aaha-nutrition-and-weight-management-guidelines/home/).

### 4.3 Convert calories into food and meals

```text
total_treat_kcal_day = sum(each treat's kcal × quantity)
main_food_kcal_day = max(0, target_kcal_day − total_treat_kcal_day − other_known_kcal_day)
energy_kcal_g = kcal_per_kg ÷ 1000  OR  kcal_per_100g ÷ 100
food_g_day = main_food_kcal_day ÷ energy_kcal_g
food_g_per_meal = food_g_day ÷ meal_count
```

For mixed foods, allocate a calorie fraction to each complete diet first, then divide each allocated kcal by its own density. For a wet-food can, use labeled kcal/can and grams/can. For cups, use the exact product's `g/cup`; otherwise display grams only. Keep full precision internally; round displayed kcal to nearest whole kcal and food grams to an amount measurable on a kitchen scale. Recompute from unrounded values. Main complete food should provide **at least 90%** of intake, with treats and extras **at most 10%**. If treats exceed that, warn and suggest reducing treats or asking the veterinarian for a balanced plan, rather than reducing complete food indefinitely. [AAHA feeding plans](https://www.aaha.org/resources/2021-aaha-nutrition-and-weight-management-guidelines/feeding-plans-for-healthy-appropriate-weight-cats-and-dogs/), [WSAVA nutrition FAQ](https://wsava.org/wp-content/uploads/2020/01/Frequently-Asked-Questions-and-Myths.pdf).

The app should request **metabolizable energy** as labeled. Do not derive accurate kcal from protein/fat percentages alone, or assume all kibble has the same calorie density. If the label is missing, show calorie target but withhold grams/cups until the owner enters a verified density. Homemade or raw diets need veterinary nutrition review for nutrient balance and infection risk.

### 4.4 Follow-up and adjustment

- Give the initial number as a range or clearly labeled starting estimate. For adult dogs, weigh and reassess BCS after about 2–4 weeks; puppies need more frequent growth checks. Record actual intake, treats, weight, BCS, stool tolerance, and activity.
- If weight or BCS moves away from the veterinarian's goal, do not silently change the plan. Present the trend and request a reviewed adjustment; persist the old and new targets. Large or unexplained changes should trigger clinical review.
- If measured food consumption is consistently much lower than a complete food's feeding guidance, check nutritional adequacy with a veterinarian before prolonged restriction. [Merck nutritional requirements](https://www.merckvetmanual.com/management-and-nutrition/nutrition-small-animals/nutritional-requirements-of-small-animals).
- Provide fresh, clean drinking water at all times, especially in hot weather. Do not use a fixed daily water prescription for healthy dogs; disease, food moisture, temperature, and activity change need.

## 5. Vaccine catalog and owner education

Use antigen-level records because product abbreviations vary. Display common Spanish/English names.

| Antigen / common label | Plain-language purpose | Default status in Nicaragua |
|---|---|---|
| CDV — distemper / moquillo | Prevents severe systemic and neurologic viral disease | Core |
| CAV-2 — adenovirus / hepatitis infecciosa | Protects against infectious canine hepatitis caused by CAV-1 | Core |
| CPV — parvovirus / parvovirosis | Prevents severe contagious intestinal disease | Core |
| Rabies / rabia | Prevents a fatal zoonotic infection | Core; annual local reminder |
| Leptospira / leptospirosis | Reduces risk of serious zoonotic bacterial illness; match vaccine to local product and serogroups | Strongly recommended/core default, clinician confirmed |
| CPiV — parainfluenza | Respiratory pathogen; may be included in DA2PP/DHPP/DAPP | Product/risk dependent |
| Bordetella bronchiseptica | Contributes to infectious respiratory disease | Risk based: boarding, shelter, grooming, group dog contact |
| Canine influenza, Lyme, other regional products | Risk and availability dependent | No default Nicaragua schedule without local veterinary evidence |

Never infer an antigen merely from a colloquial brand name such as “5-in-1.” Enter actual label antigens. Leptospirosis may be included in a combination product. Rabies remains a separate legal/certificate record even if administered the same day. [AAHA core/noncore table](https://www.aaha.org/resources/2022-aaha-canine-vaccination-guidelines/recommendations-for-core-and-noncore-canine-vaccines/), [WSAVA 2024](https://wsava.org/wp-content/uploads/2024/04/WSAVA-Vaccination-guidelines-2024.pdf).

## 6. Schedule and control logic

### 6.1 Default healthy-dog schedule

| Vaccine group | Primary course | Subsequent reminders |
|---|---|---|
| CDV/CAV/CPV combination (often DA2PP, DHPP, DAPP) | Start around **6–8 weeks**; repeat every **2–4 weeks** through a dose at **≥16 weeks**. AAHA's practical table calls for at least three doses if begun early. A veterinarian may continue to 18–20 weeks in high-risk settings. If first presented after 16 weeks with unknown/no history, AAHA table uses two doses 2–4 weeks apart; product and clinician determine final course. | One booster within a year after the initial series, then generally every 3 years for core viral antigens. |
| Leptospira | Typically two doses **2–4 weeks apart**, starting at **≥12 weeks** for the AAHA cited killed four-serovar schedule; verify the selected product's minimum age. The two-dose primary series also applies to an unvaccinated adult. | One booster within a year of primary series, then generally yearly. If long lapsed, flag for veterinary re-priming review. |
| Rabies | Due according to **current Nicaragua authority and the selected licensed product/campaign**. Do not automatically set the first visit at one month solely from the 2007 standard. | Local default: **annually**, counted from last verified administration, with a field for certificate expiry/earlier product-specific limit. |
| Bordetella/other risk-based | Product route, age, and schedule vary. | Only from a veterinarian-approved product/risk plan. |

The above is based on [AAHA's canine table](https://www.aaha.org/resources/2022-aaha-canine-vaccination-guidelines/recommendations-for-core-and-noncore-canine-vaccines/) and [WSAVA 2024](https://wsava.org/wp-content/uploads/2024/04/WSAVA-Vaccination-guidelines-2024.pdf), with Nicaragua rabies handling from the [2007 official standard](https://legislacion.asamblea.gob.ni/gacetas/2007/10/g205.pdf). The schedule is a **visit-planning prompt**, not a guarantee of immunity.

### 6.2 Date algorithm

1. Normalize each verified administration into antigen records while retaining the parent product event. Store local calendar date and exact timestamp if known.
2. If age or history is uncertain, show **“Schedule to confirm with veterinarian”**. Do not place a dog into “fully vaccinated” based on owner memory alone.
3. For an active primary series, calculate `earliest_next = last_dose_date + 14 days` and `target_next = last_dose_date + 21–28 days`, constrained by product minimum age and the need for a final CDV/CAV/CPV puppy dose at ≥16 weeks. Do not claim that any extra dose given before 16 weeks completes the puppy course.
4. For leptospirosis, do not mark primary complete until two qualifying doses are documented 2–4 weeks apart, unless a clinician overrides for a product-specific regimen.
5. For annual rabies, calculate `anniversary = last_verified_date + 1 calendar year`; `due_date = earlier_of(anniversary, certificate_expiry_if_earlier, clinician_date_if_earlier)`. Use calendar-year logic for 29 February (choose 28 February in non-leap years and document that convention). Never assume a 3-year product label overrides Nicaragua's annual default.
6. For other completed series, use antigen-specific booster rules and product/clinician override. Distinguish `earliest`, `recommended`, and `overdue`; a missed date does not imply the app knows whether a full course must be restarted.
7. Recalculate after verified record import, date correction, or vet override. Keep an audit log and prevent duplicate event imports.

Suggested reminders: 30 days before due, 7 days before, on due date, and 7 days overdue; for a short puppy series, 7 days before and on due date. The owner can adjust notifications. Never send “vaccinated” or “protected” merely because an appointment was booked. Respect the dog's municipality and `America/Managua` date boundary.

### 6.3 Safety and exception states

- **Previous severe vaccine reaction, current significant illness, immunosuppression, pregnancy, very young age, or product contraindication:** veterinarian review before scheduling/administration; no generic exemption or blanket cancellation.
- **Bite or suspected rabies exposure:** urgent human medical/public-health and veterinary workflow, independent of whether the dog shows “current” in the app. Do not offer home observation as a substitute for official instructions. [MINSA Normativa 215](https://www.minsa.gob.ni/sites/default/files/publicaciones/Normativa%2520215.pdf).
- **Unknown/fragmented records:** request certificate or clinic confirmation. For a rescued adult, offer a vet visit to establish catch-up; no fabricated prior dates.
- **Missed lepto or noncore booster:** clinician determines whether two-dose re-priming is needed; WSAVA recommends restarting these after a long lapse. [WSAVA 2024](https://wsava.org/wp-content/uploads/2024/04/WSAVA-Vaccination-guidelines-2024.pdf).
- **Vaccination during MINSA campaign:** enter product/date/certificate and close the individual reminder only after verification. Campaign dates are not a reason to delay an overdue dog.
- **Vaccines given abroad:** retain foreign certificate, brand, date, and source; local clinician determines acceptance for Nicaragua and travel.

## 7. Screens and owner-facing wording

1. **Dog profile:** name, approximate age option, weight/BCS, health flags, clinic, location.
2. **Feeding:** “Starting daily energy estimate,” exact food grams per day and per meal only when density is known, treat calories, weight trend, last review date, and reason for any clinician override.
3. **Vaccines:** antigen checklist; `recorded`, `record needs verification`, `due soon`, `overdue`, `vet review needed`; link to certificate and last dose; plain explanation of disease.
4. **Reminders:** actionable “Book a veterinarian or MINSA campaign visit for rabies by 10/01/2027,” never “Give 1 mL rabies vaccine.”
5. **Emergency banner:** “If someone was bitten or scratched, wash the area and seek urgent care at a MINSA health center. Contact a veterinarian and follow public-health instructions for the animal.”

Default disclaimer, shown at onboarding and with clinical estimates: **“This app provides educational estimates and reminders. It does not diagnose disease, prescribe a diet, determine vaccine doses, or replace a veterinarian or MINSA instructions.”**

## 8. Worked reference case and acceptance checks

**Case A — healthy adult feeding and annual control.** On 04/10/2026, “Luna” is a neutered adult dog, 12.0 kg, stable weight, BCS 5/9, normal muscle condition, with no known illness. Her complete adult dry food lists **3,500 kcal/kg**. She receives **40 kcal/day** in treats. Two meals/day. Verified records: rabies 10/01/2026; CDV/CAV/CPV combination booster 01/06/2026; leptospirosis annual booster 01/06/2026. Primary series are documented complete.

```text
RER = 70 × 12.0^0.75 = 451.3 kcal/day
MER start = 451.3 × 1.6 = 722.1 kcal/day
Treat fraction = 40 / 722.1 = 5.5%  (within 10% budget)
Food allowance = 722.1 − 40 = 682.1 kcal/day
Density = 3,500 / 1,000 = 3.5 kcal/g
Food = 682.1 / 3.5 = 194.9 g/day ≈ 195 g/day
Two meals = 97.4 g/meal ≈ 97–98 g/meal
```

Expected vaccine output: rabies **10/01/2027** (or earlier documented certificate/clinician limit); leptospirosis **01/06/2027**; CDV/CAV/CPV approximately **01/06/2029** under the three-year rule. The 2026 MINSA campaign is shown as historical and does not replace her individual rabies anniversary. The feeding view labels 722 kcal and 195 g as a starting estimate, with a weight/BCS review in 2–4 weeks.

**Case B — puppy boundary test.** Puppy born 01/07/2026; verified CDV/CAV/CPV doses on 26/08/2026 (8 weeks) and 23/09/2026 (12 weeks). On 04/10/2026 it is about 13 weeks old. The app must **not** mark the core viral puppy series complete. It should plan a veterinarian visit in the next 2–4-week interval with a qualifying final dose at **≥16 weeks** (on or after 21/10/2026), subject to the veterinarian's selected visit date/product. If leptospirosis first dose is recorded 23/09/2026, the second is due 07/10–21/10/2026. Rabies remains **“confirm product/campaign eligibility with veterinarian”** unless a verified dose exists. A prior dose at 12 weeks cannot make the puppy “fully vaccinated.”

**Required acceptance checks:** invalid `0 kg` or `0 kcal/kg` cannot calculate portions; missing food density shows kcal but not grams; treats >10% warn; BCS 8/9 routes to weight-management review; a duplicate vaccine record does not advance due date twice; imported owner recollection without documentation remains unverified; 29 February rabies anniversary follows the documented convention; campaign date never delays individual rabies due date; suspected bite overrides routine reminder UI with urgent guidance.

## 9. Content governance and references

Before production, have a Nicaragua-licensed veterinarian review the clinical text and a local regulatory expert confirm the current legal effect of the 2007 rabies standard, 2024 MINSA Normativa 215, and any later rules. Recheck MINSA campaign dates every year, IPSA travel requirements when travel is requested, and vaccine product labels at entry. Store `reviewed_at`, `reviewer`, source URL, and rule version; expire unreviewed campaign data.

Key primary references: [Merck Veterinary Manual, energy equations](https://www.merckvetmanual.com/management-and-nutrition/nutrition-small-animals/nutritional-requirements-of-small-animals); [Merck maintenance factors](https://www.merckvetmanual.com/multimedia/table/daily-maintenance-energy-requirements-for-dogs-and-cats); [AAHA 2021 nutrition guidelines](https://www.aaha.org/resources/2021-aaha-nutrition-and-weight-management-guidelines/home/); [WSAVA global nutrition resources](https://wsava.org/global-guidelines/global-nutrition-guidelines/); [AAHA canine vaccination guidelines](https://www.aaha.org/resources/2022-aaha-canine-vaccination-guidelines/); [WSAVA 2024 vaccination guidelines](https://wsava.org/wp-content/uploads/2024/04/WSAVA-Vaccination-guidelines-2024.pdf); [Nicaragua official rabies standard (2007)](https://legislacion.asamblea.gob.ni/gacetas/2007/10/g205.pdf); [MINSA Normativa 215 (2024)](https://www.minsa.gob.ni/sites/default/files/publicaciones/Normativa%2520215.pdf); [MINSA 2026 campaign announcement](https://www.minsa.gob.ni/centro-de-medios/noticias/campanas-nacionales-de-vacunacion-2026-0).
