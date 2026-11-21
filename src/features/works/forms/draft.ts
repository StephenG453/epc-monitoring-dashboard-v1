import { useSyncExternalStore } from 'react'

// In-memory drafts for the 2.1 forms. Values survive moving between screens (as in the prototype,
// where the forms stayed on the page) but nothing is saved: a reload clears them. In the functional
// platform this becomes the draft record the EPC saves and Kromos reads.

type Draft = Record<string, unknown>
const drafts: Record<string, Draft> = {}
const listeners = new Set<() => void>()
let version = 0

export function getDraft(form: string): Draft {
  return (drafts[form] ??= {})
}

export function setField(form: string, name: string, value: unknown) {
  getDraft(form)[name] = value
  version++
  listeners.forEach(f => f())
}

export function getField<T>(form: string, name: string, fallback: T): T {
  const v = getDraft(form)[name]
  return v === undefined ? fallback : (v as T)
}

/** Re-renders when any draft changes (used for lists that grow, and the teams other forms read). */
export const useDrafts = () =>
  useSyncExternalStore(f => { listeners.add(f); return () => listeners.delete(f) }, () => version)
