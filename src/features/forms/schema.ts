// Form definitions as data. A stage form is a list of fields; one renderer (FormFields.tsx) draws them,
// so the construction folders are written as definitions instead of hand-built screens.
// Every label, help line and option is the Portuguese text; the renderer translates it with t(), filling
// placeholders such as {epc} from the form's `vars`. The same definitions can later drive validation and
// the database columns.

export const YES = 'Sim'
export const NO = 'Não'
/** A point field's "type a design code" choice. */
export const CUSTOM_POINT = '__custom__'

export type Column = { key: string; label: string; kind: 'select' | 'number'; options?: string[] }

export type Field =
  | { kind: 'text' | 'number' | 'date' | 'datetime'; key: string; label: string; help?: string }
  | { kind: 'textarea'; key: string; label: string; help?: string }
  | { kind: 'select'; key: string; label: string; options: string[]; help?: string; placeholder?: string }
  /** One choice, shown as radio buttons. */
  | { kind: 'radio'; key: string; label: string; options: string[]; help?: string }
  /**
   * A link to a document Kromos registered (design, report, calculation report). In this preview the list is
   * empty: real documents come with the database. `placeholder` defaults to "Selecione o documento cadastrado".
   */
  | { kind: 'doc'; key: string; label: string; help?: string; placeholder?: string }
  /** A sub-heading inside a form, e.g. "1. Serviços previstos ou realizados". */
  | { kind: 'heading'; text: string }
  /**
   * Reference design: the registered design (empty list in this preview), its name and revision, and an
   * "Abrir documento" button that will open the specific file once documents are registered.
   */
  | { kind: 'design'; key: string; help?: string }
  /**
   * A point a record starts or ends at (a trench's origin and destination): picked from codes the page
   * provides as `source` (pull boxes already entered), or "Informar código do projeto" to type one, kept in
   * `${key}Code`.
   */
  | { kind: 'point'; key: string; label: string; source: string }
  /**
   * A bordered block whose answers are kept under `key`, so the same definition can appear several times
   * on a page (DC, AC and communication trench blocks).
   */
  | { kind: 'group'; key: string; title?: string; fields: Field[] }
  /** Yes / No. */
  | { kind: 'yesno'; key: string; label: string; help?: string }
  /**
   * Several choices, shown as checkboxes. Value: string[]. Options are fixed, or come from `source`
   * (a list another form provides, e.g. the crews entered in planning); `empty` shows when it has none.
   */
  | { kind: 'checks'; key: string; label?: string; help?: string; options?: string[]; source?: string; empty?: string }
  /** File picker (file names only; nothing is uploaded). */
  | { kind: 'attach'; key: string; label: string; help?: string; images?: boolean }
  /** File picker plus a notes box. */
  | { kind: 'photos'; key: string; label?: string }
  /** Yes / No question; "Sim" opens description, owner and deadline. Feeds the record's outstanding issues. */
  | { kind: 'issue'; key: string; label: string }
  /** Two-column row (or `cols: 3`). */
  | { kind: 'grid'; fields: Field[]; cols?: 2 | 3 }
  /**
   * Fields shown while another answer equals a value, or is one of `in`, or (with `notEquals`) until it
   * equals that value.
   */
  | { kind: 'when'; key: string; equals?: string; in?: string[]; notEquals?: string; fields: Field[] }
  /**
   * Repeating records (crews, machines, accommodations). Value: Values[]; always at least one.
   * `title` numbers each card ("Acomodação 01"); `addBesideFirst` puts the add button next to the first field.
   */
  | { kind: 'repeat'; key: string; fields: Field[]; addLabel: string; title?: string; addBesideFirst?: boolean; initial?: number }
  /** A fixed list of rows, each answering the same columns (temporary facilities). Keys: `${column}-${row}`. */
  | { kind: 'table'; rowHeader: string; rows: string[]; columns: Column[] }
  | { kind: 'note'; text: string }
  /** A collapsible block, closed until opened ("Registrar torque, quando aplicável"). Answers stay flat. */
  | { kind: 'details'; title: string; fields: Field[] }

export type Values = Record<string, unknown>

export const str = (v: Values, k: string) => (typeof v[k] === 'string' ? (v[k] as string).trim() : '')
export const list = (v: Values, k: string) => (Array.isArray(v[k]) ? (v[k] as string[]) : [])
/** A repeat's records; a fresh one shows `initial` empty records (default 1). */
export const rows = (v: Values, k: string, initial = 1): Values[] =>
  Array.isArray(v[k]) && v[k].length ? (v[k] as Values[]) : Array.from({ length: initial }, () => ({}))
export const sub = (v: Values, k: string): Values => (v[k] && typeof v[k] === 'object' && !Array.isArray(v[k]) ? (v[k] as Values) : {})

/** The label of the field that writes `key`, for "Complete: …" validation messages. */
export function labelOf(fields: Field[], key: string): string | undefined {
  for (const f of fields) {
    if ('key' in f && f.key === key && 'label' in f && f.label) return f.label
    if (f.kind === 'grid' || f.kind === 'when' || f.kind === 'repeat' || f.kind === 'group' || f.kind === 'details') {
      const l = labelOf(f.fields, key)
      if (l) return l
    }
  }
  return undefined
}
