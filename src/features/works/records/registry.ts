import { drainage } from '@/features/works/drainage/definition'
import { foundations } from '@/features/works/foundations/definition'
import { trenches } from '@/features/works/trenches/definition'
import { modules, structures } from '@/features/works/lots/definition'
import { equipment } from '@/features/works/equipment/definition'
import { electrical } from '@/features/works/electrical/definition'
import { communication } from '@/features/works/communication/definition'
import { energization } from '@/features/works/energization/definition'
import { commissioning } from '@/features/works/commissioning/definition'
import { demobilization } from '@/features/works/demobilization/definition'
import type { RecordsConfig } from './config'

/** Folders drawn by the records page, by the `formPage` name in data/workFolders.ts. */
export const RECORDS: Record<string, RecordsConfig> = {
  drenagem: drainage,
  fundacoes: foundations,
  valas: trenches,
  estruturas: structures,
  modulos: modules,
  equipamentos: equipment,
  eletrica: electrical,
  comunicacao: communication,
  energizacao: energization,
  comissionamento: commissioning,
  desmobilizacao: demobilization,
}
