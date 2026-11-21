import { useSyncExternalStore } from 'react'

// A small path router: every screen has its own URL, so reviewers can share a link to it and the
// browser's back button works. Vercel rewrites every path to index.html (vercel.json).

const listeners = new Set<() => void>()
const notify = () => listeners.forEach(f => f())
if (typeof window !== 'undefined') window.addEventListener('popstate', notify)

export function navigate(path: string) {
  if (path === location.pathname) return
  history.pushState(null, '', path)
  window.scrollTo(0, 0)
  notify()
}

export const usePath = () =>
  useSyncExternalStore(f => { listeners.add(f); return () => listeners.delete(f) }, () => location.pathname)

export type Route =
  | { page: 'login' }
  | { page: 'overview' }
  | { page: 'plants' }
  | { page: 'plant'; plantId: string }
  | { page: 'documents'; plantId: string }
  | { page: 'docFolder'; plantId: string; folderId: string }
  | { page: 'docItem'; plantId: string; folderId: string; itemIndex: number }
  | { page: 'works'; plantId: string }
  | { page: 'workFolder'; plantId: string; folderId: string }
  | { page: 'workForm'; plantId: string; folderId: string; formId: string }
  | { page: 'notFound' }

/** URL segments stay in Portuguese in both languages, so links work for everyone. */
export const paths = {
  login: () => '/',
  overview: () => '/painel',
  plants: () => '/usinas',
  plant: (p: string) => `/usinas/${p}`,
  documents: (p: string) => `/usinas/${p}/documentos`,
  docFolder: (p: string, f: string) => `/usinas/${p}/documentos/${f}`,
  docItem: (p: string, f: string, i: number) => `/usinas/${p}/documentos/${f}/${i + 1}`,
  works: (p: string) => `/usinas/${p}/obra`,
  workFolder: (p: string, f: string) => `/usinas/${p}/obra/${f}`,
  workForm: (p: string, f: string, form: string) => `/usinas/${p}/obra/${f}/${form}`,
}

export function parse(path: string): Route {
  const s = path.replace(/\/+$/, '').split('/').filter(Boolean)
  if (s.length === 0) return { page: 'login' }
  if (s[0] === 'painel' && s.length === 1) return { page: 'overview' }
  if (s[0] !== 'usinas') return { page: 'notFound' }
  if (s.length === 1) return { page: 'plants' }
  const plantId = s[1]
  if (s.length === 2) return { page: 'plant', plantId }
  if (s[2] === 'documentos') {
    if (s.length === 3) return { page: 'documents', plantId }
    if (s.length === 4) return { page: 'docFolder', plantId, folderId: s[3] }
    const n = Number(s[4])
    if (s.length === 5 && Number.isInteger(n) && n > 0) return { page: 'docItem', plantId, folderId: s[3], itemIndex: n - 1 }
  }
  if (s[2] === 'obra') {
    if (s.length === 3) return { page: 'works', plantId }
    if (s.length === 4) return { page: 'workFolder', plantId, folderId: s[3] }
    if (s.length === 5) return { page: 'workForm', plantId, folderId: s[3], formId: s[4] }
  }
  return { page: 'notFound' }
}
