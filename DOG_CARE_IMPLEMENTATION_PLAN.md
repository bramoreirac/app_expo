# Dog Care App — Implementation Plan

**Baseline:** [Dog feeding and vaccination specification](dog_feeding_vaccination_spec_nicaragua.md)  
**App:** Expo SDK 57, React Native, Android first  
**Product language:** Spanish; dates shown as `DD/MM/YYYY`, stored as ISO dates; Nicaragua time zone (`America/Managua`).

The work has **two main sprints**. Item 3 is a follow-on phase after the two sprints: it turns the static vaccine guide into a personal schedule with reminders.

## Shared groundwork

1. Replace the current demo screen, Expo logo, and student-project presentation with the dog-care layout described below. The existing dark/green palette and JetBrains Mono were chosen for the demo; they are not constraints on the new design.
2. Define separate data types for dog profile, dated weight/BCS measurements, food, feeding calculation, vaccine administration, vaccine recommendation, and reminder. A recommendation must never be stored or displayed as an administered dose.
3. Establish input validation, Spanish wording, and the app disclaimer. Show the bite/scratch emergency guidance prominently in the vaccine area.
4. Keep calculation and scheduling rules outside screen components so they can be tested and updated. Record the rule version and source with clinical guidance. Decide local persistence before the first saved profile; the app should remain useful offline.

## Dog-friendly layout and visual direction

These proposals use the project's `ui-ux-pro-max` skill (its **Pet Tech App**, **Veterinary Clinic**, color, and React Native guidance) as a design starting point. The generated landing-page/storytelling patterns do not fit a utility app, so the app will use simple task-based navigation instead.

### Identity and design system

- Aim for **warm, approachable, and trustworthy**: soft rounded cards and controls, a restrained paw/dog illustration or silhouette, and clear health information. Avoid toy-like decoration around medical warnings and numerical results.
- Replace the demo colors with a **light warm-neutral base**, caring teal for primary actions, and a small warm orange accent for friendly highlights. Reserve red/amber for urgent or caution states. Define semantic tokens (`background`, `surface`, `text`, `primary`, `warning`, `danger`, `border`) and check actual foreground/background contrast before finalizing hex values. A dark theme can be designed as a separate matching theme later.
- Replace JetBrains Mono as the overall font with a friendlier, readable family. The skill suggests **Varela Round** for headings and **Nunito Sans** for body text; verify Spanish accents, Android rendering, and large-text behavior before adopting them. Use tabular numbers or a monospaced style only for measurements and dates where alignment helps.
- Use one consistent outline icon family for **dog/profile**, **food bowl**, **vaccine/health**, and **reminders**. Give every icon-only control an accessible name; do not use emoji as navigation icons. Create or select a dog-themed app icon and splash asset before the next APK release.
- Use a 4/8 dp spacing scale, generous card padding, rounded corners, and subtle elevation. Keep one clear primary action per screen and show pressed, disabled, loading, success, and error states.

### Information architecture and screen sketches

| Area | Main content | Primary action |
|---|---|---|
| **Inicio** | Dog identity card, latest feeding estimate, vaccine-guide entry, and later the next verified-record reminder | Continue the most relevant task |
| **Perfil** | Name, age confidence, dated weight/BCS, health flags, clinic; edit in small sections | Save profile |
| **Alimentación** | Short guided form → result card with kcal, food grams when known, treats, meals, and review advice | Calculate estimate |
| **Vacunas** | General antigen guide grouped by puppy/adult/risk-based topics; clear source/review date and emergency help | Read a vaccine topic |
| **Recordatorios** *(follow-on)* | Upcoming/due/overdue list tied to verified records; notification and calendar controls | Plan a veterinarian visit |

