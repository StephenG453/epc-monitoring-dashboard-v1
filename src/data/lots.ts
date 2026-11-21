// Sample lots by inverter, from Bruno's prototype (inverter-lots.js). Illustrative only: not Lighthouse 1's
// real inventory. Structures (2.8) and modules (2.9) are organized by these lots, identified in the design and
// its layers (manual: "Structure and module lots are organized by inverter").

export type InverterLot = {
  code: string
  inverter: string
  sector: string
  rows: string[]
  /** Planned tables (2.8). */
  tables: number
  /** Planned modules (2.9). */
  modules: number
}

export const inverterLots: InverterLot[] = [
  { code: 'LM-INV-03', inverter: 'INV-03', sector: 'B', rows: ['L-12', 'L-13', 'L-14', 'L-15', 'L-16'], tables: 50, modules: 1400 },
  { code: 'LM-INV-04', inverter: 'INV-04', sector: 'B', rows: ['L-17', 'L-18', 'L-19', 'L-20'], tables: 40, modules: 1120 },
]
