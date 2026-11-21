import type { Plant, PortfolioSummary } from '@/types/domain'

// Demo data, from Bruno's prototype. Every number here is illustrative.
//
// One source for Lighthouse 1: the prototype showed it at 0% ("Aguardando início") in the list and at
// 38% on its own page. Both now read this record, set to the list's values.

const base = { epcName: 'CESBE', docFoldersChecked: 0, scheduleAlerts: 0, capexPlanned: null, capexActual: null }

export const plants: Plant[] = [
  {
    ...base,
    id: 'lighthouse-1',
    name: 'Lighthouse 1',
    location: 'Palmeira · PR',
    status: 'awaiting',
    progress: 0,
    isExample: false,
    docFoldersChecked: 8,
    scheduleAlerts: 2,
  },
  { ...base, id: 'exemplo-02', name: 'Usina Exemplo 02', location: '', status: 'in_progress', progress: 68, isExample: true },
  { ...base, id: 'exemplo-03', name: 'Usina Exemplo 03', location: '', status: 'in_progress', progress: 42, isExample: true },
  { ...base, id: 'exemplo-04', name: 'Usina Exemplo 04', location: '', status: 'delivered', progress: 100, isExample: true },
  { ...base, id: 'exemplo-05', name: 'Usina Exemplo 05', location: '', status: 'awaiting', progress: 0, isExample: true },
]

/** The portfolio totals the overview shows (168 planned plants; the split is illustrative). */
export const summary: PortfolioSummary = {
  total: 168,
  awaiting: 50,
  inProgress: 60,
  delivered: 58,
  lateStages: 3,
  docsExpiring: 2,
  pendingInspections: 4,
}

/** The plant page's alert counts (illustrative). */
export const plantAlerts = { deadline: 1, inspection: 1, expiringDoc: 1 }
