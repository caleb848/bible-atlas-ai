/**
 * Bible Atlas content model.
 *
 * The structured data in `src/data` is the product's source of truth. Components and search
 * only ever read from it; nothing in the UI (or any future AI feature) may invent places,
 * references or events that are not recorded here.
 */

/** Locales the content model can carry. English is required; other languages are optional. */
export type Locale = 'en' | 'pa'

/** A piece of user-facing content with an English original and optional translations. */
export type LocalizedText = { en: string } & Partial<Record<Exclude<Locale, 'en'>, string>>

/**
 * USFM book codes for the books the atlas quotes: the Gospels and Acts, and Paul's letters where
 * they record a movement or a companion that Acts does not (for example 1 Thessalonians 3:1–6).
 */
export type BookId =
  | 'MAT'
  | 'MRK'
  | 'LUK'
  | 'JHN'
  | 'ACT'
  | 'ROM'
  | '1CO'
  | '2CO'
  | 'GAL'
  | 'EPH'
  | 'PHP'
  | 'COL'
  | '1TH'
  | '2TH'
  | '1TI'
  | '2TI'
  | 'TIT'
  | 'PHM'

/**
 * A Scripture reference written as `BOOK chapter:verse[-verse | -chapter:verse]`,
 * e.g. `ACT 16:11-15` or `ACT 18:23-21:17`. Parsed and validated by `lib/scripture/reference`.
 */
export type RefString =
  | `${BookId} ${number}:${number}`
  | `${BookId} ${number}:${number}-${number}`
  | `${BookId} ${number}:${number}-${number}:${number}`

/**
 * How confident the identification of an ancient place with a modern location is.
 * Derived from OpenBible.info confidence scores (see DATA_SOURCES.md).
 */
export type Certainty =
  /** Securely identified; scholarly consensus. */
  | 'identified'
  /** Leading identification, but alternatives have been proposed. */
  | 'probable'
  /** Located by long-standing tradition rather than firm evidence. */
  | 'traditional'
  /** Competing identifications; the marker shows one candidate. */
  | 'debated'
  /** A region or area; the marker is only a representative point. */
  | 'approximate'

export type PlaceKind =
  | 'city'
  | 'town'
  | 'village'
  | 'port'
  | 'island'
  | 'region'
  | 'lake'
  | 'river'
  | 'mountain'
  | 'promontory'
  | 'site'

export interface CoordinateSource {
  name: 'OpenBible.info' | 'Pleiades' | 'Wikidata'
  id: string
  url: string
}

export interface Place {
  /** URL-safe identifier, used in `/place/:id`. */
  id: string
  name: LocalizedText
  /** Other names or spellings of the ancient place, shown to readers (e.g. "Beroea" in the WEB). */
  alternateNames?: string[]
  /** Modern or related names that should find the place in search but are not names for it. */
  searchTerms?: string[]
  kind: PlaceKind
  /** Roman province or region named for the place, where helpful (e.g. Macedonia). */
  ancientRegion?: LocalizedText
  /** Modern location. Omitted when no modern equivalent can be stated responsibly. */
  modern?: { name: LocalizedText; area?: LocalizedText }
  /** [longitude, latitude] in WGS84. */
  coordinates: [number, number]
  certainty: Certainty
  /** Explains the identification or marker placement. Shown wherever the certainty badge is. */
  certaintyNote?: LocalizedText
  /** Short, neutral, Scripture-grounded description. Editorial text — never a quotation. */
  summary: LocalizedText
  /** Representative references where the place appears. */
  refs: RefString[]
  sources: CoordinateSource[]
  tags?: string[]
}

/**
 * Sections of the People directory. A person can belong to several (Priscilla is both a companion
 * of Paul and one of the women of Acts); membership is editorial and never implies a group that
 * the text does not describe.
 */
export type PersonGroup =
  | 'jesus-and-the-twelve'
  | 'paul-and-companions'
  | 'women'
  | 'early-church'
  | 'authorities'
  | 'gospel-figures'
  | 'acts-figures'

