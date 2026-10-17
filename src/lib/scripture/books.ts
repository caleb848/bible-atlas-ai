import type { LocalizedText } from '../../data/types'

export interface BookInfo {
  /** USFM book code. */
  code: string
  name: LocalizedText
  /** Lower-case abbreviations accepted in search, without periods. */
  abbreviations: string[]
}

const book = (code: string, name: string, ...abbreviations: string[]): BookInfo => ({
  code,
  name: { en: name },
  abbreviations,
})

/** The Protestant canon in canonical order. Used to recognize references typed into search. */
export const BOOKS: readonly BookInfo[] = [
  book('GEN', 'Genesis', 'gen', 'gn', 'ge'),
  book('EXO', 'Exodus', 'exod', 'exo', 'ex'),
  book('LEV', 'Leviticus', 'lev', 'lv'),
  book('NUM', 'Numbers', 'num', 'nm', 'nu'),
  book('DEU', 'Deuteronomy', 'deut', 'deu', 'dt'),
  book('JOS', 'Joshua', 'josh', 'jos'),
  book('JDG', 'Judges', 'judg', 'jdg', 'jg'),
  book('RUT', 'Ruth', 'rut', 'ru'),
  book('1SA', '1 Samuel', '1 sam', '1sam', '1 sa', '1sa'),
  book('2SA', '2 Samuel', '2 sam', '2sam', '2 sa', '2sa'),
  book('1KI', '1 Kings', '1 kgs', '1kgs', '1 ki', '1ki'),
  book('2KI', '2 Kings', '2 kgs', '2kgs', '2 ki', '2ki'),
  book('1CH', '1 Chronicles', '1 chr', '1chr', '1 ch', '1ch'),
  book('2CH', '2 Chronicles', '2 chr', '2chr', '2 ch', '2ch'),
  book('EZR', 'Ezra', 'ezr'),
  book('NEH', 'Nehemiah', 'neh'),
  book('EST', 'Esther', 'esth', 'est'),
  book('JOB', 'Job', 'jb'),
  book('PSA', 'Psalms', 'psalm', 'ps', 'psa', 'pss'),
  book('PRO', 'Proverbs', 'prov', 'pro', 'prv', 'pr'),
  book('ECC', 'Ecclesiastes', 'eccl', 'ecc', 'qoh'),
  book('SNG', 'Song of Songs', 'song of solomon', 'song', 'sos', 'sng'),
  book('ISA', 'Isaiah', 'isa'),
  book('JER', 'Jeremiah', 'jer', 'jr'),
  book('LAM', 'Lamentations', 'lam'),
  book('EZK', 'Ezekiel', 'ezek', 'ezk', 'eze'),
  book('DAN', 'Daniel', 'dan', 'dn'),
  book('HOS', 'Hosea', 'hos'),
  book('JOL', 'Joel', 'joel', 'jol'),
  book('AMO', 'Amos', 'amos', 'amo'),
  book('OBA', 'Obadiah', 'obad', 'ob'),
  book('JON', 'Jonah', 'jonah', 'jnh'),
  book('MIC', 'Micah', 'mic'),
  book('NAM', 'Nahum', 'nah', 'nam'),
  book('HAB', 'Habakkuk', 'hab'),
  book('ZEP', 'Zephaniah', 'zeph', 'zep'),
  book('HAG', 'Haggai', 'hag'),
  book('ZEC', 'Zechariah', 'zech', 'zec'),
  book('MAL', 'Malachi', 'mal'),
  book('MAT', 'Matthew', 'matt', 'mat', 'mt'),
  book('MRK', 'Mark', 'mrk', 'mar', 'mk'),
  book('LUK', 'Luke', 'luk', 'lk'),
  book('JHN', 'John', 'jhn', 'joh', 'jn'),
  book('ACT', 'Acts', 'act', 'ac', 'acts of the apostles'),
  book('ROM', 'Romans', 'rom', 'rm'),
  book('1CO', '1 Corinthians', '1 cor', '1cor', '1 co', '1co'),
  book('2CO', '2 Corinthians', '2 cor', '2cor', '2 co', '2co'),
  book('GAL', 'Galatians', 'gal'),
  book('EPH', 'Ephesians', 'eph'),
  book('PHP', 'Philippians', 'phil', 'php'),
  book('COL', 'Colossians', 'col'),
  book('1TH', '1 Thessalonians', '1 thess', '1thess', '1 th', '1th'),
  book('2TH', '2 Thessalonians', '2 thess', '2thess', '2 th', '2th'),
  book('1TI', '1 Timothy', '1 tim', '1tim', '1 ti', '1ti'),
  book('2TI', '2 Timothy', '2 tim', '2tim', '2 ti', '2ti'),
  book('TIT', 'Titus', 'tit'),
  book('PHM', 'Philemon', 'philem', 'phm'),
  book('HEB', 'Hebrews', 'heb'),
  book('JAS', 'James', 'jas', 'jm'),
  book('1PE', '1 Peter', '1 pet', '1pet', '1 pe', '1pe'),
  book('2PE', '2 Peter', '2 pet', '2pet', '2 pe', '2pe'),
  book('1JN', '1 John', '1 jn', '1jn', '1 jhn', '1jhn'),
  book('2JN', '2 John', '2 jn', '2jn', '2 jhn', '2jhn'),
  book('3JN', '3 John', '3 jn', '3jn', '3 jhn', '3jhn'),
  book('JUD', 'Jude', 'jud', 'jd'),
  book('REV', 'Revelation', 'rev', 'rv', 'revelations'),
]

const byCode = new Map(BOOKS.map((info, index) => [info.code, { info, index }]))

export const getBook = (code: string): BookInfo | undefined => byCode.get(code)?.info

/** Canonical position of a book (0-based), used to sort references. */
export const bookOrder = (code: string): number => byCode.get(code)?.index ?? Number.MAX_SAFE_INTEGER
