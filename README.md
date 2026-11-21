# EPC Monitoring Dashboard · v1

Kromos Energy's plant-management platform: the EPC contractor records each plant's construction and
Kromos follows it up, inspects it and decides. v1 is the clickable preview, rebuilt from Bruno Della
Costa's ChatGPT prototype (kromos-painel-usinas) on the same stack as the Kromos task tool.

**v1 has no back end.** Every number is illustrative, nothing is saved or sent, and a reload clears
what was typed into the forms.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build into dist-web/
```

Deploy: import the GitHub repo into Vercel. `vercel.json` already sets the build command, the output
folder, the single-page rewrite and the security headers (including `noindex`).

## Stack

Same as the Kromos task tool (kromos-task-business): Vite + React 19 + TypeScript (TSX) + Tailwind v4,
deployed on Vercel. Inter is bundled with the app (the prototype named it but never loaded it).
Supabase (sign-in, database, files) comes in phase 2.

## What's in v1

| Screen | URL |
|---|---|
| Demo sign-in | `/` |
| Overview (cards, donut, alerts, plant list) | `/painel` |
| My plants | `/usinas` |
| Plant dashboard (Lighthouse 1) | `/usinas/lighthouse-1` |
| 11 pre-construction document folders → items → record | `/usinas/lighthouse-1/documentos/…` |
| 16 construction folders, each with its steps from the manual | `/usinas/lighthouse-1/obra/…` |
| Folder 2.1 forms: Planning, Support areas, Accommodation | `/usinas/lighthouse-1/obra/2-1/planejamento` etc. |
| Folder 2.2 forms: Prestart checks, Execution (numbered records) | `/usinas/lighthouse-1/obra/2-2/terreno-conferencia`, `…/terreno-execucao` |
| 2.3 Fencing: four collapsible stages, opened from inside 2.2 (no card of its own) | `/usinas/lighthouse-1/obra/2-3` |
| 2.4 Setting out and marking: 13 items to mark + item 14 occurrences (simplified management only) | `/usinas/lighthouse-1/obra/2-4/marcacao` |
| 2.5 Drainage: section records with quality management | `/usinas/lighthouse-1/obra/2-5` |
| 2.6 Foundations and bases: 8 types, records per foundation with type-specific checklists | `/usinas/lighthouse-1/obra/2-6` |
| 2.7 Cable trenches and access chambers: 4 groups, each with its own design; trench origins/destinations pick chambers | `/usinas/lighthouse-1/obra/2-7` |
| 2.8 Structures / 2.9 Modules: lots by inverter picked from the design (sample lots in `data/lots.ts`) | `/usinas/lighthouse-1/obra/2-8`, `…/2-9` |
| 2.10 Physical equipment installation: one record per equipment code; QGBT's reserved BESS point is enforced | `/usinas/lighthouse-1/obra/2-10` |
| 2.11 Electrical installation and grounding: 5 fronts, each with its design PDF; runs coded as in the CAD | `/usinas/lighthouse-1/obra/2-11` |
| 2.12 Communications and CCTV: points and sections per system (lighting and weather station not detailed yet) | `/usinas/lighthouse-1/obra/2-12` |
| 2.14 Connection and energization: one record per inverter, assembly or auxiliary system; five stages | `/usinas/lighthouse-1/obra/2-14` |
| 2.15 Commissioning and handover: cold and hot commissioning per system (linked to 2.13 / 2.14 results), plus one overall plant handover with Kromos's acceptance as its own field | `/usinas/lighthouse-1/obra/2-15` |
| 2.16 Demobilization and final cleaning: one plant-level form, its five stages in the left column; removals, module cleaning by sector and inverter, site cleaning, completion | `/usinas/lighthouse-1/obra/2-16` |

**Records with stages** (2.5 to 2.12, 2.14 to 2.16) is the pattern for most folders: one record per item identified by its
design code; the same stages in every record; and in every stage a collapsed **Simplified quality management**
with **Full quality management** (Ishikawa, 5W2H, execution, verification, continuous improvement) inside it.
One page draws them all (`features/works/records/RecordsPage.tsx`); each folder is a config in
`features/works/<folder>/definition.ts` listing its stages, fields, wording and options (a type column, a
catalog of lots or equipment, per-type designs, origin/destination pickers, required fields to send…).
Fields, rules and messages follow Bruno's prototype scripts. The quality component is `features/quality/`.

Indicators and Equipment open a "Next screen" dialog, as in the prototype. Folder 2.13 shows its stages but not yet its detailed forms: it is left at stage level by both the
prototype and the manual, to be reviewed with Bruno. Every form is a definition (2.1–2.3
in `features/works/forms/`, 2.4 in `features/works/marking/`, 2.5–2.12 and 2.14–2.16 as records configs; 2.16 is a single plant-level record), drawn
by the same engine. System maintenance and QR (the prototype's equipment view and printable
labels) are deferred, as the manual says (3.9). The sample drawings in `public/reference/` are Bruno's
placeholders, not real designs.

2.7 follows the prototype's approved form (five stages, review before covering inside Execution); the
manual's 2.7 table lists six. Bruno to confirm.

Portuguese and English: the PT/EN switch is in the top bar and on the sign-in screen, and the choice
is remembered on that device. URLs stay in Portuguese in both languages.

### Changes from the prototype

- Kromos logo from kromosenergy.com instead of the prototype's.
- The sidebar works (it did nothing in the prototype).
- Lighthouse 1 reads one record: 0% and "Awaiting start" everywhere (the prototype showed 38% on its
  own page).
- Every screen has its own URL, so the back button and shared links work.
- The accommodation form lists the planning form's teams as checkboxes instead of a multi-select box.
- The three 2.1 forms share one layout (the prototype's accommodation form had its own, larger style).
- Folders 2.1–2.16 take their stages, descriptions and notes from the stage tables in chapter 3 of Bruno's
  manual (handoff of 2026-11-21), not from the prototype's built-in folder list, which is older than its
  own form modules. The 11 document folders use the manual's chapter 2 table. English wording follows the
  handoff's English manual and `TERMINOLOGY.md`.

## Code map

```
src/
  app/          App.tsx (routes → screens, breadcrumbs), Layout.tsx (sidebar, top bar, PT/EN)
  components/   ui.tsx (cards, panels, banners, donut, pills…), Logo.tsx
  features/     login, overview, plant, documents, works (works/forms: 2.1 definitions; works/drainage: 2.5)
  features/forms/    form engine: field definitions (schema.ts) and their renderer (FormFields.tsx)
  features/quality/  simplified + full quality management, one record per stage
  data/         demo data: plants, the 11 document folders, the 16 construction folders
  types/        domain.ts: shaped like the future database tables
  lib/          router.ts, i18n.ts, utils.ts
  i18n/en.ts    English for every Portuguese string (Portuguese text is the key)
public/reference/  the prototype's reference PDFs (electrical and communication), for later folders
```

Adding text: write it in Portuguese inside `t('…')` and add the English to `src/i18n/en.ts`.
`npm run dev` warns in the browser console about any string missing its English.
