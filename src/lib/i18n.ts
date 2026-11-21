import { useSyncExternalStore } from 'react'
import { en } from '@/i18n/en'

// Same approach as the Kromos task tool (kromos-task-business): the Portuguese text is the key,
// `en.ts` maps it to English, and anything missing falls back to Portuguese.

export type Lang = 'pt' | 'en'

const KEY = 'epc:lang'

function initial(): Lang {
  try {
    const v = localStorage.getItem(KEY)
    if (v === 'pt' || v === 'en') return v
  } catch { /* no storage: follow the browser */ }
  return typeof navigator === 'undefined' || navigator.language?.toLowerCase().startsWith('pt') ? 'pt' : 'en'
}

let current: Lang = initial()
const listeners = new Set<() => void>()
if (typeof document !== 'undefined') document.documentElement.lang = current === 'pt' ? 'pt-BR' : 'en'

export const getLang = () => current

export function setLang(l: Lang) {
  current = l
  try { localStorage.setItem(KEY, l) } catch { /* this tab only */ }
  document.documentElement.lang = l === 'pt' ? 'pt-BR' : 'en'
  listeners.forEach(f => f())
}

/** Re-renders the caller when the language changes. */
export const useLang = () =>
  useSyncExternalStore(f => { listeners.add(f); return () => listeners.delete(f) }, getLang)

/** Translates a Portuguese string. `{name}` placeholders are filled from `vars`. */
export function t(pt: string, vars?: Record<string, string | number>) {
  if (import.meta.env.DEV && current === 'en' && !(pt in en)) console.warn('[i18n] missing EN:', pt)
  const s = current === 'en' ? en[pt] ?? pt : pt
  return vars ? s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m)) : s
}