- Use a bottom navigation bar with **Inicio, Alimentación, Vacunas, Perfil** (four destinations). Open details, forms, and vaccine topics within their sections. Add **Recordatorios** as a fifth destination only when that feature exists; until then, do not show a dead tab. Use standard back behavior and preserve form values when returning from a detail screen.
- On **Inicio**, place the dog card first, then two large task cards: **Calcular alimento** and **Consultar vacunas**. Show the emergency entry as a clearly labeled action available from vaccine content, rather than blending it into routine cards.
- For **Alimentación**, split the long intake into readable groups (dog/health, food label, treats/meals). Use persistent field labels, examples for units, short helper text, and inline errors next to the field. Put results in a distinct summary card with the “estimación inicial” label and a visible veterinary-review state when needed.
- For **Vacunas**, use text status chips and dates rather than color alone. The general schedule must say **guía general**; in the reminder phase, **dosis verificada**, **registro sin verificar**, **cita sugerida**, and **requiere revisión veterinaria** remain separate states.
- Use real Spanish copy in mockups and testing. Fit small Android screens without horizontal scrolling; respect status/navigation safe areas and keyboard space. Allow text to wrap under larger system font sizes.

### Design checkpoint before implementation

1. Make low-fidelity phone wireframes for Inicio, Perfil, Alimentación form/results, and Vacunas (plus Recordatorios when that phase begins).
2. Build a compact component set: app header, bottom tabs, dog card, action card, labeled field, status chip, result card, caution banner, and emergency banner.
3. Check text contrast (at least 4.5:1 for normal text), Android touch targets (at least 48 × 48 dp), visible press feedback, screen-reader labels/order, reduced-motion behavior, and small/large phone layouts. Test the form with the keyboard open and enlarged text.
4. Review the clinical hierarchy with a veterinarian: friendly visuals must never obscure “consult a veterinarian” or urgent MINSA guidance.

## Sprint 1 — Feeding calculator

**Goal:** Give an apparently healthy dog's owner a clearly labeled starting estimate for daily energy and measured food portions.

### Build

1. Dog profile and feeding form: name; age or estimated age; weight and measurement date; BCS (1–9); growth stage; neuter status; activity; health and muscle-loss flags; food label energy (`kcal/kg` or `kcal/100 g`); treats and other calories; meals per day.
2. Pure calculation module: `RER = 70 × weight_kg^0.75`; choose one applicable starting factor from the specification; calculate target kcal/day, treat share, main-food kcal/day, grams/day, and grams/meal when food density is known.
3. Results screen: show the input summary, factor used, rounded display values, and a reminder to recheck weight and BCS. Keep unrounded values for calculation. Label the output **estimación inicial**, not a prescription.
4. Safety states: reject zero/negative weight or energy density and invalid meal counts; show kcal without grams when density is missing; warn when treats/extras exceed 10%; route BCS ≤3 or ≥7, illness, pregnancy/lactation, muscle loss, therapeutic diets, or unusual weight change to veterinary review. Do not generate a routine weight-loss target from current weight alone.
5. Save dated measurements and calculation inputs/results locally so a later review can compare changes without silently replacing the earlier plan.
6. Implement the new Inicio, Perfil, and Alimentación layouts with the shared design components; replace the demo branding and confirm that results remain readable with large text.

### Done when

- Luna's reference case yields about **722 kcal/day**, **195 g/day**, and **97–98 g per meal** with the specified food and treats.
- The specification's invalid-input, missing-density, >10% treats, and BCS 8/9 checks produce the expected states.
- The Android screen is usable in Expo Go, and the calculation module's boundary cases are tested.
- A user can reach the calculator from Inicio, complete it with one hand on a small Android phone, correct an invalid field in place, and return without losing entered values.

## Sprint 2 — Static vaccine guide

**Goal:** Replace generic vaccine advice with a clear, Spanish educational schedule for Nicaragua. This sprint shows *general guidance*, not personal due dates or notifications.

### Build

1. Antigen-level guide for CDV, CAV-2, CPV, rabies, leptospirosis, and risk-based vaccines. Explain common combination labels without guessing antigens from names such as “5 en 1”.
2. Static life-stage schedule from the specification: puppy primary series, adult boosters, and topics that require a veterinarian or current product/campaign instructions. Make rabies eligibility and uncertain history explicit review states.
3. Clear status labels: **guía general**, **cita sugerida**, and **dosis registrada/verificada** are distinct. In this sprint, do not display a dog as vaccinated or protected merely because a schedule appears on screen.
4. Emergency guidance for a bite, scratch, or suspected rabies exposure; direct the person to wash the area and seek urgent MINSA care. Link or cite the specification's sources and show the content review date.
5. Prepare the vaccine record schema and screen flow for the next phase, including antigen set, administration date, clinic/campaign, certificate, and verification status. Do not derive a personal due date until record verification and schedule rules are implemented.
6. Apply the shared visual components to the vaccine guide; make general guidance, caution, and emergency actions visually and verbally distinct.

