# Architecture

How Bible Atlas AI is built, and why. Where the content comes from and how it was checked is covered in [DATA_SOURCES.md](../DATA_SOURCES.md). How to run and deploy the app is in the [README](../README.md).

- [Principles](#principles)
- [Repository layout](#repository-layout)
- [Data model](#data-model)
- [Scripture pipeline](#scripture-pipeline)
- [Routing and sharing](#routing-and-sharing)
- [App shell](#app-shell)
- [Map](#map)
- [Search](#search)
- [Smart Search (on-device AI)](#smart-search-on-device-ai)
- [Internationalization](#internationalization)
- [Accessibility](#accessibility)
- [Performance](#performance)
- [Testing](#testing)
- [Future: Ask Bible Atlas (Claude + retrieval)](#future-ask-bible-atlas-claude--retrieval)

## Principles

1. **The data is the source of truth.** Every place, event, stop and quotation the app shows comes from typed modules in `src/data`. Components render that data and search ranks it. Nothing is generated at runtime.
2. **Static and keyless.** The production site is a set of static files: no server, database, accounts, API keys or environment variables. The external services it uses (OpenFreeMap tiles, the model on Hugging Face, the runtime on jsDelivr) are free and need no key.
3. **Progressive enhancement.** The panel works without the map, the map works without the AI model, and search works without either. Each optional layer loads only when it is needed and fails quietly.
4. **Uncertainty is data.** Certainty labels, implied legs and location notes are fields in the data model. The panel, the map and search all present them the same way.

## Repository layout

```
src/
  data/                 the atlas: typed content modules, validation, generated WEB text
    places/ people/ events/ journeys/ eras.ts translations/ scripture/web.json
    people/twelve.ts    the original Twelve (in the order of Matthew 10:2–4) and Matthias, kept apart
    atlas.ts            lookups and derived relationships
    references.ts       every reference the atlas cites, including those written in notes
    validate.ts         integrity rules, enforced by the unit tests
  lib/
    scripture/          book table, reference parsing and formatting, lazy text loading
    search/             search documents, keyword index, intent parser, ranking, grounded answers
      semantic/         Smart Search: model config, Web Worker, client, message protocol
    router/             typed routes and a small History API router
    geo/                distances, bounds, curved route segments
  components/
    map/                MapLibre map, style, scenes, markers, label layout, route geometry
    journey/ views/ search/ scripture/ layout/ panel/ ui/ feedback/
  entry-server.tsx      server rendering of each page at build time
  i18n/                 message catalogues (en, pa), provider, formatting helpers
  hooks/                media queries, journey playback, screen-reader announcements
scripts/                data download, WEB extraction, passage and place lookups, coordinate
                        checks, embeddings, pre-rendering, share image, phone map image, Lighthouse
e2e/                    Playwright tests (behaviour, accessibility, no-WebGL fallback)
design/og-image.html    source of the social share image
```

## Data model

The types are in `src/data/types.ts`:

| Type | Holds |
| --- | --- |
| `Place` | Name; alternate names (shown to readers) and search terms (used only by search); kind; modern location; coordinates (`[lng, lat]`); a `certainty` label and its explanation; summary; references; coordinate sources |
| `Person` | Name, other names, role, summary, references; the directory `groups` they appear in; an optional `identityNote` (names and identification: what the text says, and what tradition adds); `origins`, a home town or region only where the text states one ("Lydia … of the city of Thyatira", Acts 16:14) |
| `BiblicalEvent` | Title, summary, places, an optional location note, people, the narrated `passage`, a shorter `excerpt`, parallel references |
| `Journey` | `type: 'route' \| 'collection'`, passages, an optional `period`, and ordered stops. Collections also have sections and an `orderingNote`; a thematic collection can name a `focusGroup` (the women's collection counts only women as its people) |
| `JourneyStop` | Place, events, passage. On routes it also records the leg arriving there (`mode`: sea, land or unspecified; `certainty`: stated, implied or uncertain) and whether the travelers visited or only passed the place. An optional `quote` is a short verbatim WEB fragment that characterizes the stop ("a city of Macedonia, the foremost of the district, a Roman colony", Acts 16:12) |

Design choices:

- **References are typed strings** in USFM book codes, such as `ACT 16:11-15` or `ACT 18:23-21:17`. A template-literal type rejects malformed shapes at compile time, and `parseRef` rejects invalid ranges in the tests. Book names are display data, so stored references don't depend on a language.
- **All content text is `LocalizedText`** (`{ en, pa? }`), so a translation sits next to the English it translates.
- **Relationships are derived, not stored.** The people connected to a place come from the events located there. The journeys through a place come from their stops. A journey's people ("With Paul · Silas · Timothy") come from the events at its stops: on a route, everyone named at three or more stops (`TRAVELER_MIN_STOPS`). A person's counts (events, places, journeys) are computed the same way. None of these can drift out of sync, and none are typed by hand.
- **Routes before collections.** Where a route and a collection share a stop (Philippi is on Paul's second journey and in the women's collection), links and answers open the route (`journeysRoutesFirst`).
- **Stop numbers are positions.** `resolveStops` numbers the stops in order, and shared links use those numbers (`?stop=7`).

`validate.ts` checks the whole atlas. The unit tests fail on any error or warning. It checks that:

- ids are unique URL-safe slugs, every reference parses (including stop quotations and home towns), and every excerpt lies inside its passage;
- every place has valid coordinates and at least one source, and every place labelled traditional, debated or approximate explains why;
- events, journeys, stops and home towns refer only to places, people, events, eras and sections that exist; every person belongs to at least one group;
- every event listed at a stop is located at that stop's place;
- on a route, the first stop has no arrival leg and every later stop has one; collections have no legs and explain how they are ordered;
- no place, person or event is left unused (a place may be used as someone's stated home town).

Further tests (`validate.test.ts`, `integrity.test.ts`, `content.test.ts`, `scripture.test.ts`):

- the original Twelve exist, there are exactly twelve, and Matthias is separate; Thaddaeus carries Lebbaeus and Judas son of James, and the identification with Jude is labelled as tradition; Timothy is connected to the places the text names;
- no duplicate people, and no alias that is another person's name;
- every relationship agrees in both directions, and every displayed journey participant comes from the events;
- Paul's second journey keeps exactly 18 stops in the order of Acts 15:36–18:22, with Jerusalem (Acts 18:22) marked as implied;
- route legs join consecutive stops, and route stops follow the order of the text;
- every stop quotation appears word for word in the WEB, inside the passage the stop cites; any words in curly quotation marks, in the data or in interface text that cites a verse, appear in the verses cited;
- every place names the source of its coordinates; every reference has its verses in the WEB file;
- every search answer, for a set of questions generated from the data, cites Scripture with verses that exist.

## Scripture pipeline

```
eBible.org eng-web_vpl.xml ─► scripts/build-scripture.ts ─► src/data/scripture/web.json
                              copies only the referenced      2,596 verses from 18 books,
                              verses, verbatim                about 103 KB gzipped, loaded on first use
```

- **Extraction.** `collectReferences()` gathers every reference in the atlas, including references written out in notes ("(John 14:22)"), and the build script extracts exactly those verses. The only processing is decoding XML entities and trimming surrounding whitespace.
- **Loading.** `loadTranslation()` imports the file as its own chunk the first time a passage is shown, and allows a retry after a network failure. Nothing else waits for it.
- **Display.** Scripture is set on a warm "vellum" page in the serif face, always with book, chapter, verse and translation. Editorial text uses a separate component (`AtlasSummary`, labelled "Editorial summary") in the sans face, so it can't be mistaken for Scripture. The reader steps through a sequence of references (previous/next, arrow keys) and offers parallel accounts.
- **More translations.** Translations are registered in `src/data/translations`. Adding one means adding another generated text file beside the WEB.

## Routing and sharing

| URL | View |
| --- | --- |
| `/` | Home: search, an index of the atlas with its counts, and featured journeys |
| `/journeys` | Every route and collection |
| `/journey/:id` | A journey's title page: route, figures, travelers, Begin Journey |
| `/journey/:id?stop=7` | Journey Mode at stop 7, with its Scripture |
| `/place/:id` | A place: what happened there, journeys, people, nearby places, certainty |
| `/person/:id` | A person: names, counts, journeys, the places of their story on the map, events, connected people |
| `/places`, `/people` | Indexes that reach everything without the map |
| `/events` | Every event in the order of the Bible, grouped by book, with its passage, places, people and journey stop; a filter takes words or a reference ("Acts 16") |
| `/about` | About and methodology |

- **Typed routes.** Routes are values such as `{ name: 'journey', id, stop }`, not strings. `parseRoute` and `routePath` convert in both directions, and a test checks the round trip.
- **Router.** `lib/router` is a small History API router built on `useSyncExternalStore`. Each history entry records its depth. The in-app Back button therefore goes back when there is somewhere to go back to, and goes home when the page was opened from a shared link. On the server, `setServerPath` gives the router the page being rendered.
- **Pre-rendering.** The build renders every page on the server (`src/entry-server.tsx`, built with `vite build --ssr`) and `scripts/prerender-pages.ts` writes the HTML into a file per page: 239 in all (each journey, place, person and index), plus `sitemap.xml` and `robots.txt`.
  - The browser hydrates that HTML when it was rendered for the current address, and renders from scratch otherwise. The first paint therefore needs no JavaScript.
  - Each page has its own title, description, canonical URL, and Open Graph and Twitter tags, and preloads the two Latin fonts.
  - The Events directory pre-renders its first book (Matthew, 21 events) and renders the other 201 straight after loading, in the background (`useDeferredValue`). With all 222 the page was 39 KB compressed and scored 89 for mobile performance in Lighthouse; with one book it is 8 KB, like the other directories.
  - The site URL comes from Netlify's `URL` build variable, or from `VITE_SITE_URL` when building elsewhere. `vite preview` serves the pre-rendered files the way Netlify does (a small plugin in `vite.config.ts`).
- **Fallback.** `netlify.toml` sends every other path to `index.html`, where the router shows the right view or a not-found page.

## App shell

- **Map first.** The map fills the window. The interface floats over it: a top bar (brand, search, sections), one panel, and in Journey Mode a timeline rail and a control bar.
- **One panel, two layouts, in CSS.** `Panel` is a floating card on wide screens (about 400 px; narrower in Journey Mode, wider for the People directory) and a bottom sheet on phones, with three snap points (peek, half, full) that can be dragged or flicked; its handle is a button. The layout switches with a media query, so server-rendered HTML matches every screen.
- **Journey Mode.** `/journey/:id?stop=n` shows the stop card (number, place, references, certainty, a verbatim line, editorial summaries), the timeline (a rail on windows 1280 px wide or more, inside the card otherwise) and the controls (previous, next, play, presentation view, exit). The arrow keys move between stops and Escape leaves. On wide screens the top bar's search and sections step back, so the map leads. The presentation view hides the panels and asks the browser for full screen.
- **Insets.** Floating surfaces mark themselves `data-map-obstacle`. `useMapInsets` measures them, so the camera frames content in the part of the map that is actually visible; elements marked `data-map-obstacle="labels"` (the map's own controls) only keep labels clear.
- **Previews.** Pointing at a featured journey highlights its route; a search answer on the home screen moves the map to the stops it names; pointing at a name in the People directory marks that person's places. In the home screen's index, pointing at Journeys & collections strengthens every route, and pointing at Places fades the routes and dots every place (regions, which are areas, excepted). People and Events change nothing on the map. None of these change the address.
- **Counts come from the data.** The home screen's index reads its four numbers from `allJourneys`, `allPlaces`, `allPeople` and `allEvents`. A unit test renders the home screen and compares the numbers with the data; a second test removes items from the data and checks that the numbers follow, so a hard-coded count fails.
- **First paint.** The page as delivered appears at once: entrance animations, route drawing and camera flights start only after the reader's first interaction, so the headline is visible from the first frame and a shared link opens exactly where it points.
- **State.** There is no state library:
  - which view is open lives in the URL;
  - previews, playback, media queries and Smart Search status live in hooks and component state;
  - the Scripture reader and i18n use small context providers.

## Map

`MapStage` checks for WebGL, then lazy-loads `AtlasMap` once the page is idle. MapLibre is the largest dependency, so loading it lazily keeps it from delaying the first paint. When WebGL is missing or the map fails to start, `MapFallback` shows a schematic drawing of the route instead. If map tiles fail (three failures before any tile loads, or six in all), a notice says so, and markers, routes and the panel keep working.

**Phones' opening view.** On phones, the home screen (and the other overview screens) first shows a static picture of the same map, `public/posters/overview-phone.jpg` (54 KB), with the map's attribution as text over it. The live map loads on the first touch, under the picture, which fades once the live map has drawn. A phone's first visit therefore skips the map library and over a megabyte of low-zoom tiles. `npm run map:poster` re-renders the picture from the live map.

**Style** (`atlasStyle.ts`). A light "atlas" built on OpenFreeMap's vector tiles (OpenMapTiles schema):

- warm stone land, a muted Aegean blue sea, and, on wide screens only, Natural Earth relief shading, desaturated;
- quiet grey modern labels (countries, then cities from zoom 7), without the micro-states that would crowd Italy; a label control hides them;
- biblical places named in italic, as on a printed atlas: the best-known places (the most narrated, and where routes begin and end) on the opening view, and every place from zoom 6;
- a cobalt route with a paper casing.

**Scenes** (`scene.ts`). Every view resolves to one of five scenes: `overview`, `journey`, `place`, `places` or `person`. `markersForScene` turns a scene into marker specifications: stop, passed, region, focus, place, area (a region, drawn dashed), origin (a stated home town) or context. A person preview marks places without moving the map.

**Markers.** Markers are React components, rendered through portals into MapLibre markers. Each one is a real `<button>` with an accessible name, a focus ring and the app's typography; dot markers have a 24 px target around the dot.

- A place a journey visits more than once is one button showing one numbered disc per visit, each with its own Journey Mode state. Antioch on the second journey shows (1)(18), not "1 · 18", which read like "stop 1 of 18".
  - Clicking a disc opens that visit; from the keyboard, each activation moves to the next visit.
  - A place with more than four visits (Jerusalem in "Jerusalem in Acts") shows the visit that matters now and a count of the others: (9)(+11).
  - The button's name repeats the numbers in the order shown, so speech input can use them (WCAG 2.5.3): "Stops 1, 18: Antioch", or "Stop 9, +11 more: Jerusalem".

- `labelLayout.ts` positions labels greedily, highest priority first: to the right of the marker if there is room, otherwise to the left, otherwise hidden. The selected stop's label is always shown, and may also sit above or below its marker. A label never covers another marker or label, and stays clear of the map's edges and of anything marked `data-map-obstacle` (the panel, sheet, header, controls) and the attribution.
- Markers that would overlap shrink to dots until the map is zoomed in; the stops the text narrates most stay full size (Philippi before its port, Neapolis). A shrunken marker is `inert`, leaving the tab order and the accessibility tree; its stop stays in the timeline.
- MapLibre's own labels never collide with the HTML markers: an invisible `occupied` symbol layer reserves each marker's and label's space in MapLibre's collision detection.
- Layout runs at most once per animation frame while the map moves, which is cheap with a few dozen markers.

**Routes** (`routeGeometry.ts`). Each leg is a gentle curve between consecutive stops. `legStyle` sets its style from the data:

- dashed for a stated sea leg;
- solid for a stated land or unspecified leg;
- dotted for an implied or uncertain leg.

Opening a journey in the app draws the route progressively: a `requestAnimationFrame` loop updates the line with `setData`, and each marker appears as the line reaches it. In Journey Mode, travelled legs stay strong, legs still ahead are lighter, and the leg arriving at the current stop is darker and wider, keeping its dash pattern.

**Camera.** `sceneCamera` decides where the camera belongs: a scene's bounds, a place, or, in Journey Mode, the current stop (or every place a search answer names). The map starts at that camera, so a shared link never loads the overview on the way, and it moves only when the framing changes.

- MapLibre adds the padding passed to `fitBounds` and `flyTo` to the map's own padding. The map keeps the panel insets as its persistent padding and passes only a small margin to camera calls.
- When the insets change during a flight, the flight is redirected: the camera flies on to the same framing, recomputed for the new insets (`cameraForBounds` with `absolutePadding`). Applying the padding alone is a jump, which stops a flight short. This matters most on entering Journey Mode, when the card, timeline and controls appear as the flight to the first stop begins; before the fix, the second journey's first stop, Antioch, stayed hidden behind the timeline.

**Play journey.** `usePlayback` advances one stop every 3.6 seconds and moves the camera, the timeline and the Scripture together. Choosing a stop by hand pauses playback.

## Search

Search runs in the browser on every keystroke. The query passes through `useDeferredValue`, so typing stays responsive.

```
query ─► analyzeQuery ─► reference, ordinal, people, places, regions,
  │                       before/after, "near", "where" question
  ├─► LexicalIndex ─► keyword score and coverage (exact, prefix, typo-tolerant)
  ├─► intentBoosts ─► e.g. "Acts 16" lifts entries whose passages overlap Acts 16
  ├─► Smart Search ─► similarity per entry, once the model is ready (optional)
  ▼
blend and rank ─► up to 8 results          buildAnswer ─► a grounded answer, or none
```

**Documents.** `buildSearchDocuments()` turns the atlas into 542 entries: 15 journeys, 101 places, 117 people, 222 events and 87 Scripture chapters. Each entry has weighted fields for the keyword index and a plain sentence (`embeddingText`) for the model.

**Keyword index** (`lexical.ts`).

- Text is normalized: lowercased, with accents and punctuation removed.
- Stop words and question words are dropped, and a few synonyms and word stems are applied.
- A query word matches exactly, as a prefix (from three letters), or within a typo budget. The budget is a Damerau–Levenshtein distance of 1 for words of five letters or more, and 2 for eight letters or more. Typo tolerance applies only to words the atlas does not contain, so a real name is never read as a misspelling of another ("Lydia" is not "Lysias").
- Matching a whole name scores extra.

**Intent** (`intent.ts`) recognizes:

- Scripture references the way people type them ("acts 16:9-10", "Jn 3:16", "acts chapter 27");
- ordinals ("2nd journey");
- named people and places, including their other names;
- regions;
- "before", "after" and "near";
- "where" questions.

**Blending.** Each entry scores `keyword + intent boost + meaning`. The meaning term adds up to 26 points as similarity rises from 0.3 to 1. An entry is kept only if one of these holds:

- it matched a keyword;
- it has a strong intent boost, such as a matching reference;
- it is close in meaning: a similarity of at least 0.42, and within 0.1 of the best match.

Two caps keep the list varied: at most five entries found by meaning alone are kept, and every event after the third is demoted. Two unit tests pin the contract: meaning can surface a paraphrase, but it never outranks an exact keyword match.

**Grounded answers** (`answers.ts`). Some questions get a short answer card above the results. Every kind of answer is assembled from the data, and none contains generated text:

| Kind | Example | Built from |
| --- | --- | --- |
| `reference` | "Acts 16" | The stops and events whose passages overlap the reference (route stops first; a collection adds only places the routes don't show) |
| `sequence` | "Where did Paul go after Philippi?" | The next or previous stop on each journey through that place, with every further stop the same verse narrates (Acts 17:1 → Amphipolis · Apollonia · Thessalonica) |
| `event` | "Where was Jesus born?" | The best-matching event. Used only when the event clearly matches the question's action, or involves every person the question names |
| `nearby` | "Places around the Sea of Galilee" | Places within a short distance of the named place |
| `region` | "Paul Macedonia" | A person's stops in a region, grouped by journey (routes; collections only when no route passes through) |

Any other question gets results but no answer card. Tests check that "Where is the Garden of Eden?" and "Where did Paul write Romans?" produce no answer (a book's name, "Romans", is not read as the question's action).

**The answer card is Scripture first** (`AnswerCard.tsx`, built by `answerView.ts`): the reference and its verse quoted verbatim from the WEB, then the answer, then where it comes from in the atlas ("After Philippi · Second Journey · stops 8–10"), marked "Grounded in atlas data". Each block also names a map preview: on the home screen the map moves to the answer while it is shown.

### Choosing the embedding model

Four small sentence-embedding models were compared on 22 everyday-language descriptions. Each description was paired with the entries it should find, for example:

- "a woman who sold expensive purple fabric" should find Lydia;
- "the boat broke apart in a storm" should find the shipwreck.

How they were scored:

- **Top-3 hits:** a query counts as a hit when an expected entry ranks in the top three.
- **MRR:** the mean reciprocal rank of the first expected entry.

All four models ran through Transformers.js with 8-bit weights, against every atlas entry (279 entries at the time; the atlas has grown since, and the choice has not been re-measured).

| Model | Download | Top-3 hits | MRR |
| --- | --- | --- | --- |
| **Xenova/all-MiniLM-L6-v2** (chosen) | 23 MB | 21 / 22 | 0.833 |
| mixedbread-ai/mxbai-embed-xsmall-v1 | 24 MB | 21 / 22 | 0.865 |
| Xenova/bge-small-en-v1.5 | 34 MB | 21 / 22 | 0.853 |
| Snowflake/snowflake-arctic-embed-xs | 23 MB | 20 / 22 | 0.788 |

The differences among the top three are within the noise of a 22-query test. MiniLM was chosen because it is the most widely used. Switching models means editing `SMART_SEARCH_MODEL` and running `npm run data:embeddings`.

## Smart Search (on-device AI)

```
search field focused ─► smartSearch.load() ─► Web Worker
                                               ├─ model: Hugging Face, 23 MB
                                               ├─ ONNX Runtime WebAssembly: jsDelivr, ~7 MB compressed
                                               ├─ precomputed entry vectors: /search, 203 KB
                                               └─ ready: embed each query, compare with every entry
```

- **Loads when you start searching, not on page load.** The worker starts the first time the search field gets focus, or when a suggestion chip runs a search. On Save-Data or 2G connections it waits until the user turns it on from the status menu.
- **Never blocks.** Keyword results appear immediately. Similarities are blended in when they arrive, and responses for an outdated query are ignored.
- **Precomputed vectors.** `scripts/build-embeddings.ts` embeds every entry at build time with the same model and settings (mean pooling, L2-normalized).
  - It stores the vectors as int8 (542 × 384 values, 203 KB), with a manifest of ids and a content hash (FNV-1a over the ids and texts).
  - In the browser, the worker only has to embed the query.
  - If the hash doesn't match the current data, the worker embeds the entries itself, in batches of 32. A forgotten rebuild therefore makes Smart Search slower to start, but its results stay correct.
- **Fails quietly.** Smart Search becomes unavailable if the browser lacks Web Workers or WebAssembly, the worker errors, a download is blocked, or the model hasn't loaded after 90 seconds. The app then carries on with keyword search, and the status chip says so. An end-to-end test blocks Hugging Face and jsDelivr and checks that search still works.
- **Small deploy.** Bundling Transformers.js makes Vite emit about 27 MB of ONNX Runtime WebAssembly that is never requested, because the library loads its runtime from jsDelivr. A small plugin in `vite.config.ts` (`dropUnusedOnnxWasm`) leaves those files out of the build.

## Internationalization

- **Catalogues.** Interface strings live in `src/i18n/locales/en.ts`. Message keys are typed (`MessageKey`), so a missing or misspelled key fails type-checking.
- **Fallback.** `pa.ts` is a `DeepPartial` of the English catalogue, so any key not yet translated falls back to English.
- **Helpers.** `useI18n()` provides:
  - `t`: messages, with placeholders and plurals (`Intl.PluralRules`);
  - `text`: content fields, falling back to English;
  - `ref`: Scripture references in the active language;
  - `number` and `list`: formatting via `Intl.NumberFormat` and `Intl.ListFormat`.
- **Locales.** `src/i18n/config.ts` declares each locale with an `enabled` flag. Punjabi (`pa-Guru`) is declared but stays disabled until it is translated.
- **Launch steps.** See the [Punjabi localization plan](../README.md#punjabi-localization-plan) in the README.

## Accessibility

- **Keyboard.**
  - Every control is reachable in a logical order, with a visible focus ring.
  - A skip link jumps to the main content, and `/` focuses search from anywhere.
  - Map markers are buttons, and so is the bottom sheet's handle. In Journey Mode the arrow keys move between stops and Escape leaves.
- **Search** follows the WAI-ARIA combobox pattern: `aria-activedescendant`, arrow keys, Enter and Escape.
- **The Scripture reader** is a native modal `<dialog>`: focus moves into it, Tab wraps around inside it, and Escape closes it.
- **Screen readers.** A polite live region announces journeys and stop changes ("Stop 7 of 18: Philippi"). After navigation, focus moves to the main content. Button names include their visible text (WCAG 2.5.3), and quotations are figures whose caption is the read button ("Read Acts 16:12 · WEB").
- **Not colour alone.** Certainty is shown as a text label as well as a colour, and route legs differ by dash pattern. Text meets 4.5:1 contrast; the route meets 3:1 against land and sea.
- **Targets.** Map markers are at least 24 px and never overlap; crowded ones shrink and leave the tab order, and their stops stay in the timeline (WCAG 2.5.8).
- **Reduced motion.**
  - Routes appear without being drawn.
  - The camera jumps instead of flying.
  - CSS animations and transitions are switched off.
- **The map is never the only way in.** The Places and People indexes list everything, and the timeline lists every stop. Without WebGL, every journey still works with a schematic map.
- **Checked automatically.** axe-core (WCAG 2.1 A/AA) runs on every kind of page, the open search answer and the Scripture reader, on desktop and phone sizes (`e2e/a11y.spec.ts`).

## Performance

| What | Size (compressed) | When it loads |
| --- | --- | --- |
| Pre-rendered HTML and CSS | about 8 KB + 12 KB | First paint (no JavaScript needed) |
| App JavaScript: React, the atlas data (about 80 KB), search, interface | 191 KB | After first paint (hydration) |
| Fonts: Inter and Newsreader, variable WOFF2, Latin subsets, preloaded | 48 KB + 132 KB | First paint |
| Phones' opening view: a picture of the map | 54 KB | First paint (phones, overview screens only) |
| Map: MapLibre and map code, map CSS, MapLibre worker | 287 KB + 10 KB + 144 KB | When the page is idle (phones' opening view: on the first touch) |
| Map tiles and relief shading | Varies; low-zoom tiles are 400–700 KB each | From OpenFreeMap, as the map moves |
| Scripture text | 103 KB | The first time a passage is shown |
| Smart Search worker | 156 KB | First search |
| Smart Search model, runtime and vectors | About 30 MB, then cached by the browser | First search (see above) |

Measured with `npm run qa:lighthouse` (median of three runs per page, mobile with Lighthouse's simulated slow 4G and 4× CPU): see the README for the current figures.

Other measures:

- **Server-rendered first paint.** Every page is pre-rendered, so text appears before any JavaScript runs; entrance animations wait for the first interaction, so the headline is the largest paint.
- **The map starts where it belongs.** A page opened directly frames its own scene at once, without downloading the overview's tiles or flying.
- **Caching.** Hashed assets are served as immutable (`netlify.toml`), and the `/search` files are cached for a day.
- **Preconnect.** `index.html` preconnects to the tile server.
- **Main thread.** The embedding model runs in a Web Worker, and MapLibre does its tile work in its own worker. Typing, panning and the panel stay smooth while either is busy.
- **Fonts** are self-hosted through Fontsource, so there is no third-party font request.

## Testing

| Layer | Tool | Covers |
| --- | --- | --- |
| Types and lint | `tsc -b` (strict); oxlint with `--deny-warnings` | The whole codebase |
| Unit (67 tests in 10 files) | Vitest | Data integrity (the Twelve, Matthias, Timothy, aliases, relationships, derived participants, 18 stops); content QA (verbatim quotations, coordinate provenance, narrative order, answers always citing Scripture); Scripture coverage; reference parsing; routes; search ranking and answers; Smart Search blending; label layout; map colour contrast; the home screen's counts, read from the data |
| Data verification | `npm run data:verify` | Every coordinate against its source, and every certainty label against its score |
| End-to-end (43 tests, each on desktop and phone) | Playwright with Chromium | See the list below |
| Accessibility | axe-core in Playwright | WCAG 2.1 A/AA on every kind of page (map pages once their markers are drawn), the search answer and the reader |
| Other browsers | `npm run test:e2e:browsers` (Firefox); a WebKit 18.4 script for Safari's engine | The same flows |
| Performance | `npm run qa:lighthouse` | Lighthouse on six pages, mobile and desktop, with targets |

The end-to-end suite covers:

- the opening view, and opening a journey from search; grounded answers, and no answer when the data has none; the keyboard combobox;
- a journey's title page, Journey Mode from the buttons and from the keyboard (with announcements), shared stop links, reload and reduced motion;
- a place visited twice (Antioch): one disc per visit, the first stop brought into view by Begin Journey, and each disc opening its own visit;
- the Scripture reader (references, focus kept inside, Escape);
- collections not drawn as routes; the Final Week; certainty labels;
- the People directory, Timothy, Thaddaeus, an original apostle and Matthias;
- the home screen's index: its counts against the data, each link's destination, and the keyboard;
- the Events directory: filtering by a reference and by a name, and each event's passage, place, person and journey links;
- the not-found page, the places index, and no sideways scrolling;
- keyword search with the AI model blocked, failing map tiles, and the no-WebGL fallback.

`npm run check` runs type-checking, lint and the unit tests. `npm run test:e2e` runs the end-to-end suite against the production build.

## Future: Ask Bible Atlas (Claude + retrieval)

Version 1 deliberately ships no generative AI: every answer is assembled from data. Version 2 would accept free-form questions without giving up that guarantee, for example "Why did Paul go to Macedonia?" or "What happened in Ephesus?". Claude would write the prose, and the atlas would remain the only source of facts. Nothing in V1 depends on this design, and V1 needs no Anthropic credentials.

### Flow

```
1. Question           typed into search; keyword results appear immediately, as today
2. Retrieve           the existing search picks the most relevant atlas entries
   (browser)          (events, stops, places, people) and sends their ids with the question
3. Build evidence     a server function looks those ids up in its own copy of the atlas:
   (server)           summaries, certainty labels, location notes, and the verbatim WEB
                      verses of their passages, as numbered evidence items
4. Ask Claude         only the question and the evidence are sent
   (server)
5. Validate           every claim must cite evidence; every place, journey and reference
   (server, browser)  must come from the evidence; any failure discards the answer
6. Show               the answer above the results, with numbered sources; cited passages
   (browser)          open the Scripture reader; cited places become a map scene
```

### Server function

- **One endpoint.** A Netlify Function, served at `/api/ask`, holds the Anthropic API key as a Netlify environment variable. The key never reaches the browser, and the static site stays as it is.
- **Narrow input.** The function accepts only:
  - a question of up to 300 characters;
  - up to 12 atlas ids.

  It builds the evidence itself from the same data modules the app uses, so the endpoint can't be used to send arbitrary text to Claude.
- **Request settings.**

  | Setting | Choice | Why |
  | --- | --- | --- |
  | Model | `claude-opus-5-5` | Careful reading of the evidence matters more than speed, and short answers keep the cost per question low |
  | Effort | Set explicitly, starting at `low` | Answers are short and grounded. Raise effort only if the evaluation shows it helps |
  | Output | Structured outputs (`output_config.format`) using the answer schema below | The app needs ids it can check, not free text |
  | Prompt order | Fixed system prompt first; evidence and question after it | Lets prompt caching reuse the fixed part once it is long enough to qualify |
  | Refusals | Check `stop_reason` before reading the answer, and opt into server-side fallbacks (`fallbacks: "default"`, a beta feature) | A declined request falls back to V1 results instead of an error |
  | Streaming to the reader | None | An answer is shown only after it validates |

- **System prompt rules:**
  - answer only from the evidence, and cite evidence for every sentence;
  - when the evidence doesn't answer the question, say so (`insufficient`);
  - keep certainty labels ("a traditional site", "the location is debated");
  - when Gospel accounts differ, say so instead of harmonizing;
  - describe what the text says; take no denominational or devotional position;
  - don't quote Scripture.

### Answer schema

```ts
interface AskAnswer {
  status: 'answered' | 'insufficient'
  /** Each sentence cites the evidence items it relies on, e.g. ["E2", "E5"]. */
  sentences: Array<{ text: string; evidence: string[] }>
  /** Places to show on the map. */
  placeIds: string[]
  /** Optional focus, e.g. a journey opened at a stop. */
  journey?: { id: string; stop?: number }
}
```

**Scripture is never quoted by the model.** The answer cites passages through its evidence. The app then shows those verses itself, from the WEB file, exactly as V1 does, so a misquotation can't occur.

### Validation

Validation runs on the server, and again in the browser, which already has the whole atlas:

1. `insufficient` → show the V1 results with "The atlas doesn't cover this yet."
2. Every sentence cites at least one evidence item, and every item it cites exists.
3. Every place id, journey id and stop number exists in the atlas *and* appears in the evidence.
4. Any reference written in the prose (found with the existing `findReferenceInText`) must lie inside a cited passage (`rangeContains`).
5. Any failure discards the answer instead of repairing it. The case is logged for the evaluation set, and the reader sees the V1 results.

The map needs no new code: `placeIds` becomes the existing `places` scene, and `journey` becomes a normal journey route.

### Cost, abuse and privacy

- **Limits.** Per-visitor rate limits, the 300-character question cap, ids-only evidence, and a spend limit on the Anthropic workspace.
- **Caching.** Identical questions with the same evidence and the same data version get a cached answer. The data version is the content hash that Smart Search already computes.
- **Cost.** A question is roughly 6,000 input tokens and well under 1,000 output tokens, a few cents each.
- **Privacy.** Questions go to the function and to Anthropic; nothing else is sent. The About page would say so. There are still no accounts and no stored history.

### Evaluation before launch

- **The question set:**
  - the V1 example queries and the 22 paraphrases used to choose the embedding model;
  - questions the atlas can't answer ("When was Paul born?");
  - contested questions ("Where was Jesus buried?");
  - attempts to make it ignore its rules.
- **Automatic measures:** how often answers are discarded, how often `insufficient` is correctly returned, and whether citations are correct. Shown answers are valid by construction, so the discard rate is the quality signal.
- **Human review:** a sample of answers checked for faithfulness to the cited passages and for neutrality, before launch and after any change to the prompt or model.

### Alternatives considered

- **Let Claude search the atlas with tools.** Retrieval is already good and deterministic. One call is cheaper and faster than a tool loop, and the evidence stays inspectable. A `search_atlas` tool could come later, for follow-up questions.
- **Citations API.** It ties prose to source passages well, but it can't be combined with structured outputs, and the map needs place ids it can check. Evidence ids in the schema provide both.
