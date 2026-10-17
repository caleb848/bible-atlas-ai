import { en } from '../text'
import type { Place } from '../types'
import { openBible, pleiades, wikidata } from './sources'

/**
 * Further Gospel places, people and events: John the Baptist, the Twelve, the trials, the resurrection appearances. Each event cites one account; parallels are in relatedRefs.
 */
export const gospelsExtendedPlaces: Place[] = [
  {
    id: 'galilee',
    name: en('Galilee'),
    kind: 'region',
    modern: { name: en('Galilee'), area: en('Israel') },
    coordinates: [35.527, 32.76],
    certainty: 'approximate',
    certaintyNote: en('A region; the marker is a representative point (OpenBible.info).'),
    summary: en(
      'The region of Nazareth, Cana and Capernaum, where the Gospels set much of Jesus’ ministry. Herod was its tetrarch, and Matthew says the eleven disciples met the risen Jesus on a mountain in Galilee.',
    ),
    refs: ['LUK 1:26', 'MRK 1:14', 'MRK 1:39', 'LUK 3:1', 'MAT 28:16'],
    sources: [openBible('a9cf1e8'), pleiades('678145'), wikidata('Q83241')],
  },
  {
    id: 'judea-wilderness',
    name: en('Wilderness of Judea'),
    searchTerms: ['Judaean Desert', 'Judean Desert'],
    kind: 'region',
    ancientRegion: en('Judea'),
    modern: { name: en('Judaean Desert'), area: en('West of the Dead Sea') },
    coordinates: [35.3, 31.7],
    certainty: 'approximate',
    certaintyNote: en(
      'A region; the marker is a representative point (Wikidata). It is generally taken to be the dry country that falls from the Judean hills to the Dead Sea and the lower Jordan valley. OpenBible.info and Pleiades have no separate record for it.',
    ),
    summary: en(
      'Matthew says John the Baptizer came preaching in the wilderness of Judea, and that people went out to him from Jerusalem, Judea and the region around the Jordan.',
    ),
    refs: ['MAT 3:1-6'],
    sources: [wikidata('Q2046004')],
  },
  {
    id: 'judean-hill-country',
    name: en('Hill country of Judea'),
    searchTerms: ['Judaean Mountains', 'Judean hills'],
    kind: 'region',
    ancientRegion: en('Judea'),
    modern: { name: en('Judaean Mountains'), area: en('Around Jerusalem, Bethlehem and Hebron') },
    coordinates: [35.166667, 31.666667],
    certainty: 'approximate',
    certaintyNote: en(
      'A region; the marker is a representative point (Wikidata, Judaean Mountains). Luke names the hill country and “a city of Judah” but not the town. Later tradition places the home of Zacharias and Elizabeth at Ein Karem, west of Jerusalem; the atlas does not mark it.',
    ),
    summary: en(
      'Mary went into the hill country, to a city of Judah, and greeted Elizabeth in the house of Zacharias. After John was born, Luke says, these things were talked about throughout all the hill country of Judea.',
    ),
    refs: ['LUK 1:39-40', 'LUK 1:65'],
    sources: [wikidata('Q2328820')],
  },
  {
    id: 'aenon',
    name: en('Enon'),
    alternateNames: ['Aenon'],
    searchTerms: ['Aenon near Salim', 'Salim', 'Umm el-Umdan'],
    kind: 'site',
    modern: { name: en('Umm el-Umdan (one proposed site)'), area: en('Jordan Valley') },
    coordinates: [35.52821, 32.38152],
    certainty: 'debated',
    certaintyNote: en(
      'John places Enon near Salim, where there was much water, but neither place is securely located. The marker shows Umm el-Umdan in the Jordan valley, OpenBible.info’s leading candidate; Khirbet Einun, north-east of Nablus, has also been proposed.',
    ),
    summary: en(
      'John the Baptist was baptizing at Enon near Salim, because there was much water there, while Jesus and his disciples were in Judea.',
    ),
    refs: ['JHN 3:22-30'],
    sources: [openBible('a112fe3'), wikidata('Q5977371')],
  },
  {
    id: 'magdala',
    name: en('Magdala'),
    searchTerms: ['Magadan', 'Migdal', 'Majdal'],
    kind: 'town',
    ancientRegion: en('Galilee'),
    modern: { name: en('Magdala archaeological site, near Migdal'), area: en('Israel') },
    coordinates: [35.513552, 32.827069],
    certainty: 'identified',
    certaintyNote: en(
      'Magdala is identified with the ruins at Majdal (Migdal) on the western shore of the Sea of Galilee. In Matthew 15:39 many manuscripts and modern translations read Magadan, usually taken as another name for Magdala; Mark’s parallel names Dalmanutha (Mark 8:10).',
    ),
    summary: en(
      'After sending the crowds away, Jesus came by boat into the borders of Magdala, where Pharisees and Sadducees came and asked him for a sign from heaven.',
    ),
    refs: ['MAT 15:39-16:4'],
    sources: [openBible('af75e9e'), openBible('ad14067'), wikidata('Q4880851')],
  },
]
