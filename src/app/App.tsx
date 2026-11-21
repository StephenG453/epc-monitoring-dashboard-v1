import { useEffect } from 'react'
import { AppShell, type Crumb } from './Layout'
import { A } from '@/components/ui'
import { LoginPage } from '@/features/login/LoginPage'
import { OverviewPage, PlantsPage } from '@/features/overview/OverviewPage'
import { PlantPage } from '@/features/plant/PlantPage'
import { DocFolderPage, DocItemPage, DocumentsPage } from '@/features/documents/DocumentsPage'
import { WorkFolderPage, WorksPage } from '@/features/works/WorksPage'
import { RecordsPage } from '@/features/works/records/RecordsPage'
import { RECORDS } from '@/features/works/records/registry'
import { MarkingPage } from '@/features/works/marking/MarkingPage'
import { FormPage } from '@/features/works/forms/FormKit'
import { FORMS } from '@/features/works/forms/definition'
import { parse, paths, usePath, type Route } from '@/lib/router'
import { t, useLang } from '@/lib/i18n'
import { plants } from '@/data/plants'
import { docFolders } from '@/data/docFolders'
import { workFolders } from '@/data/workFolders'

export function App() {
  useLang() // re-render everything when the language changes
  const route = parse(usePath())

  useEffect(() => {
    document.title = route.page === 'login' ? 'Kromos | Gestão de usinas' : `Kromos | ${t('Gestão de usinas')}`
  })

  if (route.page === 'login') return <LoginPage />
  const screen = resolve(route)
  if (!screen) return <NotFound />
  return <AppShell route={route} crumbs={screen.crumbs} bell={route.page === 'overview'}>{screen.body}</AppShell>
}

/** Matches a route to its screen and breadcrumbs; null when an id in the URL doesn't exist. */
function resolve(r: Route): { crumbs: Crumb[]; body: React.ReactNode } | null {
  const home: Crumb = { label: 'Kromos Energy', to: paths.overview() }
  if (r.page === 'overview') return { crumbs: [home, { label: t('Visão geral') }], body: <OverviewPage /> }
  if (r.page === 'plants') return { crumbs: [home, { label: t('Usinas') }], body: <PlantsPage /> }
  if (r.page === 'notFound' || r.page === 'login') return null

  const plant = plants.find(p => p.id === r.plantId && !p.isExample)
  if (!plant) return null
  const plantCrumb: Crumb = { label: plant.name, to: paths.plant(plant.id) }

  switch (r.page) {
    case 'plant':
      return { crumbs: [home, { label: t('Usinas'), to: paths.plants() }, { label: plant.name }], body: <PlantPage plant={plant} /> }
    case 'documents':
      return { crumbs: [home, plantCrumb, { label: t('Documentos') }], body: <DocumentsPage plant={plant} /> }
    case 'docFolder':
    case 'docItem': {
      const folder = docFolders.find(f => f.id === r.folderId)
      if (!folder) return null
      const docs: Crumb = { label: t('Documentos'), to: paths.documents(plant.id) }
      if (r.page === 'docFolder') return { crumbs: [home, plantCrumb, docs, { label: t(folder.name) }], body: <DocFolderPage plant={plant} folder={folder} /> }
      if (!folder.items[r.itemIndex]) return null
      return {
        crumbs: [home, plantCrumb, docs, { label: t(folder.name), to: paths.docFolder(plant.id, folder.id) }, { label: t('Ficha') }],
        body: <DocItemPage plant={plant} folder={folder} index={r.itemIndex} />,
      }
    }
    case 'works':
      return { crumbs: [home, plantCrumb, { label: t('Execução da obra') }], body: <WorksPage plant={plant} /> }
    case 'workFolder':
    case 'workForm': {
      const folder = workFolders.find(f => f.id === r.folderId)
      if (!folder) return null
      const works: Crumb = { label: t('Obra'), to: paths.works(plant.id) }
      const code = folder.name.split(' ')[0]
      if (r.page === 'workFolder') {
        // A folder inside another (2.3 in 2.2) shows its parent in the breadcrumbs.
        const parent = workFolders.find(p => p.id === folder.inside)
        const trail: Crumb[] = parent ? [works, { label: parent.name.split(' ')[0], to: paths.workFolder(plant.id, parent.id) }] : [works]
        const pageForm = folder.page === 'form' && folder.formPage ? FORMS[folder.formPage] : undefined
        const records = folder.page === 'records' && folder.formPage ? RECORDS[folder.formPage] : undefined
        const body = records ? <RecordsPage key={folder.id} plant={plant} folder={folder} config={records} />
          : pageForm ? <FormPage key={pageForm.id} plant={plant} folder={folder} form={pageForm} />
          : <WorkFolderPage plant={plant} folder={folder} />
        return { crumbs: [home, plantCrumb, ...trail, { label: t(folder.name) }], body }
      }
      const ready = folder.groups.some(g => g.steps.some(st => st.formId === r.formId))
      if (!ready) return null
      // 2.4's setting-out page: its own layout (item list + forms), opened at item 1 or at item 14.
      if (r.formId === 'marcacao' || r.formId === 'marcacao-ocorrencias') {
        return {
          crumbs: [home, plantCrumb, works, { label: code, to: paths.workFolder(plant.id, folder.id) }, { label: t('Locação e marcação em campo') }],
          body: <MarkingPage key={r.formId} plant={plant} folder={folder} startAtQuality={r.formId === 'marcacao-ocorrencias'} />,
        }
      }
      const form = FORMS[r.formId]
      if (!form) return null
      return {
        crumbs: [home, plantCrumb, works, { label: code, to: paths.workFolder(plant.id, folder.id) }, { label: t(form.title) }],
        body: <FormPage key={form.id} plant={plant} folder={folder} form={form} />,
      }
    }
  }
}

function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center p-8 text-center">
      <div>
        <div className="smallcaps text-[#ed8545]">404</div>
        <h1 className="my-3 text-[31px] font-bold tracking-[-0.04em]">{t('Página não encontrada')}</h1>
        <A to={paths.overview()} className="text-sm font-bold text-blue hover:underline">{t('Voltar à visão geral')} →</A>
      </div>
    </div>
  )
}
