import type { RefString } from '../types'

/**
 * The original Twelve, in the order of Matthew 10:2–4. Matthias, chosen after the resurrection
 * and "counted with the eleven apostles" (Acts 1:26), is deliberately not in this list.
 */
export const ORIGINAL_TWELVE = [
  'peter',
  'andrew',
  'james-zebedee',
  'john-zebedee',
  'philip-apostle',
  'bartholomew',
  'thomas',
  'matthew',
  'james-alphaeus',
  'thaddaeus',
  'simon-zealot',
  'judas-iscariot',
] as const

export const MATTHIAS = 'matthias'

/** The four lists of the Twelve. */
export const TWELVE_LISTS: RefString[] = ['MAT 10:2-4', 'MRK 3:16-19', 'LUK 6:13-16', 'ACT 1:13']
