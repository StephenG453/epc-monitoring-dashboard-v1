import type { Field } from '@/features/forms/schema'

// A "records with stages" folder (manual 3.4/3.7): one record per item identified by its code in the design
// (a drainage section, a foundation, a trench...), the same stages in every record, quality management in
// every stage, and the record's outstanding issues gathered at completion. 2.5 and 2.6 are configs of it.

export type CatalogItem = {
  code: string
  /** Values for the title and detail templates ({inverter}, {sector}…). */
  vars: Record<string, string | number>
  /** Options a record's `checks` field with `source: 'rows'` offers (the lot's rows). */
  rows: string[]
  /** The type this item belongs to, when the folder has a type column (2.10: INV-03 is an inverter). */
  type?: number
}

export type Catalog = {
  /** A design picked before the item (2.8/2.9); omitted when each record links its own design (2.10). */
  designLabel?: string
  designOptions: string[]
  itemLabel: string
  addLabel: string
  /** Title and detail line of a record, e.g. "{code} · Inversor {inverter}". */
  title: string
  detail: string
  items: CatalogItem[]
}

export type RecordsConfig = {
  /** In-memory draft that holds the records. */
  draft: string
  stages: string[]
  /**
   * The fields of each stage except the materials list and the completion block's issue summary, which the
   * page draws. `type` is the selected type's index when the folder has a type column, else 0.
   */
  stageFields: (type: number) => Field[][]
  /** Index of the materials stage (one block per material, "Adicionar material"); -1 when there is none. */
  materialsStage: number
  materialFields: Field[]
  /** The condition that is not an issue; anything else lists the material as outstanding. */
  materialOk: string
  /** Shown after the outstanding issues in the last stage (final photos). */
  completionAfter: Field[]
  /** Yes/no issue questions whose "Sim" lists an outstanding issue. */
  issueKeys: string[]
  /** Left column of types (2.6: what kind of foundation). Records belong to the type they were added under. */
  types?: { title: string; names: string[] }
  /** Per-type wording, where a type names its records differently (2.7: "Vala" vs "Caixa"). */
  typeLabels?: (type: number) => Partial<Pick<RecordsConfig['labels'], 'add' | 'recordTitle' | 'newRecord'>>
  /** Each type has its own reference design (2.7's trench groups), instead of one for the folder. */
  designPerType?: boolean
  /** Codes must be unique within a type only (2.7: a DC trench and an AC trench may share a code). */
  uniqueWithinType?: boolean
  /**
   * Codes offered by `point` fields: the codes of records of type `fromType` (2.7: pull boxes), plus any
   * code already typed into a point field.
   */
  points?: { source: string; fromType: number; keys: string[] }
  /** Fields required to send the record, beyond the code (2.7 trenches: origin and destination). */
  sendRequires?: (type: number) => string[]
  /** Outstanding issues beyond issue questions, materials and quality (2.7: review before covering). */
  extraPending?: (values: Record<string, unknown>) => string[]
  /**
   * Records are picked from a catalog instead of typed (2.8/2.9: lots by inverter, from the design): select
   * the design and an item, then add it; an item already added is reopened. The item's code is the record's.
   */
  catalog?: Catalog
  /** Types that open with no record until one is picked (2.10: BESS, only when in scope). */
  noSeedTypes?: number[]
  /**
   * Each type's reference design as a pick list with an "Abrir PDF" link to the drawing (2.11: one design per
   * front, sample PDFs in public/reference). Sending needs it selected. No revision field (manual, 2.11).
   */
  typeDesigns?: ({ label: string; pdf: string } | undefined)[]
  /** Fields of the record shown above its stages (2.11: circuit and AC breaker codes). */
  headerFields?: (type: number) => Field[]
  /**
   * Types whose forms are not detailed yet (2.12: lighting and weather station): the page shows `note`
   * instead of records.
   */
  undetailed?: { types: number[]; note: string }
  /** Stage names per type, when a type's stages differ (2.15: handover and acceptance). Same count as `stages`. */
  stagesFor?: (type: number) => string[]
  /** Types with exactly one record, titled `title` and needing no code (2.15: the plant's overall handover). */
  single?: { types: number[]; title: string }
  /** Left column listing the stages, each scrolling to its stage (2.16: a single plant-level form). Its title. */
  stageNav?: string
  /** No reference design or schedule block above the records (2.16). */
  noReferences?: boolean
  /** Fixed code lists for `point` fields (2.16: inverters from the design). */
  sources?: Record<string, string[]>
  /** A field whose answer goes before the code in the record's title (2.15: "Inversores · SYS-01"). */
  titlePrefixKey?: string
  /** Number of the first stage, when steps come before it (2.8/2.9: 1 design, 2 lot, so stages start at 3). */
  stageOffset?: number
  /** Extra check when sending the record; returns a Portuguese message, or null. */
  sendValidate?: (values: Record<string, unknown>, item?: CatalogItem) => string | null
  /** Replaces the default completion note ("Conclusão informada pela {epc} não substitui…"). */
  completionNote?: string
  labels: {
    list: string
    add: string
    /** Before the code in a record's title: "TRECHO DR-01 — …". */
    recordTitle: string
    newRecord: string
    noCode: string
    codeMissing: string
    codeDuplicate: string
    noPending: string
    designNote: string
  }
}