export interface Person {
  id: string
  /**
   * Display name. Unnamed figures keep a description instead of a name ("The Samaritan woman");
   * names the text does not give are never supplied.
   */
  name: LocalizedText
  /** Other names the person goes by in the text (e.g. Saul, Cephas), shown to readers. */
  alternateNames?: string[]
  /** Titles or ambiguous short names that should find the person in search only. */
  searchTerms?: string[]
  /** A brief description grounded in the cited text. */
  role: LocalizedText
  summary: LocalizedText
  refs: RefString[]
  groups: PersonGroup[]
  /**
   * Explains names that differ between accounts (Thaddaeus / Judas son of James) and any
   * identification that rests on tradition, which is always labelled as such.
   */
  identityNote?: LocalizedText
  /** Places the text says the person came from or lived in ("Paul of Tarsus", Acts 21:39). */
  origins?: Array<{ placeId: string; ref: RefString }>
}

export interface BiblicalEvent {
  id: string
  title: LocalizedText
  /** Editorial paraphrase of the passage. Rendered as a summary, never styled as Scripture. */
  summary: LocalizedText
  /** Usually one place; several when the text narrates one event across places. */
  placeIds: string[]
  /** Clarifies where the text locates the event when it is vaguer than the marker. */
  locationNote?: LocalizedText
  personIds: string[]
  /** The full narrated passage (cited). */
  passage: RefString
  /** A short excerpt shown by default (a subset of `passage`). */
  excerpt?: RefString
  /** Parallel accounts or closely related references. */
  relatedRefs?: RefString[]
  tags?: string[]
}

/** How the text describes the leg of travel that arrives at a stop. */
export type LegMode = 'sea' | 'land' | 'unspecified'
/** Whether the text states the leg, implies it, or leaves the course unknown. */
export type LegCertainty = 'stated' | 'implied' | 'uncertain'

export interface JourneyStop {
  placeId: string
  eventIds: string[]
  /** The verses that narrate this stop. */
  passage: RefString
  /** Route journeys only: the leg arriving at this stop. */
  arrival?: { mode: LegMode; certainty: LegCertainty; note?: LocalizedText }
  /** 'passed' when the text says the ship only came opposite or sailed by. */
  presence?: 'visited' | 'passed'
  note?: LocalizedText
  /**
   * A short verbatim fragment of the World English Bible that characterizes the stop, e.g.
   * "a city of Macedonia, the foremost of the district, a Roman colony" (Acts 16:12). The tests
   * check that `text` appears word for word in `ref`.
   */
  quote?: { ref: RefString; text: string }
  /** Collection journeys only: which section the stop belongs to. */
  sectionId?: string
}

export interface JourneySection {
  id: string
  title: LocalizedText
  description?: LocalizedText
}

export type JourneyType =
  /** A sequence the text narrates in order; stops are connected by a route line. */
  | 'route'
  /** Related locations that are NOT connected by a documented continuous route. */
  | 'collection'

export interface Journey {
  /** URL slug, used in `/journey/:id`. */
  id: string
  type: JourneyType
  eraId: string
  title: LocalizedText
  shortTitle: LocalizedText
  subtitle: LocalizedText
  summary: LocalizedText
  /** Overall Scripture range(s) for the journey or collection. */
  passages: RefString[]
  /** Only included when a responsible scholarly estimate exists. */
  period?: { label: LocalizedText; note: LocalizedText }
  /** Collections explain how their entries are ordered (they are not travel order). */
  orderingNote?: LocalizedText
  sections?: JourneySection[]
  /**
   * A thematic collection about one group of people (e.g. women): only that group counts as the
   * collection's people, so others named in the same events are not listed as part of the theme.
   */
  focusGroup?: PersonGroup
  stops: JourneyStop[]
  tags: string[]
  featured: boolean
}

export interface Era {
  id: string
  name: LocalizedText
  description: LocalizedText
}

export interface Translation {
  id: 'WEB'
  abbreviation: string
  name: LocalizedText
  language: Locale
  license: LocalizedText
  /** Where the source text was obtained. */
  sourceUrl: string
}