### Done when

- A new owner can read the schedule offline and distinguish guidance from proof of vaccination.
- The puppy example in the specification is never presented as a completed series after its 12-week dose.
- Unknown history, product-dependent rabies timing, and emergency exposure lead to the appropriate review or urgent-care message.
- The guide remains legible with large system text, and a screen reader announces the full meaning of each status without relying on color or icons.
- A Nicaragua-licensed veterinarian reviews the Spanish clinical wording before public release; current MINSA/IPSA requirements receive local regulatory review.

## Follow-on phase (item 3) — Personal schedule and reminders

**Goal:** Use verified vaccination records to calculate suggested visit dates, then notify the owner. This starts after Sprint 2 and can be broken into smaller releases.

1. **Records and date logic:** Enter/import administration records with certificate/source and verification status; retain edits and prevent duplicate events. Calculate antigen-specific next dates only from eligible records, including puppy ≥16-week boundary, leptospirosis series, annual rabies rule, certificate/clinician earlier limits, and 29 February convention. Uncertain or overdue histories go to veterinary review. Campaign dates must never postpone an individual due date.
2. **In-app reminders:** First show a persistent list of upcoming, due, overdue, and veterinary-review items. Allow the owner to mark an appointment scheduled without marking a dose administered. Recalculate and remove obsolete reminders after a verified record or clinician override.
3. **Device notifications:** Add opt-in local notifications for dates such as 30 days, 7 days, due day, and 7 days overdue (short puppy series: 7 days and due day). Let the owner choose a time. Handle permission denial, date changes, phone restart, duplicate scheduling, and offline use. Treat these as reminders, not guaranteed alarm-clock alerts. Verify behavior on the built Android app.
4. **Calendar option:** Offer an explicit **Add to calendar** action. The simplest first version opens a prefilled system calendar event that the owner confirms; check Expo Calendar's current SDK requirements and test with a development/production build. A direct Google Calendar sync would be a later opt-in integration requiring Google authorization, duplicate/update handling, and a privacy review.
5. **Reminder experience:** Add Recordatorios to the bottom navigation only when working. Show one understandable next action per reminder, a plain reason for its date, and a separate path to view the underlying verified record. Request notification/calendar permission in context when the owner enables that feature.

**Recommended order:** in-app list → local notifications → user-confirmed calendar event → optional Google account sync. This delivers useful offline reminders before adding account integration.

### Done when

- Luna's verified records produce the specification's reference dates; the puppy example still requires a qualifying final viral dose and veterinarian confirmation for rabies.
- An unverified recollection or duplicate import does not advance a date or mark a dog vaccinated.
- Rescheduling or verifying a dose updates/cancels associated reminders without duplicates; denied notification permission leaves the in-app list usable.
- Leap-day, campaign, overdue, and bite-exposure acceptance checks pass on Android.

## Release checkpoints

- After each sprint: test on an Android phone, check small-screen readability and Spanish text, and create a new APK only when the milestone is ready. An existing APK will not gain new features automatically.
- Before any public clinical release: obtain veterinary and local regulatory review required by the baseline specification. Keep source links, rule versions, review dates, and an update path for campaigns and product-specific rules.
- The schedule module provides visit-planning guidance only. It does not diagnose illness, prescribe a diet, determine vaccine dose or injection technique, certify immunity, or replace a veterinarian or MINSA instructions.

## Technical references for the follow-on phase

- [Expo SDK 57 notifications](https://docs.expo.dev/versions/v57.0.0/sdk/notifications/)
- [Expo SDK 57 calendar](https://docs.expo.dev/versions/v57.0.0/sdk/calendar/) — current documentation says the calendar module needs a development build rather than Expo Go.
- [Google Calendar event creation](https://developers.google.com/workspace/calendar/api/guides/create-events) — for a later authenticated sync, if chosen.
