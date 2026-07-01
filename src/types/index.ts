/**
 * Types barrel.
 *
 * Everywhere else in the app imports from '@/types' — that hasn't changed.
 * The types themselves just live in one file per feature now (mirrors the
 * src/features and src/services folders) instead of one 293-line file, so
 * it's easier to find "where's the SOAP result type" without scrolling.
 *
 * Adding a new feature? Add a new file here and re-export it below.
 */

export * from './chat'
export * from './speech-to-soap'
export * from './clinical-pathway'
export * from './eclaim'
export * from './common'
export * from './sdk'
