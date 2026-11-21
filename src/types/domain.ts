// Domain types. They are shaped like the database tables a later phase will add (Supabase, as in the
// Kromos task tool), so the screens won't need rewriting when real data replaces the demo data.

export type PlantStatus = 'awaiting' | 'in_progress' | 'delivered'

export type Plant = {
  id: string
  name: string
  /** "Palmeira · PR"; empty for the illustrative rows. */
  location: string
  status: PlantStatus
  /** Construction progress, 0-100. */
  progress: number
  /** True for the made-up rows that only fill the list. */
  isExample: boolean
  /** The EPC contractor that fills in the construction records. */
  epcName: string
  /** Pre-construction folders checked, out of the 11. */
  docFoldersChecked: number
  /** Construction stages whose deadline needs attention. */
  scheduleAlerts: number
  /** CAPEX in BRL; null until it is entered. */
  capexPlanned: number | null
  capexActual: number | null
}

export type PortfolioSummary = {
  total: number
  awaiting: number
  inProgress: number
  delivered: number
  lateStages: number
  docsExpiring: number
  pendingInspections: number
}

export type DocFolder = {
  /** URL segment, "1" to "11". */
  id: string
  /** As the manual names it: "1 Acesso e conexão". */
  name: string
  items: string[]
}

export type WorkStep = {
  title: string
  /** What the EPC records and fills in. */
  epc: string
  /** What Kromos follows up. */
  kromos: string
  /** When set, the step opens its own form (only folder 2.1 in v1). */
  formId?: string
}

export type WorkFolder = {
  /** URL segment: "2-1". */
  id: string
  /** As the manual names it: "2.1 Mobilização, canteiro e acomodação do pessoal". */
  name: string
  /** What the stages repeat for: "por trecho", "por lote de inversor"... */
  per?: string
  /** `plain` groups are reference lists (subfolders), not stages with EPC / Kromos columns. */
  groups: { title: string; plain?: boolean; steps: WorkStep[] }[]
  notes: string[]
  /** Whether the detailed forms for this folder are built yet. */
  formsReady: boolean
  /**
   * A folder whose page is its form, named by `formPage`: 'records' opens straight into its records with
   * stages (2.5 drainage, 2.6 foundations); 'form' opens a form definition (2.3 fencing).
   */
  page?: 'records' | 'form'
  formPage?: string
  /** Reached from inside another folder rather than from the grid (2.3 fencing sits in 2.2, below Execution). */
  inside?: string
}
